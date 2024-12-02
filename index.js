const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhw49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // POST route to add new coffee
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log('New coffee received:', newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // GET route (optional)
    app.get('/coffee', async (req, res) => {
      const coffees = await coffeeCollection.find({}).toArray();
      res.send(coffees);
    });

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Ensure connection is alive
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Coffee server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
