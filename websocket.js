const WebSocket = require("ws");
const ProgressController = require("./controllers/progress");
const ProgressParams = require("./models/progress");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  let isDataCleared = false; // Flag to track if data has been cleared

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        console.log(`Received message: ${message}`);
        const data = JSON.parse(message);

        if (data.type === "progress") {
          const {
            progress,
            totalEpisodeReward,
            episodeNo,
            explorationParam,
            noOfEpisodes,
          } = data;

          if (
            progress === undefined ||
            totalEpisodeReward === undefined ||
            episodeNo === undefined ||
            explorationParam === undefined ||
            noOfEpisodes === undefined
          ) {
            ws.send(JSON.stringify({ message: "Invalid data format" }));
            return;
          }

          // Clear existing data from the database only once
          if (!isDataCleared) {
            try {
              await ProgressParams.deleteMany({});
              console.log("Cleared existing data from MongoDB.");
              isDataCleared = true; // Set the flag to true after clearing the data
            } catch (clearError) {
              console.error("Error clearing data from MongoDB:", clearError);
              return;
            }
          }

          // Process and save the new data
          let param = new ProgressParams({
            progress,
            totalEpisodeReward,
            episodeNo,
            explorationParam,
            noOfEpisodes,
          });

          try {
            await param.save();
            console.log("Data saved to MongoDB:", param);

            // Broadcast the progress data to all connected WebSocket clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: data.type,
                    progress: param.progress,
                    totalEpisodeReward: param.totalEpisodeReward,
                    episodeNo: param.episodeNo,
                    explorationParam: param.explorationParam,
                    dateCreated: param.dateCreated,
                    noOfEpisodes: param.noOfEpisodes,
                  })
                );
              }
            });
          } catch (saveError) {
            console.error("Error saving data to MongoDB:", saveError);
            ws.send(JSON.stringify({ message: "Database error" }));
          }
        } else if (data.type === "stop") {
          // Handle stop signal
          broadcastStopSignal(wss);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ message: "Server error" }));
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      isDataCleared = false;
    });
  });

  // Function to broadcast a stop signal to all clients
  const broadcastStopSignal = (wss) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "stop" }));
      }
    });
  };

  // Function to handle ping messages to keep connections alive
  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    });
  }, 30000);

  // Cleanup interval on server close
  wss.on("close", () => {
    clearInterval(interval);
  });
};
