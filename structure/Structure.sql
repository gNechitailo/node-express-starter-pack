CREATE TYPE "userStatus" AS ENUM (
  'regular',
  'worker'
);

CREATE TYPE "patricipantStatus" AS ENUM (
  'active',
  'fulfilled',
  'rejected'
);

CREATE TYPE "productStatus" AS ENUM (
  'active',
  'progress',
  'paused',
  'finished'
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "firstName" string,
  "lastName" string,
  "email" string,
  "passwordHash" string,
  "zip" string,
  "phoneNumber" number,
  "photo" string,
  "location" string,
  "about" string,
  "status" userStatus
);

CREATE TABLE "balances" (
  "id" bigint PRIMARY KEY,
  "userId" bigint,
  "balance" double
);

CREATE TABLE "productTypes" (
  "id" number PRIMARY KEY,
  "categoryName" string,
  "parentId" number
);

CREATE TABLE "productOptions" (
  "id" number PRIMARY KEY,
  "productTypeId" number,
  "optionName" string,
  "type" number
);

CREATE TABLE "workerSpecialization" (
  "id" bigint PRIMARY KEY,
  "userId" bigint,
  "productTypeId" bigint
);

CREATE TABLE "requestInfo" (
  "id" bigint PRIMARY KEY,
  "title" string,
  "description" string,
  "location" string,
  "urgent" boolean NOT NULL,
  "timeStart" timestamp,
  "timeEnd" timestamp,
  "price" double
);

CREATE TABLE "userToWorkerRequests" (
  "id" SERIAL PRIMARY KEY,
  "requesterId" bigint,
  "workerId" bigint,
  "productTypeId" bigint,
  "requestInfoId" bigint,
  "reqStatus" patricipantStatus
);

CREATE TABLE "userToWorkerRequestOptions" (
  "requestId" bigint,
  "optionId" bigint,
  "value" string
);

CREATE TABLE "userOwnRequests" (
  "id" SERIAL PRIMARY KEY,
  "requesterId" bigint,
  "productTypeId" bigint,
  "requestInfoId" bigint,
  "reqStatus" productStatus
);

CREATE TABLE "userOwnRequestOptions" (
  "requestId" bigint,
  "optionId" bigint,
  "value" string
);

CREATE TABLE "workerToRequestApply" (
  "workerId" bigint,
  "ownRequestId" bigint,
  "suggestedPrice" double,
  "applyStatus" patricipantStatus
);

ALTER TABLE "balances" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "productOptions" ADD FOREIGN KEY ("productTypeId") REFERENCES "productTypes" ("id");

ALTER TABLE "workerSpecialization" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "workerSpecialization" ADD FOREIGN KEY ("productTypeId") REFERENCES "productTypes" ("id");

ALTER TABLE "userToWorkerRequests" ADD FOREIGN KEY ("requesterId") REFERENCES "users" ("id");

ALTER TABLE "userToWorkerRequests" ADD FOREIGN KEY ("workerId") REFERENCES "users" ("id");

ALTER TABLE "userToWorkerRequests" ADD FOREIGN KEY ("productTypeId") REFERENCES "productTypes" ("id");

ALTER TABLE "userToWorkerRequests" ADD FOREIGN KEY ("requestInfoId") REFERENCES "requestInfo" ("id");

ALTER TABLE "userToWorkerRequestOptions" ADD FOREIGN KEY ("requestId") REFERENCES "userToWorkerRequests" ("id");

ALTER TABLE "userToWorkerRequestOptions" ADD FOREIGN KEY ("optionId") REFERENCES "productOptions" ("id");

ALTER TABLE "userOwnRequests" ADD FOREIGN KEY ("requesterId") REFERENCES "users" ("id");

ALTER TABLE "userOwnRequests" ADD FOREIGN KEY ("productTypeId") REFERENCES "productTypes" ("id");

ALTER TABLE "userOwnRequests" ADD FOREIGN KEY ("requestInfoId") REFERENCES "requestInfo" ("id");

ALTER TABLE "userOwnRequestOptions" ADD FOREIGN KEY ("requestId") REFERENCES "userOwnRequests" ("id");

ALTER TABLE "userOwnRequestOptions" ADD FOREIGN KEY ("optionId") REFERENCES "productOptions" ("id");

ALTER TABLE "workerToRequestApply" ADD FOREIGN KEY ("workerId") REFERENCES "users" ("id");

ALTER TABLE "workerToRequestApply" ADD FOREIGN KEY ("ownRequestId") REFERENCES "userOwnRequests" ("id");

COMMENT ON COLUMN "userOwnRequests"."reqStatus" IS 'is my req completed';

sequelize model:create --name Users --attributes id:bigint,firstName:string,lastName:string,email:string,passwordHash:string,zip:string,phoneNumber:integer,photo:string,location:string,about:string