@echo off
setlocal EnableExtensions
REM Cria um atalho na Área de Trabalho para iniciar o jogo (produção)

REM Caminho do alvo: o launcher de produção já criado
set "TARGET=%~dp0Iniciar Jogo (prod).cmd"

if not exist "%TARGET%" (
  echo [ERRO] Nao encontrei o launcher: "%TARGET%"
  pause
  exit /b 1
)

echo Criando atalho na Area de Trabalho...
powershell -NoProfile -ExecutionPolicy Bypass -Command "^
  $desktop=[Environment]::GetFolderPath('Desktop'); ^
  $workdir=(Resolve-Path \"%~dp0..\..\").Path; ^
  $s=New-Object -ComObject WScript.Shell; ^
  $lnk=$s.CreateShortcut((Join-Path $desktop 'A Lenda do Reino (Prod).lnk')); ^
  $lnk.TargetPath=\"%TARGET%\"; ^
  $lnk.WorkingDirectory=$workdir; ^
  $lnk.IconLocation=\"$env:SystemRoot\\System32\\shell32.dll,167\"; ^
  $lnk.Description=\"Inicia o jogo em producao\"; ^
  $lnk.Save(); ^
  Write-Host \"Atalho criado em:\" (Join-Path $desktop 'A Lenda do Reino (Prod).lnk')"

pause
