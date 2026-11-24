$env:PATH.Split(';') | ForEach-Object {
    if (Test-Path $_) {
        Get-ChildItem -Path $_ -Filter *.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
    }
} | Sort-Object -Unique
