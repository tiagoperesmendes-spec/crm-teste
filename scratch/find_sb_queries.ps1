$content = [System.IO.File]::ReadAllText("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
$matches = [regex]::Matches($content, "(from\('(journalists|media_outlets)'\)|rep_journalists|rep_outlets)")
foreach ($m in $matches) {
    $start = [Math]::Max(0, $m.Index - 30)
    $len = [Math]::Min(120, $content.Length - $start)
    Write-Output "[$($m.Index)]: $($content.Substring($start, $len).Replace("`n", ' '))"
}
