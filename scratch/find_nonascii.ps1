$content = [System.IO.File]::ReadAllText("$pwd/scratch/views_markup.html", [System.Text.Encoding]::UTF8)
$matches = [regex]::Matches($content, '[^\x00-\x7F]')
$distinct = @{}
foreach ($m in $matches) {
    $c = $m.Value
    if (!$distinct.ContainsKey($c)) {
        $distinct[$c] = 0
    }
    $distinct[$c]++
}
Write-Output "Distinct non-ASCII characters in views_markup.html:"
$distinct.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Output ("Char: " + $_.Name + " (Code: " + [int][char]$_.Name + "), Count: " + $_.Value)
}
