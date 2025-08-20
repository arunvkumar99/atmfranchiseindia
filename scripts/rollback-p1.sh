#!/bin/bash
# P1 Rollback Script
# Run this if P1 causes issues

echo "Rolling back P1 changes..."
cp "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationHero.tsx.p1backup" "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationHero.tsx"
cp "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationSinglePage.tsx.p1backup" "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationSinglePage.tsx"
cp "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationProgressive.tsx.p1backup" "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\components\SubmitLocationProgressive.tsx"
cp "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\pages\Home.tsx.p1backup" "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\pages\Home.tsx"
cp "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\pages\SubmitLocation.tsx.p1backup" "C:\Users\arunv\AppData\Local\Programs\Microsoft VS Code\atmfranchiseindia\src\pages\SubmitLocation.tsx"
echo "Rollback complete. Restart dev server."
