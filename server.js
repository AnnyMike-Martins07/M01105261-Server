require ("dotenv").config();
var express = require("express");
var cors = require("cors");
var {MongoClient} = require("mongodb");

var app = express();

var uri = process.env.MONGODB_URI;
var client = new MongoClient(uri);

var database = client.db("cst3144");

app.use(cors());
app.use(express.json());
app.get("/", function(req, res) {
    res.send("Backend is working!");
});

app.get("/lessons", async function(req, res) 
{try{
    var lessons = await database.collection("lessons").find().toArray();
    res.send(lessons); }
    catch(error) {
        res.status(500).send("Error retrieving lessons: ");
    
    }

});

async function startServer() {
    try{
        await client.connect();
        console.log("Connected to MongoDB");
    app.listen(3002, function() {
        console.log("Server is running on port 3002");
    });
    
}catch(error) {
    console.log("MongoDB connection failed: ", error);
}
}

startServer();
