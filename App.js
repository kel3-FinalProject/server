const express = require("express");

const app = express();

app.use(express.json());

const port = 4003;
app.get("/", (req, res) => {
    res.status(200).json("HELLO WORLD");
    console.log(`Server is running on port ${port}`);
  });