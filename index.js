const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      
    ],
    credentials: true,
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9b6e9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = process.env.DB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("TaskDB");
    const usersCollection = database.collection("usersCollection");

    app.post('/users', async(req, res)=>{
        const userInfo=req.body;
        console.log(userInfo)
        const result = await usersCollection.insertOne(userInfo);
        res.send(result)
    })

    app.get('/users', async(req, res)=>{
        const result = await usersCollection.find().toArray();
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

