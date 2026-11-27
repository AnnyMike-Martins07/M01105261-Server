require ("dotenv").config();

var {MongoClient} = require("mongodb");

var uri = process.env.MONGODB_URI;
var client = new MongoClient(uri);

var lessons = [
   { id: 1, subject: "Mathematics", location: "Hendon, London", price: 1500, spaces: 5, image: "Images For Annie's Frontend/mathematics_image.jpg" },
   { id: 2, subject: "English", location: "Tennesse, America", price: 2500, spaces: 5, image: "Images For Annie's Frontend/english lesson image.jpg" },
   { id: 3, subject: "French", location: "Lyon, France", price: 1580, spaces: 5, image: "Images For Annie's Frontend/french lesson.jpg" },
   { id: 4, subject: "History", location: "Abuja, Nigeria", price: 1200, spaces: 5, image: "Images For Annie's Frontend/history lesson.webp"  },
   { id: 5, subject: "Music", location: "Kara, Togo", price: 950, spaces: 5, image:  "Images For Annie's Frontend/music lesson.jpg" },
   { id: 6, subject: "Business Administration", location: "Hendon, London", price: 1500, spaces: 5, image: "Images For Annie's Frontend/Business-Administration-Course.jpg"  },
   { id: 7, subject: "Digital Marketing", location: "Texas, America", price: 1100, spaces: 5, image: "Images For Annie's Frontend/Digital-Marketing-Course.png" },
   { id: 8, subject: "Web Design", location: "Lagos, Nigeria", price: 1000, spaces: 5, image: "Images For Annie's Frontend/web design.jpg" },
   { id: 9, subject: "Swimming", location: "Paris, France", price: 1200, spaces: 5, image:"Images For Annie's Frontend/swimming lessons.jpg" },
   { id: 10, subject: "Science", location: "Edmonton, Canada", price: 1600, spaces: 5, image: "Images For Annie's Frontend/science lessons.jpeg" },
];

async function addLessons() {
    try{
        await client.connect();
        var database = client.db("CST3144");

        await database.collection("lessons").deleteMany({});
        await database.collection("lessons").insertMany(lessons);

        console.log("10 lessons added succesfully")
    } catch(error) {
        console.log("Error adding lessons: ", error);
    } finally{
        await client.close();
    }
}
addLessons();