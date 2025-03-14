#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Seeding database..."
npm run seed

echo "Starting Node.js application..."
node "$SCRIPT_TO_RUN"