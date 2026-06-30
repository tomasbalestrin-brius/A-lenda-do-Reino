# Powershell script to download and extract direct asset files for A Lenda do Reino

# Ensure TLS 1.2 is used for download
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Paths definition
$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = "." }
$publicAssetsDir = "$baseDir\..\public\assets"
$uiDir = "$publicAssetsDir\ui"
$tilesetsDir = "$publicAssetsDir\tilesets"
$tempZip = "$baseDir\rpg_gui_v1.zip"

Write-Host "Creating assets directories..."
New-Item -ItemType Directory -Force -Path $uiDir | Out-Null
New-Item -ItemType Directory -Force -Path $tilesetsDir | Out-Null

# 1. Download RPG GUI Kit v1.0
$guiUrl = "https://opengameart.org/sites/default/files/rpg_gui_v1.zip"
Write-Host "Downloading RPG GUI Kit v1.0 (2.9 MB)..."
try {
    Invoke-WebRequest -Uri $guiUrl -OutFile $tempZip
    Write-Host "Extracting RPG GUI Kit to $uiDir..."
    Expand-Archive -Path $tempZip -DestinationPath "$uiDir\rpg_gui_v1" -Force
    Remove-Item -Path $tempZip -ErrorAction SilentlyContinue
    Write-Host "RPG GUI Kit downloaded and extracted successfully!"
} catch {
    Write-Warning "Failed to download/extract RPG GUI Kit: $_"
}

# 2. Download Jerom's 16x16 Fantasy Tileset
$jeromUrl = "https://opengameart.org/sites/default/files/16x16_Jerom_CC-BY-SA-3.0_0.png"
$jeromPath = "$tilesetsDir\jerom_tileset.png"
Write-Host "Downloading Jerom's 16x16 Fantasy Tileset..."
try {
    Invoke-WebRequest -Uri $jeromUrl -OutFile $jeromPath
    Write-Host "Jerom's tileset saved to $jeromPath"
} catch {
    Write-Warning "Failed to download Jerom's tileset: $_"
}

# 3. Download Forest Tiles (surt)
$forestUrl = "https://opengameart.org/sites/default/files/forest_tiles.png"
$forestPath = "$tilesetsDir\forest_tiles.png"
Write-Host "Downloading Forest Tiles..."
try {
    Invoke-WebRequest -Uri $forestUrl -OutFile $forestPath
    Write-Host "Forest tiles saved to $forestPath"
} catch {
    Write-Warning "Failed to download Forest tiles: $_"
}

# 4. Download Speria Tileset
$speriaUrl = "https://opengameart.org/sites/default/files/Speria_TileSet_0.png"
$speriaPath = "$tilesetsDir\speria_tileset.png"
Write-Host "Downloading Speria Tileset..."
try {
    Invoke-WebRequest -Uri $speriaUrl -OutFile $speriaPath
    Write-Host "Speria tileset saved to $speriaPath"
} catch {
    Write-Warning "Failed to download Speria tileset: $_"
}

Write-Host "Download process completed!"
