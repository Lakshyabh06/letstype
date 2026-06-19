const { prisma } = require("../config/prisma");

const ACHIEVEMENTS = [
  {
    key: "FIRST_SESSION",
    title: "First Session",
    description: "Complete your first typing session.",
    isEarned: ({ totalSessions }) => totalSessions >= 1
  },
  {
    key: "WPM_50",
    title: "50 WPM",
    description: "Reach 50 words per minute in a typing session.",
    isEarned: ({ bestWpm }) => bestWpm >= 50
  },
  {
    key: "WPM_75",
    title: "75 WPM",
    description: "Reach 75 words per minute in a typing session.",
    isEarned: ({ bestWpm }) => bestWpm >= 75
  },
  {
    key: "WPM_100",
    title: "100 WPM",
    description: "Reach 100 words per minute in a typing session.",
    isEarned: ({ bestWpm }) => bestWpm >= 100
  },
  {
    key: "PERFECT_ACCURACY",
    title: "Perfect Accuracy",
    description: "Complete a typing session with 100% accuracy.",
    isEarned: ({ bestAccuracy }) => bestAccuracy >= 100
  },
  {
    key: "TEN_SESSIONS",
    title: "Ten Sessions",
    description: "Complete ten typing sessions.",
    isEarned: ({ totalSessions }) => totalSessions >= 10
  }
];

const toAchievementResponse = (achievement) => ({
  key: achievement.achievementKey,
  title: achievement.title,
  description: achievement.description,
  earnedAt: achievement.earnedAt
});

const buildAchievementStats = async (tx, userId) => {
  const [totalSessions, aggregates] = await Promise.all([
    tx.typingSession.count({
      where: { userId }
    }),
    tx.typingSession.aggregate({
      where: { userId },
      _max: {
        wpm: true,
        accuracy: true
      }
    })
  ]);

  return {
    totalSessions,
    bestWpm: aggregates._max.wpm ? Number(aggregates._max.wpm) : 0,
    bestAccuracy: aggregates._max.accuracy
      ? Number(aggregates._max.accuracy)
      : 0
  };
};

const awardAchievementsForUser = async (tx, userId) => {
  const stats = await buildAchievementStats(tx, userId);
  const earnedDefinitions = ACHIEVEMENTS.filter((achievement) =>
    achievement.isEarned(stats)
  );

  if (earnedDefinitions.length === 0) {
    return [];
  }

  const earnedKeys = earnedDefinitions.map((achievement) => achievement.key);
  const existingAchievements = await tx.achievement.findMany({
    where: {
      userId,
      achievementKey: {
        in: earnedKeys
      }
    },
    select: {
      achievementKey: true
    }
  });

  const existingKeys = new Set(
    existingAchievements.map((achievement) => achievement.achievementKey)
  );
  const newAchievements = earnedDefinitions.filter(
    (achievement) => !existingKeys.has(achievement.key)
  );

  if (newAchievements.length === 0) {
    return [];
  }

  const earnedAt = new Date();

  await tx.achievement.createMany({
    data: newAchievements.map((achievement) => ({
      userId,
      achievementKey: achievement.key,
      title: achievement.title,
      description: achievement.description,
      earnedAt
    })),
    skipDuplicates: true
  });

  return newAchievements.map((achievement) => ({
    key: achievement.key,
    title: achievement.title,
    description: achievement.description,
    earnedAt
  }));
};

const getUserAchievements = async (userId) => {
  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: {
      earnedAt: "desc"
    },
    select: {
      achievementKey: true,
      title: true,
      description: true,
      earnedAt: true
    }
  });

  return achievements.map(toAchievementResponse);
};

module.exports = {
  awardAchievementsForUser,
  getUserAchievements
};
