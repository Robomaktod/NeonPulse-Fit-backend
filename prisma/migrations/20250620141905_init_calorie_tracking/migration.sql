-- CreateEnum
CREATE TYPE "MealTypeEnum" AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snack');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Blocked');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('Male', 'Female');

-- CreateTable
CREATE TABLE "users" (
    "clerk_user_id" TEXT NOT NULL,
    "display_username" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "height_cm" SMALLINT NOT NULL,
    "gender" "GenderEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("clerk_user_id")
);

-- CreateTable
CREATE TABLE "user_weight_logs" (
    "weight_log_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "user_weight_logs_pkey" PRIMARY KEY ("weight_log_id")
);

-- CreateTable
CREATE TABLE "exercise_types" (
    "exercise_type_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "primary_muscle_group" VARCHAR(100),
    "equipment_needed" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_types_pkey" PRIMARY KEY ("exercise_type_id")
);

-- CreateTable
CREATE TABLE "user_exercise_logs" (
    "exercise_log_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_type_id" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sets" INTEGER,
    "reps_per_set" INTEGER,
    "weight_kg" DECIMAL(7,2),
    "duration_minutes" INTEGER,
    "distance_km" DECIMAL(7,2),
    "is_personal_record" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "user_exercise_logs_pkey" PRIMARY KEY ("exercise_log_id")
);

-- CreateTable
CREATE TABLE "activity_categories" (
    "activity_category_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_categories_pkey" PRIMARY KEY ("activity_category_id")
);

-- CreateTable
CREATE TABLE "user_activity_logs" (
    "activity_log_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_category_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_minutes" INTEGER NOT NULL,
    "calories_burned_estimated" INTEGER,
    "distance_km" DECIMAL(7,2),
    "notes" TEXT,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("activity_log_id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "user_id_requester" TEXT NOT NULL,
    "user_id_accepter" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'Pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("user_id_requester","user_id_accepter")
);

-- CreateTable
CREATE TABLE "foods" (
    "food_id" SERIAL NOT NULL,
    "created_by_user_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "serving_size_g" DECIMAL(7,2) NOT NULL,
    "calories" DECIMAL(7,2) NOT NULL,
    "protein_g" DECIMAL(7,2) DEFAULT 0,
    "carbs_g" DECIMAL(7,2) DEFAULT 0,
    "fat_g" DECIMAL(7,2) DEFAULT 0,
    "barcode_upc" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "nutrition_logs" (
    "nutrition_log_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_id" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL,
    "meal_type" "MealTypeEnum" NOT NULL DEFAULT 'Snack',
    "quantity_consumed" DECIMAL(7,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "nutrition_logs_pkey" PRIMARY KEY ("nutrition_log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "users"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_display_username_key" ON "users"("display_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_clerk_user_id_idx" ON "users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "users_display_username_idx" ON "users"("display_username");

-- CreateIndex
CREATE INDEX "user_weight_logs_user_id_idx" ON "user_weight_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_weight_logs_user_id_logged_at_key" ON "user_weight_logs"("user_id", "logged_at");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_types_name_key" ON "exercise_types"("name");

-- CreateIndex
CREATE INDEX "exercise_types_name_idx" ON "exercise_types"("name");

-- CreateIndex
CREATE INDEX "user_exercise_logs_user_id_idx" ON "user_exercise_logs"("user_id");

-- CreateIndex
CREATE INDEX "user_exercise_logs_exercise_type_id_idx" ON "user_exercise_logs"("exercise_type_id");

-- CreateIndex
CREATE INDEX "user_exercise_logs_user_id_logged_at_idx" ON "user_exercise_logs"("user_id", "logged_at");

-- CreateIndex
CREATE UNIQUE INDEX "activity_categories_name_key" ON "activity_categories"("name");

-- CreateIndex
CREATE INDEX "activity_categories_name_idx" ON "activity_categories"("name");

-- CreateIndex
CREATE INDEX "user_activity_logs_user_id_idx" ON "user_activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "user_activity_logs_activity_category_id_idx" ON "user_activity_logs"("activity_category_id");

-- CreateIndex
CREATE INDEX "user_activity_logs_user_id_started_at_idx" ON "user_activity_logs"("user_id", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "foods_barcode_upc_key" ON "foods"("barcode_upc");

-- CreateIndex
CREATE INDEX "foods_name_idx" ON "foods"("name");

-- CreateIndex
CREATE INDEX "foods_created_by_user_id_idx" ON "foods"("created_by_user_id");

-- CreateIndex
CREATE INDEX "nutrition_logs_user_id_idx" ON "nutrition_logs"("user_id");

-- CreateIndex
CREATE INDEX "nutrition_logs_user_id_logged_at_idx" ON "nutrition_logs"("user_id", "logged_at");

-- AddForeignKey
ALTER TABLE "user_weight_logs" ADD CONSTRAINT "user_weight_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_logs" ADD CONSTRAINT "user_exercise_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_logs" ADD CONSTRAINT "user_exercise_logs_exercise_type_id_fkey" FOREIGN KEY ("exercise_type_id") REFERENCES "exercise_types"("exercise_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_activity_category_id_fkey" FOREIGN KEY ("activity_category_id") REFERENCES "activity_categories"("activity_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_requester_fkey" FOREIGN KEY ("user_id_requester") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_accepter_fkey" FOREIGN KEY ("user_id_accepter") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("clerk_user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_logs" ADD CONSTRAINT "nutrition_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("clerk_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_logs" ADD CONSTRAINT "nutrition_logs_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("food_id") ON DELETE RESTRICT ON UPDATE CASCADE;
