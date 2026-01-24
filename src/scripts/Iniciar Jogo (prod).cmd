@echo off
setlocal EnableExtensions
REM Lanca o jogo em modo producao (sempre gera build limpo)

cd /d "%~dp0\..\.."

if not exist package.json (
  echo [ERRO] Nao encontrei package.json nesta pasta: %cd%
  pause
  exit /b 1
)

echo Limpando build anterior...
if exist build rmdir /s /q build

echo Gerando build de producao...
call npm run build || goto :error

if not exist build\index.html (
  echo [ERRO] Build incompleto: arquivo build\index.html nao encontrado.
  pause
  exit /b 1
)

echo Servindo build em http://localhost:3000
start "" http://localhost:3000
npx serve -s build -l 3000
goto :eof

:error
echo Falha ao gerar/rodar build. Verifique o Node/npm e tente novamente.
pause
exit /b 1
