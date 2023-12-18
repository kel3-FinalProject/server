const express = require("express");
const routers = require("./routes/index");
const app = express();
const fileUpload = require("express-fileupload");
const errorHandling = require("./middlewares/errorHandling");
const { cronUpdateStatus } = require("./controller/reservasiController");

app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use(routers);
app.use(errorHandling);

const port = 4003;
app.get("/", (req, res) => {
  res.status(200).json("HELLO WORLD");
});

cronUpdateStatus();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
