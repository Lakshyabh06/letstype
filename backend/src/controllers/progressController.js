const {
  getUserProgress,
  saveUserProgress
} = require("../services/progressService");

const getProgress = async (req, res, next) => {
  try {
    const progress = await getUserProgress(req.user.id);

    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

const putProgress = async (req, res, next) => {
  try {
    const progress = await saveUserProgress(req.user.id, req.body);

    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  putProgress
};
