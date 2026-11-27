require ("dotenv").config();
var express = require("express");
var cors = require("cors");
var {MongoClient} = require("mongodb");

var app = express();

var uri = process.env.MONGODB_URI;
var client = new MongoClient(uri);

var database = client.db("CST3144");

app.use(cors());
app.use(express.json());

console.log("PUT ROUTE TEST: server.js loaded");

app.use(function(req, res, next) {
    console.log("Request received:", req.method, req.url);
    next();
});
app.get("/", function(req, res) {
    res.send("TEST 123 - My current server.js");
});

app.get("/lessons", async function(req, res) 
{try{
    var lessons = await database.collection("lessons").find().toArray();
    res.send(lessons); }
    catch(error) {
        res.status(500).send("Error retrieving lessons: ");
    
    }

});

app.put("/lessons/:id", async function(req, res) {
    try{
        var lessonId = Number(req.params.id);
        var updatedLesson = req.body;

        var result = await database.collection("lessons").updateOne(
        {id: lessonId},
        {$set: updatedLesson}
        );

        if (result.matchedCount === 0) {
            res.status(404).send("Lesson not found");
        } else{
            res.send("Lesson updated successfully");
        }
    } catch(error) {
        console.log("Error updating lesson: ", error);
        res.status(500).send(error.message);
    }
});

console.log("PUT ROUTE REGISTERED");
app.post("/orders" , async function(req, res) {
    try{
        var order = req.body;
        var result = await database.collection("orders").insertOne(order);

        res.send("Order saved successfully");
    } catch(error) {
        console.log("Error saving order", error);
        res.status(500).send("ERROR HANDLER: " + error.message);
    }
})

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
