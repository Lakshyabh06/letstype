const { prisma } = require("../config/prisma");
const { awardAchievementsForUser } = require("./achievementService");

const toSessionResponse = (session) => ({
  id: session.id,
  wpm: Number(session.wpm),
  accuracy: Number(session.accuracy),
  errors: session.errors,
  duration: session.duration,
  mode: session.mode,
  createdAt: session.createdAt
});

const createTypingSession = async (userId, sessionData) => {
  const { session, earnedAchievements } = await prisma.$transaction(
    async (tx) => {
      const createdSession = await tx.typingSession.create({
        data: {
          userId,
          wpm: sessionData.wpm,
          accuracy: sessionData.accuracy,
          errors: sessionData.errors,
          duration: sessionData.duration,
          mode: sessionData.mode
        },
        select: {
          id: true,
          wpm: true,
          accuracy: true,
          errors: true,
          duration: true,
          mode: true,
          createdAt: true
        }
      });

      const newAchievements = await awardAchievementsForUser(tx, userId);

      return {
        session: createdSession,
        earnedAchievements: newAchievements
      };
    }
  );

  return {
    session: toSessionResponse(session),
    earnedAchievements
  };
};

const getUserSessions = async (userId) => {
  const sessions = await prisma.typingSession.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc"
    },
    take: 50,
    select: {
      id: true,
      wpm: true,
      accuracy: true,
      errors: true,
      duration: true,
      mode: true,
      createdAt: true
    }
  });

  return sessions.map(toSessionResponse);
};

module.exports = {
  createTypingSession,
  getUserSessions
};
