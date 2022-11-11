const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

// port 
const port = process.env.PORT || 5000;

//middle ware 
app.use(cors());
app.use(express.json());


//testing server
app.get('/', (req, res) => {
    res.send('photography server running')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.72thnns.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const photoCollection = client.db('wildPhotos').collection('services');
        const reviewCollection = client.db('wildPhotos').collection('reviews');

        //API for getting services
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = photoCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //API for get services by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await photoCollection.findOne(query);
            res.send(service);
        });

        //API for insert a service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await photoCollection.insertOne(service);
            res.send(result)
        })

        //review api by id
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            console.log(req.body)
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    message: req.body.message
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);

            res.send(result);
        })

        //api for query by email
        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        //API for requesting to body
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });

        // API for deleting by id
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
// for error 
run().catch(error => console.log(error))



app.listen(port, () => {
    console.log(`photography server running on port ${port}`);
});