# PowerShell script to fix EnhancedAnalytics.jsx by removing orphaned CSV code

$filePath = "src\pages\Admin\components\EnhancedAnalytics.jsx"
$backupPath = "src\pages\Admin\components\EnhancedAnalytics.jsx.backup"

Write-Host "Creating backup..."
Copy-Item $filePath $backupPath

Write-Host "Reading file content..."
$content = Get-Content $filePath

Write-Host "Removing orphaned lines 489-518..."
# Keep lines 0-488 and 519 onwards
$newContent = $content[0..488] + $content[519..($content.Length-1)]

Write-Host "Writing corrected file..."
$newContent | Set-Content $filePath

Write-Host "✅ Fixed! Orphaned CSV code removed."
Write-Host "📁 Backup saved as: $backupPath"
