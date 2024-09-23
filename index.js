const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://study-mate-project.netlify.app',
  ],
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "unauthorized access" });
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ message: "unauthorized access" });
      }
      console.log(decoded);

      req.user = decoded;
      next();
    });
  }
};


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mx7zi5i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    const assignmentsCollection = client.db("studyMate").collection("assignments");

    
    app.post("/assignment", async (req, res) => {
      const assignmentData = req.body;
      const result = await assignmentsCollection.insertOne(assignmentData);
      res.send(result);
    });

    app.get("/assignments", async (req, res) => {
      const result = await assignmentsCollection.find().toArray();
      res.send(result);
    });

    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

     app.delete("/assignment/:id",async(req,res)=>{
      const id = req.params.id;
      const query={_id:new ObjectId(id)}
      const result = await assignmentsCollection.deleteOne(query);
      res.send(result)
     });

  } finally {

  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Study Mate is running now !!!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));