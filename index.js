const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



/*-------------------------
    Code from mongoDB
--------------------------*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjja2r0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        // collection in sportToysDB from MongoDB
        const skateboardCollection = client.db('sportToysDB').collection('Skateboard');
        const golfSetCollection = client.db('sportToysDB').collection('GolfSet');
        const plasticToysCollection = client.db('sportToysDB').collection('PlasticToys');



        // get data fom mongodb
        app.get('/skateboardToys', async (req, res) => {
            const cursor = skateboardCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/golfsetToys', async (req, res) => {
            const cursor = golfSetCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/plasticToys', async (req, res) => {
            const cursor = plasticToysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Toy Market Place is Running!!');
})

app.listen(port, () => {
    console.log(`Toy market is running on port: ${port}`);
})