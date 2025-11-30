-- PostgreSQL SQL statements generated from Prisma schema
-- Generated for: User, Course, Purchase models

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable: User
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Course
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "course_onchain_id" TEXT NOT NULL,
    "creator_address" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Purchase
CREATE TABLE "Purchases" (
    "id" SERIAL NOT NULL,
    "course_onchain_id" TEXT NOT NULL,
    "buyer_address" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: User.wallet_address (unique)
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex: Course.course_onchain_id (unique)
CREATE UNIQUE INDEX "Course_course_onchain_id_key" ON "Course"("course_onchain_id");

-- CreateIndex: Purchase.course_onchain_id (unique)
CREATE UNIQUE INDEX "Purchase_course_onchain_id_key" ON "Purchase"("course_onchain_id");

-- CreateIndex: Purchase.tx_hash (unique)
CREATE UNIQUE INDEX "Purchase_tx_hash_key" ON "Purchase"("tx_hash");
