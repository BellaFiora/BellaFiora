$localDir = "C:\Users\Fareo\Documents\Dev\Farbot"
$remoteDir = "\\FARBOT\node-containers\BellaFiora_Dev"
$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8

$localWatcher = New-Object System.IO.FileSystemWatcher
$localWatcher.Path = $localDir
$localWatcher.IncludeSubdirectories = $true
$localWatcher.EnableRaisingEvents = $true

$action = {
    $eventType = $Event.SourceEventArgs.ChangeType
    $filePath = $Event.SourceEventArgs.FullPath
    $fileName = (Get-Item $filePath).Name
    Write-Host "Changement détecté dans le répertoire local - Événement: $eventType, Fichier: $filePath"

    # Construire le chemin distant
    $remotePath = $filePath -replace [regex]::Escape($localDir), $remoteDir

    # Action en fonction du type d'événement
    switch ($eventType) {
        "Created", "Changed" {
            Write-Host "Fichier modifié/créé localement: $filePath"
            Write-Host "Remote Path: $remotePath"

            try {
                # Copier le fichier vers le dossier distant
                Copy-Item -Path $filePath -Destination $remotePath -Force
                Write-Host "Fichier copié vers le dossier distant: $remotePath"
            }
            catch {
                Write-Host "Erreur lors de la copie du fichier : $_"
            }
        }
        "Deleted" {
            Write-Host "Fichier supprimé localement: $filePath"
            Write-Host "Remote Path: $remotePath"

            try {
                # Supprimer le fichier distant
                Remove-Item -Path $remotePath -Force
                Write-Host "Fichier distant supprimé: $remotePath"
            }
            catch {
                Write-Host "Erreur lors de la suppression du fichier distant : $_"
            }
        }
        default {
            Write-Host "Événement non géré: $eventType"
        }
    }
}

Register-ObjectEvent -InputObject $localWatcher -EventName Created -Action $action
Register-ObjectEvent -InputObject $localWatcher -EventName Changed -Action $action
Register-ObjectEvent -InputObject $localWatcher -EventName Deleted -Action $action

# Boucle infinie pour maintenir le script actif
while ($true) {
    Start-Sleep -Seconds 1
}
