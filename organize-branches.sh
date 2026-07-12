#!/bin/bash
# ============================================================
# Quiz-App Branch Organizer
# Run this from the Quiz-App root directory:
#   bash organize-branches.sh
# ============================================================

set -e

echo "=== Step 0: Clean up stale lock file ==="
rm -f .git/index.lock

echo ""
echo "=== Step 1: Create ui-ux-redesign branch with all current work ==="
# We're already on ui-ux-redesign (created in sandbox), but if not:
git checkout ui-ux-redesign 2>/dev/null || git checkout -b ui-ux-redesign

git add -A
git commit -m "feat: Complete UI/UX redesign — Dashboard, Crucible, Studio AI Builder

- Redesigned Dashboard with profile hero, animated skill bars, zone cards
- Redesigned Crucible with Arena/Gauntlet/Leaderboard tabs
- Converted Studio to Codecademy-inspired AI Builder (chat-first, split view)
- Unified orange/navy design system with CSS custom properties
- Added animated backgrounds (14 themes), click particles, skeleton loaders
- Added AI tutor with credit budgets and rubric grading
- Added quest system (reflection journals, AI chat challenges)
- Added course progress tracking with XP/streaks
- Includes Quiz-App Reference Document PDF"

echo ""
echo "=== Step 2: Reset main to 05ad100 ==="
git checkout main
git reset --hard 05ad100ff24973da6437306864f13b1529429604

echo ""
echo "=== Step 3: Create quiz-app-v2 orphan branch with only the PDF ==="
# Copy the PDF to a temp location first
cp Quiz-App_Reference_Document.pdf /tmp/Quiz-App_Reference_Document.pdf 2>/dev/null || true

# Check it out from ui-ux-redesign if the file isn't on main
git checkout ui-ux-redesign -- Quiz-App_Reference_Document.pdf 2>/dev/null || true

# If still not found, restore from temp
if [ ! -f Quiz-App_Reference_Document.pdf ]; then
    cp /tmp/Quiz-App_Reference_Document.pdf . 2>/dev/null || true
fi

# Create orphan branch (no parent commits, no files)
git checkout --orphan quiz-app-v2
git rm -rf . 2>/dev/null || true
git clean -fd 2>/dev/null || true

# Restore only the PDF
cp /tmp/Quiz-App_Reference_Document.pdf ./Quiz-App_Reference_Document.pdf 2>/dev/null || \
    git checkout ui-ux-redesign -- Quiz-App_Reference_Document.pdf 2>/dev/null

git add Quiz-App_Reference_Document.pdf
git commit -m "Initial commit: Quiz-App Reference Document

Clean starting point for UA Framework rebuild.
Reference PDF documents the original app's features, design system, and architecture."

echo ""
echo "=== Step 4: Verify ==="
echo ""
echo "--- main branch ---"
git log main --oneline -3
echo ""
echo "--- ui-ux-redesign branch ---"
git log ui-ux-redesign --oneline -3
echo ""
echo "--- quiz-app-v2 branch (current) ---"
git log quiz-app-v2 --oneline -1
echo ""
echo "Files in quiz-app-v2:"
git ls-tree --name-only HEAD
echo ""
echo "=== Done! Currently on quiz-app-v2. ==="
echo "  main           -> reset to 05ad100 (original stable state)"
echo "  ui-ux-redesign -> all UI/UX work preserved"
echo "  quiz-app-v2    -> clean start with only the reference PDF"
