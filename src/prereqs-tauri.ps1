Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null

function Test-Cmd { param([string]$Name) return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }
function Log { param([string]$m,[string]$lvl="INFO"); Write-Host "[$lvl] $m" }
function Ensure-Winget {
  if (Test-Cmd "winget") { Log -m 'winget encontrado.' -lvl 'OK'; return $true }
  Log -m 'winget nao encontrado no PATH.' -lvl 'WARN'
  Log -m 'Instale/atualize App Installer pela Microsoft Store e reabra o terminal.' -lvl 'HINT'
  return $false
}
function Test-WebView2 {
  try {
    reg query "HKLM\SOFTWARE\Microsoft\EdgeUpdate\Clients" /s | Select-String -Pattern "WebView2" -Quiet
  } catch { $false }
}

$report = [ordered]@{}
$report.Node     = (node -v) 2>$null
$report.npm      = (npm -v) 2>$null
$report.rustc    = (rustc -V) 2>$null
$report.cargo    = (cargo -V) 2>$null
$report.cl       = (where cl) 2>$null
$report.msbuild  = (where msbuild) 2>$null
$report.webview2 = (Test-WebView2)

Log 'Versoes detectadas:'
$report.GetEnumerator() | ForEach-Object { Write-Host (" - {0}: {1}" -f $_.Key, ($_.Value -join ' ')) }

if (-not (Ensure-Winget)) { exit 2 }

if (-not $report.rustc) {
  Log -m "Instalando Rust MSVC..." -lvl 'STEP'
  winget install -e --id Rustlang.Rust.MSVC --silent
} else { Log -m "Rust ja presente: $($report.rustc)" -lvl 'OK' }

$needCl = -not $report.cl
$needMsBuild = -not $report.msbuild
if ($needCl -or $needMsBuild) {
  Log -m "Instalando Visual Studio Build Tools 2022 (C++ + SDK)..." -lvl 'STEP'
  winget install -e --id Microsoft.VisualStudio.2022.BuildTools
  Log -m "Se necessario, execute depois (opcional, componentes minimos):" -lvl 'HINT'
  Log -m 'vs_BuildTools.exe --quiet --wait --norestart --nocache --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.VC.CoreBuildTools --add Microsoft.VisualStudio.Component.Windows10SDK.20348' -lvl 'HINT'
} else { Log -m 'cl.exe / MSBuild ja presentes.' -lvl 'OK' }

if (-not $report.webview2) {
  Log -m 'Instalando WebView2 Runtime...' -lvl 'STEP'
  winget install -e --id Microsoft.EdgeWebView2Runtime --silent
} else { Log -m 'WebView2 ja presente.' -lvl 'OK' }

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path","User")

Start-Sleep -Seconds 3
$final = [ordered]@{}
$final.Node     = (node -v) 2>$null
$final.npm      = (npm -v) 2>$null
$final.rustc    = (rustc -V) 2>$null
$final.cargo    = (cargo -V) 2>$null
$final.cl       = (where cl) 2>$null
$final.msbuild  = (where msbuild) 2>$null
$final.webview2 = (Test-WebView2)

Write-Host "`n================= RESUMO POS-INSTALACAO ================="
$final.GetEnumerator() | ForEach-Object {
  if ($_.Key -eq 'webview2') {
    if ($_.Value) { $val = 'OK' } else { $val = 'FALTANDO' }
  } else {
    $val = ($_.Value -join ' ')
  }
  Write-Host (" - {0}: {1}" -f $_.Key, $val)
}

$ok = $final.rustc -and $final.cargo -and $final.cl -and $final.msbuild -and $final.webview2
if ($ok) {
  Log -m 'Pre-requisitos completos. Pronto para integrar TAURI.' -lvl 'OK'
  Write-Host 'Proximo passo sugerido:'
  Write-Host '  npm i -D @tauri-apps/cli concurrently; npm i @tauri-apps/api'
  Write-Host '  npx tauri init  (distDir=dist, devPath=http://localhost:5173)'
  Write-Host '  npm run tauri:dev  # janela nativa'
  exit 0
} else {
  Log -m 'Ainda faltam pre-requisitos. Corrija conforme indicado acima e rode novamente.' -lvl 'ERR'
  if (-not $final.webview2) { Log -m 'Instale WebView2: winget install -e --id Microsoft.EdgeWebView2Runtime' -lvl 'HINT' }
  if (-not $final.rustc)    { Log -m 'Instale Rust MSVC: winget install -e --id Rustlang.Rust.MSVC' -lvl 'HINT' }
  if (-not $final.cl -or -not $final.msbuild) { Log -m 'Instale VS Build Tools: winget install -e --id Microsoft.VisualStudio.2022.BuildTools' -lvl 'HINT' }
  exit 1
}
