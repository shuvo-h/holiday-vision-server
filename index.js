// require and import 
const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// app and port 
const app = express();
const port = process.env.PORT || 5000;

// middle wear 
app.use(cors());
app.use(express.json());

// user info 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// server run function 
async function run(){
    try{
        await client.connect();

        const database = client.db("HolydayVision");
        const packagesCollection = database.collection("AllPackages");
        const destinationCollection = database.collection("destinations");
        const blogsCollection = database.collection("Blogs");
        

        // GET API (all packages)
        app.get('/allpackages',async(req,res)=>{
            const query = {};
            const cursor = packagesCollection.find(query);
            const packages = await cursor.toArray();
            res.json(packages)
        })

        // GET API (based on single ID)
        app.get('/package/:id',async(req,res)=>{
            const {id} = req.params;
            const query = {_id:ObjectId(id)}
            const package = await packagesCollection.findOne(query)
            res.json(package)
        })

        // GET API (all destinations)
        app.get('/alldestinations',async(req,res)=>{
            const query = {};
            const cursor = destinationCollection.find(query);
            const destinations = await cursor.toArray();
            res.json(destinations)
        })

        // GET API (all blogs and Experience)
        app.get('/allblogs',async(req,res)=>{
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.json(blogs)
        })


    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

// initial test server run 
app.get('/',(req,res)=>{
    console.log("Running server");
    res.send("i am server")
})
// port listen  
app.listen(port,()=>{
    console.log("Server is running on port ",port);
})