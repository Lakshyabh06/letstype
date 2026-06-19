CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_settings" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "soundProfile" VARCHAR(80) NOT NULL DEFAULT 'standard',
  "volume" INTEGER NOT NULL DEFAULT 80,
  "theme" VARCHAR(80) NOT NULL DEFAULT 'system',
  "preferences" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "progress" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "lessonKey" VARCHAR(120) NOT NULL,
  "masteryScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "completionPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "typing_sessions" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "wpm" DECIMAL(6,2) NOT NULL,
  "accuracy" DECIMAL(5,2) NOT NULL,
  "errors" INTEGER NOT NULL DEFAULT 0,
  "duration" INTEGER NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "typing_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "achievements" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "achievementKey" VARCHAR(120) NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "description" TEXT NOT NULL,
  "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

CREATE UNIQUE INDEX "progress_userId_lessonKey_key" ON "progress"("userId", "lessonKey");
CREATE INDEX "progress_userId_idx" ON "progress"("userId");
CREATE INDEX "progress_lessonKey_idx" ON "progress"("lessonKey");

CREATE INDEX "typing_sessions_userId_timestamp_idx" ON "typing_sessions"("userId", "timestamp");
CREATE INDEX "typing_sessions_timestamp_idx" ON "typing_sessions"("timestamp");

CREATE UNIQUE INDEX "achievements_userId_achievementKey_key" ON "achievements"("userId", "achievementKey");
CREATE INDEX "achievements_achievementKey_idx" ON "achievements"("achievementKey");
CREATE INDEX "achievements_earnedAt_idx" ON "achievements"("earnedAt");

ALTER TABLE "user_settings"
  ADD CONSTRAINT "user_settings_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progress"
  ADD CONSTRAINT "progress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "typing_sessions"
  ADD CONSTRAINT "typing_sessions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "achievements"
  ADD CONSTRAINT "achievements_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
