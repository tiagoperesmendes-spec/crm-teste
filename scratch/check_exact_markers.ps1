$c = [System.IO.File]::ReadAllText("dashboard.html", [System.Text.Encoding]::UTF8)

# Check view-project-detail surrounding lines
$lines = $c -split "`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'view-project-detail') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
        for ($j = -3; $j -le 3; $j++) {
            Write-Output "   [$($i+$j+1)] $($lines[$i+$j].Trim())"
        }
        break
    }
}

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'modal-new-task') {
        Write-Output "Modal Line $($i+1): $($lines[$i].Trim())"
        for ($j = -3; $j -le 3; $j++) {
            Write-Output "   [$($i+$j+1)] $($lines[$i+$j].Trim())"
        }
        break
    }
}

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'viewName === .outlets.') {
        Write-Output "Switch Line $($i+1): $($lines[$i].Trim())"
        for ($j = -1; $j -le 6; $j++) {
            Write-Output "   [$($i+$j+1)] $($lines[$i+$j].Trim())"
        }
        break
    }
}
