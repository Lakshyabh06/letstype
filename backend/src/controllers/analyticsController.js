const {
  getUserAnalytics,
  getUserAnalyticsTrends
} = require("../services/analyticsService");

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getUserAnalytics(req.user.id);

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

const getAnalyticsTrends = async (req, res, next) => {
  try {
    const trends = await getUserAnalyticsTrends(req.user.id);

    res.status(200).json(trends);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getAnalyticsTrends
};
