const express = require("express");
const http = require("http");
const routes = require("./routes/httproutes");
const websocket = require("./websocket");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const uri = process.env.MONGODB_URI;

console.log("uri", uri);

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.use(bodyParser.json());

// Use HTTP routes
app.use("/", routes);

// Use WebSocket
websocket(server);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
