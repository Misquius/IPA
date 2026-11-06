#!/usr/bin/env bash
# Run once from inside the cluster3-project folder.
# 1) Edit the two lines below with your details.
git config user.name  "Your Name"
git config user.email "you@example.com"

git init -b main
git add .
git commit -m "Phase 1: initial project structure, plan, Gantt and checklists"

echo
echo "Next: create an EMPTY repo on GitHub (no README), then run:"
echo "  git remote add origin https://github.com/<you>/cluster3-project.git"
echo "  git push -u origin main"
echo "Then screenshot: git log --oneline  (with your name, ID and date visible)."
