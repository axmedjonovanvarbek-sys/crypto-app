@echo off
echo ============================================================
echo       CryptoVision loyihasi ishga tushirilmoqda...
echo ============================================================
echo.

echo [1/4] Backend modullari o'rnatilmoqda...
cd backend
call npm install
echo.

echo [2/4] Backend serveri ishga tushirilmoqda (port 5000)...
start cmd /k "title CryptoVision Backend && npm run dev"
cd ..

echo [3/4] Frontend modullari o'rnatilmoqda...
cd frontend
call npm install
echo.

echo [4/4] Frontend serveri ishga tushirilmoqda (port 3001)...
start cmd /k "title CryptoVision Frontend && npm run dev"
cd ..

echo.
echo Brauzer 5 soniyadan keyin ochiladi...
timeout /t 5 /nobreak >nul

echo Brauzer ochilmoqda...
start http://localhost:3001

echo.
echo ==============================================================
echo   CryptoVision muvaffaqiyatli ishga tushirildi!
echo   Frontend:  http://localhost:3001
echo   Backend:   http://localhost:5000
echo ==============================================================
echo.
echo Bu oynani yopishingiz mumkin. Serverlar orqa fonda ishlaydi.
pause
