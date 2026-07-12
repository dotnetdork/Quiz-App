@echo off
REM ============================================================
REM Quiz-App Branch Organizer
REM Run from the Quiz-App root directory:
REM   organize-branches.bat
REM ============================================================

echo === Step 0: Clean up stale lock file ===
del /f /q ".git\index.lock" 2>nul

echo.
echo === Step 1: Create ui-ux-redesign branch with all current work ===
git checkout ui-ux-redesign 2>nul || git checkout -b ui-ux-redesign

git add -A
git commit -m "feat: Complete UI/UX redesign -- Dashboard, Crucible, Studio AI Builder"

echo.
echo === Step 2: Reset main to 05ad100 ===
git checkout main
git reset --hard 05ad100ff24973da6437306864f13b1529429604

echo.
echo === Step 3: Create quiz-app-v2 orphan branch with only the PDF ===
REM Save the PDF to temp before wiping
copy /Y "Quiz-App_Reference_Document.pdf" "%TEMP%\Quiz-App_Reference_Document.pdf" 2>nul
git checkout ui-ux-redesign -- Quiz-App_Reference_Document.pdf 2>nul

REM Create orphan branch (no history)
git checkout --orphan quiz-app-v2
git rm -rf . 2>nul
git clean -fd 2>nul

REM Restore only the PDF
copy /Y "%TEMP%\Quiz-App_Reference_Document.pdf" "Quiz-App_Reference_Document.pdf"

git add Quiz-App_Reference_Document.pdf
git commit -m "Initial commit: Quiz-App Reference Document"

echo.
echo === Step 4: Verify ===
echo.
echo --- main branch ---
git log main --oneline -3
echo.
echo --- ui-ux-redesign branch ---
git log ui-ux-redesign --oneline -3
echo.
echo --- quiz-app-v2 branch (current) ---
git log quiz-app-v2 --oneline -1
echo.
echo Files in quiz-app-v2:
git ls-tree --name-only HEAD
echo.
echo === Done! Currently on quiz-app-v2 ===
echo   main           = reset to 05ad100 (original stable state)
echo   ui-ux-redesign = all UI/UX work preserved
echo   quiz-app-v2    = clean start with only the reference PDF

pause
