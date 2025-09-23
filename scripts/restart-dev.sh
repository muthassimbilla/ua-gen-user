#!/bin/bash

echo "Stopping development server..."
pkill -f "next dev" || true

echo "Clearing Next.js cache..."
rm -rf .next

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run dev
