Get-ChildItem "C:\Program Files\nodejs", "C:\Program Files (x86)\nodejs", "$env:LOCALAPPDATA\Programs", "$env:APPDATA\npm" -ErrorAction SilentlyContinue | Select-Object FullName
