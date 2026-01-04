// Import Express
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());              // ⭐ IMPORTANT
app.use(express.json());

// Temporary in-memory database
let students = [];

// Root route (test server)
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// ======================
// READ - Get all students
// ======================
app.get("/students", (req, res) => {
  res.json(students);
});

// ======================
// CREATE - Add a student
// ======================
app.post("/students", (req, res) => {
  const student = req.body;

  // Check duplicate roll number
  const exists = students.some(s => s.roll === student.roll);
  if (exists) {
    return res.status(400).send("Student with this roll number already exists");
  }

  students.push(student);
  res.status(201).json(student);   // better response
});

// ======================
// UPDATE - Update student by roll number
// ======================
app.put("/students/:roll", (req, res) => {
  const roll = req.params.roll;
  const updatedStudent = req.body;

  const index = students.findIndex(s => s.roll === roll);
  if (index === -1) {
    return res.status(404).send("Student not found");
  }

  students[index] = updatedStudent;
  res.json(students[index]);
});

// ======================
// DELETE - Delete student by roll number
// ======================
app.delete("/students/:roll", (req, res) => {
  const roll = req.params.roll;

  const index = students.findIndex(s => s.roll === roll);
  if (index === -1) {
    return res.status(404).send("Student not found");
  }

  students.splice(index, 1);
  res.send("Student deleted");
});

// ======================
// Start Server
// ======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
