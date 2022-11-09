const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

 

app.get('/', (req, res) =>{
    res.send('photography server running')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.72thnns.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run () {
    try{
        const photoCollection = client.db('wildPhotos').collection('services');
        const reviewCollection = client.db('wildPhotos').collection('reviews');

        app.get('/services', async(req,res) =>{
            const query = {}
           const cursor = photoCollection.find(query);
           const services = await cursor.toArray();
           res.send(services);
        });

        app.get('/services/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await photoCollection.findOne(query);
            res.send(service);
        });

        //review api
        app.post('/reviews', async(req,res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
    }
    finally{

    }
}

 run().catch(error => console.log(error))



app.listen(port, () =>{
    console.log(`photography server running on port ${port}`);
})