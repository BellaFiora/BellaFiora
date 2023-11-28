# Répertoire local
$localDir = "C:\Users\Fareo\Documents\Dev\Farbot"

# Répertoire distant
$remoteDir = "\\FARBOT\node-containers\BellaFiora_Dev"

# Fonction pour exécuter les actions nécessaires
function Perform-Actions {
    param(
        [string]$directory,
        [string]$eventType,
        [string]$file
    )

    Write-Host "Changement détecté dans : $directory"
    Write-Host "Événement : $eventType"
    Write-Host "Fichier : $file"

    # Ajoutez vos actions ici
}

# Surveiller le répertoire local
Register-ObjectEvent -InputObject (Get-ChildItem $localDir -Recurse) -EventName Changed -Action {
    Perform-Actions -directory "Répertoire local" -eventType "Changed" -file $event.SourceEventArgs.FullPath
} | Out-Null

# Surveiller le répertoire distant
Register-ObjectEvent -InputObject (Get-ChildItem $remoteDir -Recurse) -EventName Changed -Action {
    Perform-Actions -directory "Répertoire distant" -eventType "Changed" -file $event.SourceEventArgs.FullPath
} | Out-Null

# Attendre indéfiniment
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Unregister-Event -SourceIdentifier "FileSystemWatcher"
}
