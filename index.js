const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const favicon = require("express-favicon");

const app = express();

const port = process.env.PORT || 3001;

//favicon
app.use(favicon(__dirname + "/public/favicon.png"));

// Set templating engine to ejs
app.set("view engine", "ejs");

// Serving static files
app.use(express.static("public"));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware for method-overide
app.use(methodOverride("_method"));

// Connecting to MongoDB Atlas database
const url = "ADD-YOUR-OWN-MONGODB-ATLAS-CONNECTION-STRING-HERE";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.log(err));

// IMPORT DIARY MODEL
const Diary = require("./models/Diary");

// Route for /(home)
app.get("/", (req, res) => {
  res.render("Home");
});

// Route for /about
app.get("/about", (req, res) => {
  res.render("About");
});

// Route for displaying records
app.get("/diary/:id", (req, res) => {
  // Get record by ID from database
  Diary.findById(req.params.id)
    .exec()
    .then((data) => {
      res.render("Page", { data: data });
    })
    .catch((error) => {
      res.send(error);
    });
});

//Route for editing page
app.get("/diary/edit/:id", (req, res) => {
  //Get record by id from db
  Diary.findById(req.params.id)
    .exec()
    .then((data) => {
      res.render("Edit", { data: data });
    })
    .catch((error) => {
      res.send(error);
    });
});
//Route for updating records in the DB
app.put("/diary/edit/:id", (req, res) => {
  //Find record by id
  Diary.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  }).then(() => {
    res.redirect("/diary");
  });
});

// Route for deleting record in DB
app.delete("/diary/delete/:id", (req, res) => {
  // Find record by id and delete
  Diary.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/diary");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route for /diary page
app.get("/diary", (req, res) => {
  // Get all records from database
  Diary.find()
    .then((data) => {
      res.render("Diary", { data: data });
    })
    .catch((err) => console.log(err));
});

// Route for adding Records
app.get("/add", (req, res) => {
  res.render("Add");
});

// Route for saving records
app.post("/add-to-diary", (req, res) => {
  // Save data to database
  const newDiary = new Diary({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  });
  newDiary
    .save()
    .then(() => {
      res.redirect("/diary");
      console.log("Data saved to database");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Server listening on port 3001
app.listen(port, () => {
  console.log("Server is running on port 3001");
});
