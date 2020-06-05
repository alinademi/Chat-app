const express = require("express");
const cors = require("cors");

const app = express();

// middleware make sure incoming req.body is formatted as JSON
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(".get test from express");
});

app.get("/*", (req, res) => {
  res.send(
    `<h1>Page not found</h1>
    <img src="https://i.pinimg.com/originals/71/07/40/7107408a37d845fb7b008837eb524853.jpg"/>`
  );
});

app.listen(5000, console.log("app is listening at: http://localhost:5000"));
