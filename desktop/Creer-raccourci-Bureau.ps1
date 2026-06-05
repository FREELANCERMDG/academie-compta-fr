# Crée un raccourci "Académie Compta FR" sur le Bureau (lance l'app bureau locale).
$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$lnk = $ws.CreateShortcut((Join-Path $desktop 'Academie Compta FR.lnk'))
$lnk.TargetPath = (Join-Path $PSScriptRoot 'Lancer-MG-Compta.bat')
$lnk.WorkingDirectory = $PSScriptRoot
$ico = Join-Path $PSScriptRoot 'app.ico'
if (Test-Path $ico) { $lnk.IconLocation = $ico }
$lnk.Description = 'Academie Compta FR - MG CONSULTING IT&ACT'
$lnk.Save()
Write-Output "Raccourci cree sur le Bureau : Academie Compta FR"
