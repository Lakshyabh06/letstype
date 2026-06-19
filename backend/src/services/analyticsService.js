const { prisma } = require("../config/prisma");

const decimalToNumber = (value) => (value ? Number(value) : 0);

const roundMetric = (value) => Math.round(value * 100) / 100;

const getUserAnalytics = async (userId) => {
  const [totalSessions, aggregates] = await Promise.all([
    prisma.typingSession.count({
      where: { userId }
    }),
    prisma.typingSession.aggregate({
      where: { userId },
      _avg: {
        wpm: true,
        accuracy: true
      },
      _max: {
        wpm: true
      },
      _sum: {
        duration: true
      }
    })
  ]);

  return {
    averageWpm: roundMetric(decimalToNumber(aggregates._avg.wpm)),
    bestWpm: roundMetric(decimalToNumber(aggregates._max.wpm)),
    averageAccuracy: roundMetric(decimalToNumber(aggregates._avg.accuracy)),
    totalSessions,
    totalPracticeTime: aggregates._sum.duration || 0
  };
};

const getUserAnalyticsTrends = async (userId) => {
  const sessions = await prisma.typingSession.findMany({
    where: { userId },
    orderBy: {
      createdAt: "asc"
    },
    select: {
      id: true,
      wpm: true,
      accuracy: true,
      createdAt: true
    }
  });

  return {
    wpmTrend: sessions.map((session) => ({
      sessionId: session.id,
      createdAt: session.createdAt,
      value: Number(session.wpm)
    })),
    accuracyTrend: sessions.map((session) => ({
      sessionId: session.id,
      createdAt: session.createdAt,
      value: Number(session.accuracy)
    }))
  };
};

module.exports = {
  getUserAnalytics,
  getUserAnalyticsTrends
};
