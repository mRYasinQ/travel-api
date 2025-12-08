#!/bin/sh

echo "Migrating database..."
bun run db:migrate

echo

echo "Starting app..."
bun run start
