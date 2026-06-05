# Lance la plateforme en LOCAL (serveur Node) puis l'ouvre en fenêtre "application" (sans barre de navigateur).
$ErrorActionPreference = 'SilentlyContinue'
$port = 3000
$platform = Resolve-Path (Join-Path $PSScriptRoot '..\platform')

# Démarrer le serveur s'il n'écoute pas déjà
$listening = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $listening) {
  Start-Process -WindowStyle Minimized -WorkingDirectory $platform -FilePath 'node' -ArgumentList 'server.mjs'
  Start-Sleep -Seconds 3
}

$url = "http://localhost:$port/"
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
if ($edge) { Start-Process $edge "--app=$url --window-size=1280,860" } else { Start-Process $url }
