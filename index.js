const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const allToysCollection = client.db('sportToysDB').collection('allToysData');
        const addToyCollection = client.db('sportToysDB').collection('addToyData');



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

        app.get('/toys', async (req, res) => {
            const cursor = allToysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allToysCollection.findOne(query);
            res.send(result);
        })

        /*------------------------
            AddToy collection
        ------------------------*/
        // Post data from client side to server mongoDB
        app.post('/addToys', async (req, res) => {
            const addToy = req.body;
            const result = await addToyCollection.insertOne(addToy);
            res.send(result);
        })

        // get data from addToy collection in mongodb
        app.get('/addToys', async (req, res) => {
            const cursor = addToyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        // get data with specific id from addToy collection in mongodb
        app.get('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToyCollection.findOne(query);
            res.send(result);
        })

        // get some toys data with email specific
        app.get('/specificToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await addToyCollection.find(query).toArray();
            res.send(result);
        })

        // delete a toy data in My Toys Page from db
        app.delete('/specificToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addToyCollection.deleteOne(query);
            res.send(result);
        })

        // update a toy in My Toys page from db
        app.patch('/specificToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedToy = req.body;
            const updateDB = {
                $set: {
                    toyPrice: updatedToy.toyPrice,
                    toyQuantity: updatedToy.toyQuantity,
                    toyDes: updatedToy.toyDes
                },
            }
            const result = await addToyCollection.updateOne(filter, updateDB);
            res.send(result);
        })

        // one toy data for updating
        app.get('/specificToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToyCollection.findOne(query);
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