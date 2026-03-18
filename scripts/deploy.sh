#!/usr/bin/env bash
set -e

echo "Bumping version..."
node scripts/bump-version.js
git add src/_data/buildInfo.json
git commit src/_data/buildInfo.json -m "Bump build version" || true

echo "Building site..."
npm run build

echo "Deploying to gh-pages branch..."
cd _site
git checkout gh-pages
git add -A
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push -f git@github.com:pborel/detroit-developers-website.git gh-pages

echo "Done! Site will be live shortly."
