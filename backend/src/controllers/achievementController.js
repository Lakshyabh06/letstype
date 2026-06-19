const { getUserAchievements } = require("../services/achievementService");

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await getUserAchievements(req.user.id);

    res.status(200).json(achievements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements
};
