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

app.get("/teachers", async function(req, res) {
    try {
        var teachers = await database.collection("Teachers").find().toArray();
        res.send(teachers);
    } catch(error) {
        console.log("Error retrieving teachers: ", error);
        res.status(500).send("Error retrieving teachers");
    }
});

app.get("/teachers/:id/lessons", async function(req, res) {
    try{
        var teacherId = Number(req.params.id);
        var teacher = await database.collection("Teachers").findOne({id: teacherId});

        if (!teacher) {
            return  res.status(404).send("Teacher not found");
        }

        var lessons = await database.collection("lessons").find({
            id: {
                $in: teacher.lessonIds
            }
        }).toArray();

        res.send(lessons);
    } catch(error) {
        console.log("Error retrieving teacher lessons: ", error);
        res.status(500).send("Error retrieving teacher lessons");
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

app.get("/enrolment/:lessonid", async function(req, res) {
    try{
        var lessonId = Number(req.params.lessonid);
        
        var result = await database.collection("orders").aggregate([
            {$unwind: "$lessonIds"},
            {$match: {lessonIds: lessonId}},
            {$count: "totalEnrolments"}
        ]).toArray();

        var totalEnrolments = 0;
        if(result.length > 0) {
            totalEnrolments = result[0].totalEnrolments;
        }
        res.send({
            lessonId: lessonId,
            totalEnrolments: totalEnrolments
        });
    } catch(error) {
        console.log("Error retrieving enrolments: ", error);
        res.status(500).send("Error retrieving enrolments");
    }
});

app.post("/orders", async function(req, res) {
    try{
        var order = req.body;
        var result = await database.collection("orders").insertOne(order);

        res.send("Order saved succesfully");
    } catch(error){
        console.log("Error saving order", error);
        res.status(500).send("ERROR HANDLER: " + error.message);
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
