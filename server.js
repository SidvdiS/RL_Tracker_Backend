const express = require("express");
const http = require("http");
const routes = require("./routes/httproutes");
const websocket = require("./websocket");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

const uri =
  "mongodb+srv://siddharthv4075sv:4shared1%40@cluster0.inu0phu.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

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
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
