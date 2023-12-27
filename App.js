const express = require("express");
const routers = require("./routes/index");
const app = express();
const fileUpload = require('express-fileupload');
const errorHandling = require("./middlewares/errorHandling");
const { cronUpdateStatus, cronUpdateBayar } = require("./controller/reservasiController");
const cors = require('cors');

app.use(cors());
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
  cronUpdateBayar();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})