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

app.use(function(req, res, next) {
    res.setHeader("X-Logger-Middleware", "executed");

    console.log("Request received:", req.method, req.originalUrl);
    

    next();
});
app.use("/images", express.static(__dirname + "/public"));
console.log("Public folder:", __dirname + "/public");

console.log("PUT ROUTE TEST: server.js loaded");


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

app.get("/search", async function(req, res)
{
     console.log("NEW SEARCH ROUTE IS RUNNING");
    try{
        var searchTerm = req.query.search;
        if (!searchTerm) {
            return res.status(400).json({message: "Please enter a search term"});
        }
        searchTerm = searchTerm.trim();

        var searchConditions = [
            {subject: {$regex: searchTerm, $options: "i"}},
            {location: {$regex: searchTerm, $options: "i"}}
        ];

        if(!isNaN(searchTerm)) {
            searchConditions.push({price: Number(searchTerm)});
            searchConditions.push({spaces: Number(searchTerm)});
        }


        var lessons = await database.collection("lessons").find({
            $or: searchConditions
        }).toArray();

        res.status(200).json(lessons);
    } catch(error) {
        console.log("Error searching lessons: ", error);
        res.status(500).send("Error searching lessons");
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
