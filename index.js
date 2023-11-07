const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iohfkju.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("butterfly").collection("products");
    const serviceCollection = client.db("butterfly").collection("services");
    const cartCollection = client.db("butterfly").collection("carts");
    app.get("/products", async (req, res) => {
      const query = {};
      const options = await productCollection.find(query).toArray();
      res.send(options);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await productCollection.findOne(query);
      res.send(service);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const service = await serviceCollection.find(query).toArray();
      res.send(service);
    });
    app.post("/carts", async (req, res) => {
      const item = req.body;

      const result = await cartCollection.insertOne(item);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("butterfly");
});

app.listen(port, () => console.log(`butterfly ${port}`));
