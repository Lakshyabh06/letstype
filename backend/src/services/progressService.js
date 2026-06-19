const { prisma } = require("../config/prisma");

const decimalToNumber = (value) => Number(value);

const toProgressItemResponse = (progress) => ({
  lessonId: progress.lessonKey,
  completion: decimalToNumber(progress.completionPercentage),
  masteryScore: decimalToNumber(progress.masteryScore),
  completed: decimalToNumber(progress.completionPercentage) >= 100
});

const getUserProgress = async (userId) => {
  const progressRecords = await prisma.progress.findMany({
    where: { userId },
    orderBy: {
      lessonKey: "asc"
    },
    select: {
      lessonKey: true,
      masteryScore: true,
      completionPercentage: true
    }
  });

  const lessons = progressRecords.map(toProgressItemResponse);

  return {
    completedLessons: lessons
      .filter((lesson) => lesson.completed)
      .map((lesson) => lesson.lessonId),
    masteryScores: lessons.reduce(
      (scores, lesson) => ({
        ...scores,
        [lesson.lessonId]: lesson.masteryScore
      }),
      {}
    ),
    completionPercentages: lessons.reduce(
      (percentages, lesson) => ({
        ...percentages,
        [lesson.lessonId]: lesson.completion
      }),
      {}
    ),
    lessons
  };
};

const saveUserProgress = async (
  userId,
  { lessonId, completion, masteryScore }
) => {
  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonKey: {
        userId,
        lessonKey: lessonId
      }
    },
    create: {
      userId,
      lessonKey: lessonId,
      completionPercentage: completion,
      masteryScore
    },
    update: {
      completionPercentage: completion,
      masteryScore
    },
    select: {
      lessonKey: true,
      masteryScore: true,
      completionPercentage: true
    }
  });

  return toProgressItemResponse(progress);
};

module.exports = {
  getUserProgress,
  saveUserProgress
};
