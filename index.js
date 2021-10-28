const express = require('express')
const { MongoClient } = require('mongodb');
const objectId =require('mongodb').ObjectID;


const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.go6jz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        const database = client.db('carMechanic')
        const servicesColection = database.collection('services')

        //GET APi

        app.get('/services', async(req,res)=>{
            const cursor = servicesColection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //GET SINGLE SERVIEC

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('getting specific id', id);
            const query ={ _id : objectId(id)}
            const service = await servicesColection.findOne(query)
            res.json(service)
        })

        //POST API
        app.post('/services', async(req,res)=>{

            const service = req.body;

            console.log('hit the post api', service);

            // const service = {
            //             "name": "ENGINE DIAGNOSTIC",
            //             "price": "300",
            //             "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //            "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            //   }
              const result = await servicesColection.insertOne(service);
              console.log(result);
            res.json(result)
        })

        //delete api
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query ={_id : objectId(id)}
            const result = await servicesColection.deleteOne(query)
            res.send(result)

        })


    }finally{
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req,res)=>{
    res.send('runnig genius server')
})

app.listen(port,()=>{
    console.log('runnig genius server on port', port);
})