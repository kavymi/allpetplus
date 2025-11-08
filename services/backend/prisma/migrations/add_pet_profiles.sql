-- Add Pet Profiles Table
-- Migration: Add support for user pet profiles

CREATE TABLE IF NOT EXISTS "pet_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "user_profiles"("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "breed" VARCHAR(100),
  "breed_mix" TEXT[],
  "gender" VARCHAR(10) NOT NULL,
  "birth_date" TIMESTAMPTZ(6),
  "age_years" INTEGER,
  "age_months" INTEGER,
  "size" VARCHAR(20) NOT NULL,
  "color" VARCHAR(50),
  "markings" VARCHAR(255),
  "measurements" JSONB,
  "health" JSONB,
  "behavior" JSONB,
  "photo_url" TEXT,
  "photos" TEXT[],
  "microchip_id" VARCHAR(50),
  "registration_number" VARCHAR(100),
  "vet_info" JSONB,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "metadata" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ(6)
);

-- Indexes for performance
CREATE INDEX idx_pet_profiles_user_id ON "pet_profiles"("user_id", "deleted_at") WHERE "deleted_at" IS NULL;
CREATE INDEX idx_pet_profiles_is_primary ON "pet_profiles"("user_id", "is_primary") WHERE "is_primary" = true AND "deleted_at" IS NULL;
CREATE INDEX idx_pet_profiles_type ON "pet_profiles"("type", "size");
CREATE INDEX idx_pet_profiles_microchip ON "pet_profiles"("microchip_id") WHERE "microchip_id" IS NOT NULL;

-- Ensure only one primary pet per user
CREATE UNIQUE INDEX idx_pet_profiles_one_primary_per_user 
ON "pet_profiles"("user_id") 
WHERE "is_primary" = true AND "deleted_at" IS NULL;

-- Add comment
COMMENT ON TABLE "pet_profiles" IS 'User pet profiles with health and behavior information';

