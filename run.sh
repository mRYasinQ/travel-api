#!/bin/sh

./wait-for -t 120 mysql:3306

echo "Migrating database..."
bun run db:migrate

echo "Starting app..."
bun run start
