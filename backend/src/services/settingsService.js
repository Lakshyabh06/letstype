const { prisma } = require("../config/prisma");
const { HttpError } = require("../utils/httpError");

const toSettingsResponse = (settings) => ({
  theme: settings.theme,
  soundProfile: settings.soundProfile,
  volume: settings.volume
});

const getUserSettings = async (userId) => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    select: {
      theme: true,
      soundProfile: true,
      volume: true
    }
  });

  if (!settings) {
    throw new HttpError(404, "User settings not found");
  }

  return toSettingsResponse(settings);
};

const updateUserSettings = async (userId, settingsUpdate) => {
  try {
    const settings = await prisma.userSettings.update({
      where: { userId },
      data: settingsUpdate,
      select: {
        theme: true,
        soundProfile: true,
        volume: true
      }
    });

    return toSettingsResponse(settings);
  } catch (error) {
    if (error.code === "P2025") {
      throw new HttpError(404, "User settings not found");
    }

    throw error;
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings
};
