-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_inChargeId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "inChargeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inChargeId_fkey" FOREIGN KEY ("inChargeId") REFERENCES "InCharge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
