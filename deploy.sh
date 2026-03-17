#!/usr/bin/env bash
set -e

echo "Building site..."
npm run build

echo "Deploying to gh-pages branch..."
cd _site
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push -f git@github.com:pborel/detroit-developers-website.git gh-pages

echo "Done! Site will be live shortly."
