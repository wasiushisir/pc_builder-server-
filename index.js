const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5040;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://wasiuahmed410:xqq7rAzRx7upPqCk@cluster0.w0fjwcc.mongodb.net/pc_builder";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  await client.connect();
  // Send a ping to confirm a successful connection

  const pc_builderCollection = client.db("pc_builder").collection("pc");
  const build_builderCollection = client.db("pc_builder").collection("build");
  console.log(" You successfully connected to MongoDB!");

  app.get("/pc", async (req, res) => {
    const pcs = await pc_builderCollection.find({}).toArray();
    const builds = await build_builderCollection.find({}).toArray();

    res.status(200).json({ pcs, builds });
  });
  app.get("/pc/:id", async (req, res) => {
    const { id } = req.params;
    // const sendId = id.toString();
    const objectId = new ObjectId(id);
    const pcs = await pc_builderCollection.find({ _id: objectId }).toArray();

    res.status(200).json({ pcs });
  });

  app.get("/selectCategory", async (req, res) => {
    const { category } = req.query;
    const pcs = await pc_builderCollection
      .find({ Category: category })
      .toArray();
    res.send({ message: "success", status: 200, data: pcs });
  });
  app.post("/pc", async (req, res) => {
    const { ...data } = req.body;
    const builds = await build_builderCollection.insertOne(data);
    res.send({ message: "success", status: 200, data: builds });
  });
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
