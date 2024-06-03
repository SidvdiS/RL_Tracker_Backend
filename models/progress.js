const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  progress: Number,
  totalEpisodeReward: Number,
  episodeNo: Number,
  explorationParam: Number,
  dateCreated: { type: Date, default: Date.now },
  noOfEpisodes: Number,
});

module.exports = mongoose.model("ProgressParams", progressSchema);
