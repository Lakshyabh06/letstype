ALTER TABLE "users"
ALTER COLUMN "passwordHash" DROP NOT NULL,
ADD COLUMN "provider" VARCHAR(40) NOT NULL DEFAULT 'local',
ADD COLUMN "providerId" VARCHAR(255);

CREATE UNIQUE INDEX "users_providerId_key" ON "users"("providerId");
CREATE INDEX "users_provider_idx" ON "users"("provider");
