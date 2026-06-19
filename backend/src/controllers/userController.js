const {
  getUserProfile,
  updateUserProfile
} = require("../services/userService");

const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.user.id);

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const patchProfile = async (req, res, next) => {
  try {
    const profile = await updateUserProfile(req.user.id, req.body);

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  patchProfile
};
