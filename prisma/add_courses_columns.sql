-- Add key and cover_key columns to Courses table
-- These columns store the S3/R2 bucket keys for course content and cover images

-- Add key column (stores the bucket key for course content)
ALTER TABLE "Courses"
ADD COLUMN "key" TEXT NOT NULL DEFAULT '';

-- Add cover_key column (stores the bucket key for cover image)
ALTER TABLE "Courses"
ADD COLUMN "cover_key" TEXT NOT NULL DEFAULT '';

-- Optional: Remove default values after adding data (if you want to make them required)
-- ALTER TABLE "Courses" ALTER COLUMN "key" DROP DEFAULT;
-- ALTER TABLE "Courses" ALTER COLUMN "cover_key" DROP DEFAULT;

