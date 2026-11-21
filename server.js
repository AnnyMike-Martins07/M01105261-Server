var express = require("express");
var cors = require("cors");

var app = express();

app.use(cors());
app.use(express.json());
app.get("/", function(req, res) {
    res.send("Backend is working!");
});
app.listen(3001,function() {
    console.log("Server is running on port 3000");
});