require ("dotenv").config();
var express = require("express");
var cors = require("cors");
var {MongoClient} = require("mongodb");

var app = express();

var uri = process.env.MONGODB_URI;
var client = new MongoClient(uri);

app.use(cors());
app.use(express.json());
app.get("/", function(req, res) {
    res.send("Backend is working!");
});

async function startServer() {
    try{
        await client.connect();
        console.log("Connected to MongoDB");
    app.listen(3001, function() {
        console.log("Server is running on port 3001");
    });
    
}catch(error) {
    console.log("MongoDB connection failed: ", error);
}
}

startServer();
