// require start
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// require end

// middlewares start
app.use(cors());
app.use(express.json());
// middlewares end

// mongo DB connect API start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ahck7i.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// mongo DB connect API end

app.use("/", (req, res) => {
  res.send("khaiyalamu server is running!!!");
});

app.listen(port, () => {
  console.log(`khaiyalamu server is running on port ${port}`);
});
