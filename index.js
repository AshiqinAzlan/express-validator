import express from "express";
import { body, validationResult } from "express-validator";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

//MIDDLEWARE
const loggingMiddleware = (req, res, next) => {
  // Log the method (e.g., GET, POST) and the URL of the request
  console.log(`${req.method} - ${req.url}`);

  // Call next() to pass control to the next middleware function or route handler
  next();
};

// Middleware to check for the presence of an Authorization header
const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present in the request headers
  if (req.headers.authorization) {
    // Log a message indicating the Authorization header is present
    console.log("Authorization header is present");
  } else {
    // Log a message indicating the Authorization header is not present
    console.log("No authorization header");
  }
  // Call next() to pass control to the next middleware function or route handler
  next();
};
// need to put at the top so that when run another request it will work
app.use(loggingMiddleware);
app.use(authMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Hello"); // status of the response (200, 404, 500)
});

const students = [
  { id: 100, name: "Hafiz", age: 32 },
  { id: 101, name: "Amalin", age: 24 },
  { id: 102, name: "Ashiqin", age: 16 },
  { id: 103, name: "Adam", age: 25 },
  { id: 104, name: "Yunus", age: 24 },
  { id: 105, name: "Isma", age: 26 },
  { id: 106, name: "Mashitah", age: 25 },
  { id: 107, name: "Faris", age: 21 },
  { id: 108, name: "PJ", age: 26 },
  { id: 109, name: "Ahmad", age: 25 },
  { id: 110, name: "Zarina", age: 31 },
  { id: 111, name: "Nurul", age: 29 },
  { id: 112, name: "Yatt", age: 32 },
  { id: 113, name: "Zayn", age: 22 },
  { id: 114, name: "Fitri", age: 30 },
  { id: 115, name: "Idlan", age: 28 },
  { id: 116, name: "Aini", age: 30 },
  { id: 117, name: "Iqbal", age: 32 },
  { id: 118, name: "Syaheerah", age: 29 },
  { id: 119, name: "Wan", age: 38 },
  { id: 120, name: "Khairul", age: 32 },
  { id: 121, name: "Sarah", age: 23 },
  { id: 122, name: "Othman", age: 33 },
  { id: 123, name: "Hamzah", age: 35 },
  { id: 124, name: "Aminur", age: 22 },
  { id: 125, name: "Amir", age: 32 },
];

app.get("/api/students", (req, res) => {
  const { filter, value } = req.query;

  if (!filter || !value) {
    return res.status(200).json(students);
  }

  const filteredStudents = students.filter((student) => {
    if (filter === "id") {
      return student.id.toString() === value;
    } else if (filter === "name") {
      return student.name.toLowerCase().includes(value.toLowerCase());
    } else if (filter === "age") {
      return student.age.toString() === value;
    }
    return false;
  });

  if (filteredStudents.length === 0) {
    return res.status(404).send("No students found");
  }

  res.status(200).json(filteredStudents);
});

app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const student = students.find((student) => student.id === parseInt(id));

  if (!student) {
    return res.status(404).send("Student not found");
  }

  res.status(200).json(student);
});

//POST REQUEST
// app.post("/api/students", (req, res) => {
//   const { body } = req;
//   const newStudent = { id: students[students.length - 1].id + 1, ...body };

//   //Add the new user to the students array
//   students.push(newStudent);
//   // Send a response status code 201 (Created) and the new user object
//   res.status(201).json(newStudent);
// });

//PUT REQUEST

// app.put("/api/students/:id", (req, res) => {
//   // need to include body because we going to target the whole body
//   const {
//     body,
//     params: { id },
//   } = req;

//   const parseId = parseInt(id);
//   if (isNaN(parseId)) return res.sendStatus(400);
//   const findUserIndex = students.findIndex((user) => user.id === parseId);
//   if (findUserIndex === -1) return res.sendStatus(404);
//   students[findUserIndex] = { id: parseId, ...body };
//   return res.sendStatus(200);
// });

// Define a route handler for PATCH requests to the "/api/users/:id" endpoint

app.patch("/api/students/:id", (req, res) => {
  const {
    body,

    params: { id },
  } = req;

  const parseId = parseInt(id);

  if (isNaN(parseId)) return res.sendStatus(400);

  const findUserIndex = students.findIndex((user) => user.id === parseId);

  if (findUserIndex === -1) return res.sendStatus(404);

  students[findUserIndex] = { ...students[findUserIndex], ...body };

  return res.sendStatus(200);
});

//DELETE REQUEST
app.delete("/api/students/:id", (req, res) => {
  // Destructure the 'id' parameter from the request parameters
  const {
    params: { id },
  } = req;

  // Parse the 'id' parameter to an integer
  const parseId = parseInt(id);

  // Check if the parsed ID is not a number, if so, return a 400 Bad Request status
  if (isNaN(parseId)) return res.sendStatus(400); // Bad Request

  // Find the index of the user with the given ID in the mockUsers array
  const userIndex = students.findIndex((user) => user.id === parseId);

  // If the user is not found (index is -1), return a 404 Not Found status
  if (userIndex === -1) return res.sendStatus(404); // Not Found

  // Remove the user from the mockUsers array using splice
  students.splice(userIndex, 1);

  // Return a 200 OK status to indicate the user was successfully deleted
  return res.sendStatus(200); // OK
});

// Route to handle POST requests to /api/users with validation and sanitization

// MIDDLEWARE POST REQUEST - POST
app.post(
  "/api/students",
  [
    // Validate and sanitize the name field
    body("name")
      .trim() // Remove whitespace from both ends of the string
      .isLength({ min: 1 }) // Ensure the name is not empty
      .withMessage("Name is required"), // Provide a custom error message if validation fails

    // Validate and sanitize the age field
    body("age")
      .isInt({ min: 1 }) // Ensure the field contains a valid integer age
      .withMessage("Must be a valid age"), // Provide a custom error message if validation fails
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 status with the validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Add the new student to the students array
    const newStudent = {
      id: students.length + 100,
      name: req.body.name,
      age: req.body.age,
    };
    students.push(newStudent);

    // Return the new student
    res.status(201).json(newStudent);
  }
);

//MIDDLEWARE PUT REQUEST - PUT
// Route to handle PUT requests to /api/users/:id

app.put(
  "/api/students/:id",
  [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("age").isInt({ min: 1 }).withMessage("Must be a valid age"),
  ],
  (req, res) => {
    console.log("Request Body:", req.body); // Debugging line

    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const studentIndex = students.findIndex((user) => user.id === studentId);
    if (studentIndex === -1) {
      return res.status(404).send({ message: "User not found" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    students[studentIndex] = { id: studentId, ...req.body };
    res.sendStatus(200);
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
