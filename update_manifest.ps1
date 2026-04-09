$assetsFile = "Netlify/assets.js"
$manifestFile = "Netlify/manifest.json"

$assets = Get-Content $assetsFile -Raw
if ($assets -match 'logo:\s*"([^"]+)"') {
    $logo = $Matches[1]
    
    $manifestJson = Get-Content $manifestFile -Raw
    $manifest = $manifestJson | ConvertFrom-Json
    
    if ($manifest.icons) {
        $manifest.icons[0].src = $logo
        $manifest.icons[1].src = $logo
    }
    
    $manifest | ConvertTo-Json -Depth 10 | Out-File $manifestFile -Encoding utf8
    Write-Output "manifest.json updated successfully."
} else {
    Write-Error "Logo field not found in assets.js"
    exit 1
}
