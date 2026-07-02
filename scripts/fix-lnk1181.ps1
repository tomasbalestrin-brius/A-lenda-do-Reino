Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null
$ErrorActionPreference = "Stop"

# 1) Baixar instalador oficial dos Build Tools
$installer = "$env:TEMP\vs_BuildTools.exe"
if (-not (Test-Path $installer)) {
  Invoke-WebRequest -Uri "https://aka.ms/vs/17/release/vs_BuildTools.exe" -OutFile $installer
}

# 2) Instalar/Modificar com os componentes necessários
& $installer --quiet --wait --norestart --nocache `
  --add Microsoft.VisualStudio.Workload.VCTools `
  --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 `
  --add Microsoft.VisualStudio.Component.VC.CoreBuildTools `
  --add Microsoft.VisualStudio.Component.Windows11SDK.22621 `
  --add Microsoft.VisualStudio.Component.Windows10SDK.20348 `
  --installPath "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools"

# 3) Atualizar PATH da sessão
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path","User")

# 4) Verificações
function Check($name, $cmd) { try { $v = Invoke-Expression $cmd; Write-Host ("[OK] {0}: {1}" -f $name,$v) } catch { Write-Host ("[FALHA] {0}" -f $name); throw } }
Check "rustc" "rustc -V"
Check "cargo" "cargo -V"
Check "cl.exe" "where cl"
Check "msbuild" "where msbuild"

# 5) Checar se kernel32.lib está disponível em alguma pasta de SDK
$libCandidates = @(
  "C:\Program Files (x86)\Windows Kits\10\Lib\10.0.22621.0\um\x64\kernel32.lib",
  "C:\Program Files (x86)\Windows Kits\10\Lib\10.0.20348.0\um\x64\kernel32.lib"
)
$foundLib = $libCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $foundLib) {
  Write-Error "Windows SDK não encontrado (kernel32.lib ausente). Abra o Visual Studio Installer e confirme a instalação do Windows 10/11 SDK."
  exit 1
} else {
  Write-Host "[OK] kernel32.lib encontrado em: $foundLib"
}

# 6) Carregar ambiente MSVC desta instalação explicitamente (garante INCLUDE/LIB corretos)
$vcvars = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if (Test-Path $vcvars) {
  cmd /c "`"$vcvars`" && set" | ForEach-Object {
    $k,$v = $_ -split "=",2
    if ($k -and $v) { Set-Item -Path ("Env:{0}" -f $k) -Value $v }
  }
  Write-Host "[OK] Ambiente MSVC carregado na sessão."
} else {
  Write-Warning "vcvars64.bat não encontrado — verifique a instalação dos Build Tools."
}

# 7) Reexecutar Tauri Dev (Vite + Tauri) — usa seu script existente
if (Test-Path ".\run-tauri-dev.cmd") {
  Write-Host "==> Rodando Tauri Dev..."
  & .\run-tauri-dev.cmd
} else {
  Write-Host "==> Script run-tauri-dev.cmd não encontrado. Rodando manualmente:"
  Write-Host "    concurrently -k `"vite`" `"tauri dev`""
  npx concurrently -k "vite" "tauri dev"
}
