const { prisma } = require("../config/prisma");
const { HttpError } = require("../utils/httpError");

const toProfileResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt.toISOString()
});

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new HttpError(404, "User profile not found");
  }

  return toProfileResponse(user);
};

const updateUserProfile = async (userId, { name }) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return toProfileResponse(user);
  } catch (error) {
    if (error.code === "P2025") {
      throw new HttpError(404, "User profile not found");
    }

    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
