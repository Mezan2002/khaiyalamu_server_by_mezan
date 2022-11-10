// require start
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// JWT token start
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized User" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
    if (error) {
      res.status(401).send({ message: "Unauthorized User" });
    }
    req.decoded = decoded;
  });
  next();
};
// JWT token end

// mongo DB run function start
const run = async () => {
  const servicesCollection = client.db("khaiyalamuDB").collection("services");
  const reviewsCollection = client.db("khaiyalamuDB").collection("reviews");

  //   Get Data 3 services From Mongo DB start
  app.get("/limitedServices", async (req, res) => {
    const query = {};
    const cursor = servicesCollection.find(query);
    const services = await cursor.limit(3).toArray();
    res.send(services);
  });
  //   Get Data 3 services From Mongo DB end

  // all services From Mongo DB start
  app.get("/services", async (req, res) => {
    const query = {};
    const cursor = servicesCollection.find(query);
    const services = await cursor.toArray();
    res.send(services);
  });
  // all services From Mongo DB end

  // add a new service API start
  app.post("/service", async (req, res) => {
    const serviceInfo = req.body;
    const result = await servicesCollection.insertOne(serviceInfo);
    res.send(result);
  });
  // add a new service API end

  // one service by id API from mongo DB start
  app.get("/services/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await servicesCollection.findOne(query);
    res.send(service);
  });
  // one service by id API from mongo DB end

  // review post API start
  app.post("/reviews", async (req, res) => {
    const review = req.body;
    const result = await reviewsCollection.insertOne(review);
    res.send(result);
  });
  // review post API end

  // review get API start
  app.get("/reviews", verifyJWT, async (req, res) => {
    const decoded = req.decoded;
    const userEmail = req.query.email;
    if (decoded.email !== userEmail) {
      res.status(401).send({ message: "Unauthorized User" });
    }
    let query = {};
    if (userEmail) {
      query = { useremail: userEmail };
    }
    const options = {
      sort: { createdTime: -1 },
    };
    const cursor = reviewsCollection.find(query, options);
    const reviews = await cursor.toArray();
    res.send(reviews);
  });
  // review get API end

  // single review get API start
  app.get("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    let query = { _id: ObjectId(id) };
    const review = await reviewsCollection.findOne(query);
    res.send(review);
  });
  // single review get API end

  // delete review API start
  app.delete("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await reviewsCollection.deleteOne(query);
    res.send(result);
  });
  // delete review API end

  // update review API start
  app.patch("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const previousReview = req.body;
    const updatedReview = {
      $set: {
        review: previousReview.review,
        username: previousReview.username,
        photoURL: previousReview.photoURL,
        useremail: previousReview.useremail,
        ratings: previousReview.ratings,
      },
    };
    const result = await reviewsCollection.updateOne(filter, updatedReview);
    res.send(result);
  });

  // update review API end

  // JWT API start
  app.post("/jwt", (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.send({ token });
  });
  // JWT API end
};

run().catch((error) => console.error(error));
// mongo DB run function end

// mongo DB connect API end

app.use("/", (req, res) => {
  res.send("khaiyalamu server is running!!!");
});

app.listen(port, () => {
  console.log(`khaiyalamu server is running on port ${port}`);
});
