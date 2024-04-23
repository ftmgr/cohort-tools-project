const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = 5005;
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");
// New Branch!
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [`http://localhost:${PORT}`],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
    // firstName: "SaeaaawerfdwsdTRZHerfwqwdeeaideh",
    // lastName: "BahadaaoerrsaqwDSgfdan",
    // email: "Saeiaadeh.bSAYasyhfdbgadoran@gmail.com",
    // phone: "09876543221",
    // linkedinUrl: "sedhgtfgrft7zizl",
    // languages: ["English"],
    // program: "Web Dev",
    // background: "fdcjhhblkj",
    // image:
    //   "https://img.freepik.com/free-photo/good-advice-from-beautiful-woman_329181-3527.jpg",
    // cohort: "1234a6678ee5360f6dc851a4",
    // // projects: [],
  })
    .then((createdStudent) => {
      res.status(201).json(createdStudent);
      console.log(createdStudent);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error while creating a new student" });
    });
});

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  Student.find({ cohort: req.params.cohortId })
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  Student.findById(req.params.studentId)
    .then((student) => {
      if (!student) {
        console.log("Student not found");
        return res.status(404).json({ error: "Student not found" });
      }
      console.log("Retrieved student ->", student);
      res.status(200).json(student);
    })
    .catch((error) => {
      console.error("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      console.error("Error while updating student ->", error);
      res
        .status(500)
        .json({ message: "Error while updating a single student" });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error while deleting student ->", error);
      res.status(500).json({ message: "Error while deleting a single student" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
