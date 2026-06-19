const {
  getUserSettings,
  updateUserSettings
} = require("../services/settingsService");

const getSettings = async (req, res, next) => {
  try {
    const settings = await getUserSettings(req.user.id);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const patchSettings = async (req, res, next) => {
  try {
    const settings = await updateUserSettings(req.user.id, req.body);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  patchSettings
};
