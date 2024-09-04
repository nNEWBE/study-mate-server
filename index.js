const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()