Get-ChildItem -Path . -Recurse -File -Include *dashboard*, *backup* | Select-Object FullName, Length, LastWriteTime
