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
        const bookingCollection = database.collection("BookingList");
        

        // GET API (all packages)
        app.get('/allpackages',async(req,res)=>{
            const query = {};
            const cursor = packagesCollection.find(query);
            const packages = await cursor.toArray();
            res.json(packages)
        })

        // GET API (single package by ID)
        app.get('/package/:id',async(req,res)=>{
            const {id} = req.params;
            const query = {_id:ObjectId(id)}
            const package = await packagesCollection.findOne(query)
            res.json(package)
        })

        // POST API (insert a new package)
        app.post('/package/add',async(req,res)=>{
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.json(result)
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

        // GET API (single blog by ID)
        app.get('/blogs/:id',async(req,res)=>{
            const {id} = req.params;
            const query = {_id:ObjectId(id)}
            const blog = await blogsCollection.findOne(query)
            res.json(blog)
        })

        // GET API (all bookings)
        app.get('/all-bookings',async(req,res)=>{
            const query = {};
            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings)
        })

        // POST API (user specifiq booking package list )
        app.post('/user/bookings', async(req,res)=>{
            const queryEmail = req.body.userEmail;
            const query = {email:queryEmail}
            const cursor = bookingCollection.find(query);
            const bookingList = await cursor.toArray();
            res.json(bookingList)
        })

        // POST API (insert booking information)
        app.post('/booking', async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result)
        })

        // DELETE API (delete booking by ID)
        app.delete('/user/booking/remove',async(req,res)=>{
            const id = req.body.id;
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })

        // PUT API (Update booking Status)
        app.put(`/booking/updateStatus/:id`, async(req,res)=>{
            const id = req.params.id;
            const newStatus = req.body.status;
            const filter = {_id:ObjectId(id)}
            const options = {upsert: true}
            const updateStatus ={$set:{status:newStatus}}
            const result = await bookingCollection.updateOne(filter,updateStatus,options)
            res.json(result);
        })


    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

// initial test server run 
app.get('/',(req,res)=>{
    res.send("Running Holiday Vision Server!")
})
// port listen  
app.listen(port,()=>{
    console.log("Server is running on port ",port);
})