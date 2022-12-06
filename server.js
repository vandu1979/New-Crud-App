/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path"); // built in node module we use to resolve paths more on this when we use it

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

  ////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose using object destructuring
const { Schema, model } = mongoose;

// make fruits schema
const fruitsSchema = new Schema({
  name: String,
  color: String,
  readyToEat: Boolean,
});

// make fruit model
const Fruit = model("Fruit", fruitsSchema);
/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = express();
app.engine('jsx', require('express-react-views').createEngine());
app.set('view engine', 'jsx');

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

////////////////////////////////////////////
// Routes 
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.");
  });
  // Index route
app.get("/fruits", (req, res) => {
    // find all the fruits
    Fruit.find({})
      // render a template after they are found
      .then((fruits) => {
        res.render("fruits/Index", { fruits });
      })
      // send error as json if they aren't
      .catch((error) => {
        res.json({ error });
      });
  });
  // New Route
  app.get("/fruits/new", (req, res)=>{
    res.render("fruits/New")
  })
  // create route
  app.post("/fruits", (req, res) => {
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // create the New fruit
    Fruit.create(req.body)
      .then((fruits) => {
        // redirect user to Index page if successfully created item
        res.redirect("/fruits");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });
  
  app.delete("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // delete the fruit
    Fruit.findByIdAndRemove(id)
      .then((fruit) => {
        // redirect to main page after deleting
        res.redirect("/fruits");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });
  

  app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
      { name: "Orange", color: "orange", readyToEat: false },
      { name: "Grape", color: "purple", readyToEat: false },
      { name: "Banana", color: "orange", readyToEat: false },
      { name: "Strawberry", color: "red", readyToEat: false },
      { name: "Coconut", color: "brown", readyToEat: false },
    ];
     // Delete all fruits
  Fruit.deleteMany({}).then((data) => {
    // Seed Starter Fruits
    Fruit.create(startFruits).then((data) => {
      // send created fruits as response to confirm creation
      res.json(data);
    });
  });
});

//update route
app.put("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // update the fruit
    Fruit.findByIdAndUpdate(id, req.body, { new: true })
      .then((fruit) => {
        // redirect to main page after updating
        res.redirect("/fruits");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });

// Edit route
app.get("/fruits/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the database
    Fruit.findById(id)
      .then((fruit) => {
        // render Edit page and send fruit data
        res.render("fruits/Edit.jsx", { fruit });
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });
// Show route
app.get("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
  
    // find the particular fruit from the database
    Fruit.findById(id)
      .then((fruit) => {
        // render the template with the data from the database
        res.render("fruits/Show", { fruit });
      })
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });

  //////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));