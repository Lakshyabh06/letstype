const {
  createTypingSession,
  getUserSessions
} = require("../services/sessionService");

const postSession = async (req, res, next) => {
  try {
    const result = await createTypingSession(req.user.id, req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const sessions = await getUserSessions(req.user.id);

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  postSession
};
