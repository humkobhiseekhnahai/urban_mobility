-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('user', 'operator', 'partner');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_type" "user_type" NOT NULL DEFAULT 'user';
