@echo off

REM Initialize a new Git repository
git init

REM Add the GitHub repository as a remote origin
git remote add origin https://github.com/DevTeamMODANMIC/hotel-website

REM Stage all changes in the current directory
git add .

REM Commit the changes
git commit -m "Implemented room display, fixed header visibility, and resolved reloading issue."

REM Push the changes to the 'vanquish' branch
git push -u origin vanquish

@echo on