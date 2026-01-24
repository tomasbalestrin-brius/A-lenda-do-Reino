@echo off
setlocal EnableExtensions
REM Lança o jogo em modo desenvolvimento (Create React App)

REM Vai para a raiz do projeto (dois níveis acima de src\scripts)
cd /d "%~dp0\..\.."

if not exist package.json (
  echo [ERRO] Nao encontrei package.json nesta pasta: %cd%
  echo Abra este arquivo a partir do projeto correto.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias (npm install)...
  call npm install || goto :error
)

start "" http://localhost:3000
call npm start
goto :eof

:error
echo Ocorreu um erro ao instalar/rodar. Verifique o Node/npm e tente novamente.
pause
exit /b 1

