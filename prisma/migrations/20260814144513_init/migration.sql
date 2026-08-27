-- CreateEnum
CREATE TYPE "EligibilityStatus" AS ENUM ('PENDING', 'ELIGIBLE', 'INELIGIBLE', 'ERROR');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INCOMING', 'OUTGOING', 'SYSTEM');

-- CreateTable
CREATE TABLE "demo_users" (
    "id" TEXT NOT NULL,
    "demo_identifier" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "birth_date" DATE,
    "mother_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "salary_range" TEXT,
    "debt_type" TEXT,
    "is_manual_entry" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibility_checks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "EligibilityStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eligibility_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditors" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creditors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "creditor_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "debt_type" TEXT NOT NULL,
    "original_amount" DECIMAL(12,2) NOT NULL,
    "settlement_amount" DECIMAL(12,2) NOT NULL,
    "discount_percent" DECIMAL(5,2) NOT NULL,
    "available_slots" INTEGER NOT NULL DEFAULT 50,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulated_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "offer_id" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "simulation_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulated_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "creditor_id" TEXT,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_step" TEXT NOT NULL DEFAULT 'initial',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_events" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "event_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "session_hash" TEXT,
    "event_type" TEXT NOT NULL,
    "route" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "demo_users_demo_identifier_key" ON "demo_users"("demo_identifier");

-- CreateIndex
CREATE INDEX "eligibility_checks_user_id_created_at_idx" ON "eligibility_checks"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "creditors_code_key" ON "creditors"("code");

-- CreateIndex
CREATE INDEX "offers_creditor_id_is_active_idx" ON "offers"("creditor_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "simulated_transactions_idempotency_key_key" ON "simulated_transactions"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "simulated_transactions_simulation_code_key" ON "simulated_transactions"("simulation_code");

-- CreateIndex
CREATE INDEX "simulated_transactions_user_id_status_idx" ON "simulated_transactions"("user_id", "status");

-- CreateIndex
CREATE INDEX "conversation_sessions_user_id_status_idx" ON "conversation_sessions"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_events_session_id_sequence_key" ON "conversation_events"("session_id", "sequence");

-- CreateIndex
CREATE INDEX "audit_events_event_type_created_at_idx" ON "audit_events"("event_type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "demo_sessions_token_hash_key" ON "demo_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "demo_sessions_user_id_expires_at_idx" ON "demo_sessions"("user_id", "expires_at");

-- AddForeignKey
ALTER TABLE "eligibility_checks" ADD CONSTRAINT "eligibility_checks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "demo_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_creditor_id_fkey" FOREIGN KEY ("creditor_id") REFERENCES "creditors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulated_transactions" ADD CONSTRAINT "simulated_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "demo_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulated_transactions" ADD CONSTRAINT "simulated_transactions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "demo_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_creditor_id_fkey" FOREIGN KEY ("creditor_id") REFERENCES "creditors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_events" ADD CONSTRAINT "conversation_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_sessions" ADD CONSTRAINT "demo_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "demo_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
