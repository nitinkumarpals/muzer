/*
  Warnings:

  - The `haveVoted` column on the `Stream` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "haveVoted" AS ENUM ('true', 'false', 'null');

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "haveVoted",
ADD COLUMN     "haveVoted" "haveVoted" NOT NULL DEFAULT 'null';
