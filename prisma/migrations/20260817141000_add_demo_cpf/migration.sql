ALTER TABLE "demo_users" ADD COLUMN "demo_cpf" TEXT;

UPDATE "demo_users" SET "demo_cpf" = CASE "demo_identifier"
  WHEN 'DEMO-FOUND-001' THEN '11111111111'
  WHEN 'DEMO-MANUAL-002' THEN '22222222222'
  WHEN 'DEMO-INCOMPLETE-003' THEN '99999999999'
  ELSE '00000000000'
END;

ALTER TABLE "demo_users" ALTER COLUMN "demo_cpf" SET NOT NULL;
CREATE UNIQUE INDEX "demo_users_demo_cpf_key" ON "demo_users"("demo_cpf");
