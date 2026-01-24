@echo off
setlocal EnableExtensions
REM Configura Tailwind CSS no projeto Create React App

cd /d "%~dp0\..\.." || goto :error

if not exist package.json (
  echo [ERRO] Nao encontrei package.json em %cd%
  pause
  exit /b 1
)

echo Instalando Tailwind e dependencias...
call npm install -D tailwindcss postcss autoprefixer || goto :error

echo Gerando arquivos de configuracao...
call npx tailwindcss init -p || goto :error

echo Escrevendo configuracao padrao no tailwind.config.js
powershell -NoProfile -Command "^$cfg = '{^"content^": [^"./src/**/*.{js,jsx,ts,tsx}^"], ^"theme^": { ^"extend^": {} }, ^"plugins^": [] }'; Set-Content -Path tailwind.config.js -Value ^$cfg"

echo Garantindo diretivas no src\index.css
powershell -NoProfile -Command "^$f='src/index.css'; if(-not (Test-Path ^$f)){ New-Item -ItemType File -Path ^$f -Force | Out-Null }; ^$t = Get-Content ^$f -Raw; if(^$t -notmatch '@tailwind base'){ ^$t = ('@tailwind base;`n@tailwind components;`n@tailwind utilities;`n`n' + ^$t) }; Set-Content ^$f ^$t"

echo Pronto! Reinicie o servidor se estiver rodando (Ctrl+C) e execute:
echo    npm start
echo As classes Tailwind agora estarao ativas.
pause
goto :eof

:error
echo Ocorreu um erro. Verifique a conexao e o Node/npm.
pause
exit /b 1

