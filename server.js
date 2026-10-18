var express=require("express");
var  cors=require("cors");
var app=express();

app.use(cors());

var lessons=[
    {
        id:1001,
        subject:"Computer Science",
        location:"Hendon",
        price: 700,
        available: 5,
        imagePath:"images/computer science lesson.jpg",
        imageAlt:"Computer Science Lesson"
    },
        
       
    {
      id:1002,
        subject:"Mathematics",
        location:"Lagos, Nigeria",
        price: 1000,
        available: 5,
        imagePath:"images/mathematics lesson for coursework.jpg",
        imageAlt:"Mathematics Lesson"
    },
   
    {
       id:1003,
        subject:"English Language",
        location:"Heathrow, London",
        price: 1500,
        available: 5,
        imagePath:"images/english language picture for coursework.jpg",
        imageAlt:"English Language Lesson"
    }
]

app.get("/", function(req, res){
    res.json(lessons);
    console.log("A request was received.")
});

app.listen(3000, function(){
    console.log("Server is running at port 3000")
});