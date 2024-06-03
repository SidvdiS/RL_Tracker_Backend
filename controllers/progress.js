const ProgressParams = require("../models/progress");

module.exports = {
  async getProgress(req, res) {
    try {
      const latestParam = await ProgressParams.findOne().sort({
        dateCreated: -1,
      });
      console.log("Latest progress fetched:", latestParam); // Debug statement
      if (latestParam) {
        res.json({
          progress: latestParam.progress,
          totalEpisodeReward: latestParam.totalEpisodeReward,
          episodeNo: latestParam.episodeNo,
          explorationParam: latestParam.explorationParam,
          dateCreated: latestParam.dateCreated,
          noOfEpisodes: latestParam.noOfEpisodes,
        });
      } else {
        res.status(404).json({ message: "No progress data available" });
      }
    } catch (error) {
      console.error("Error fetching progress:", error); // Debug statement
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAllRewards(req, res) {
    try {
      const rewArr = (await ProgressParams.find({})).map(
        (item) => item.totalEpisodeReward
      );
      if (rewArr) {
        res.json(rewArr);
      } else {
        res.status(404).json({ message: "No data available!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async postProgress(req, res) {
    try {
      const {
        progress,
        totalEpisodeReward,
        episodeNo,
        explorationParam,
        noOfEpisodes,
      } = req.body;

      const param = await ProgressParams.create({
        progress,
        totalEpisodeReward,
        episodeNo,
        explorationParam,
        noOfEpisodes,
      });

      res.status(201).json(param);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async saveProgress(
    progress,
    totalEpisodeReward,
    episodeNo,
    explorationParam,
    noOfEpisodes
  ) {
    try {
      await ProgressParams.create({
        progress,
        totalEpisodeReward,
        episodeNo,
        explorationParam,
        noOfEpisodes,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      throw new Error("Error saving progress");
    }
  },
};
