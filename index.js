// require start
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// require end

// middlewares start
app.use(cors());
app.use(express.json());
// middlewares end

app.use("/", (req, res) => {
  res.send("khaiyalamu server is running!!!");
});

app.listen(port, () => {
  console.log(`khaiyalamu server is running on port ${port}`);
});
