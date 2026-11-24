$locations = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:LOCALAPPDATA\Programs",
    "$env:APPDATA\npm",
    "$env:USERPROFILE\.nvm",
    "$env:USERPROFILE\.fnm",
    "$env:LOCALAPPDATA\fnm_multishells",
    "$env:LOCALAPPDATA\pnpm",
    "C:\nvm",
    "C:\tools"
)

foreach ($loc in $locations) {
    if (Test-Path $loc) {
        Get-ChildItem -Path $loc -Recurse -Filter "node.exe" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Output "Found Node: $($_.FullName)"
        }
        Get-ChildItem -Path $loc -Recurse -Filter "pnpm.cmd" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Output "Found PNPM: $($_.FullName)"
        }
        Get-ChildItem -Path $loc -Recurse -Filter "npm.cmd" -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Output "Found NPM: $($_.FullName)"
        }
    }
}
