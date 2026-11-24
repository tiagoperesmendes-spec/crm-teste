$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

foreach ($f in $files) {
    Write-Host "Checking $f..."
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Count opening and closing braces inside <script>
    $scriptMatches = [regex]::Matches($content, '(?s)<script>(.*?)<\/script>')
    Write-Host "Found $($scriptMatches.Count) script tags."

    $idx = 0
    foreach ($m in $scriptMatches) {
        $idx++
        $code = $m.Groups[1].Value
        $openBraces = ([regex]::Matches($code, '\{')).Count
        $closeBraces = ([regex]::Matches($code, '\}')).Count
        $openParens = ([regex]::Matches($code, '\(')).Count
        $closeParens = ([regex]::Matches($code, '\)')).Count

        Write-Host "  Script #$idx : { = $openBraces, } = $closeBraces | ( = $openParens, ) = $closeParens"
        if ($openBraces -ne $closeBraces) {
            Write-Host "  WARNING: Brace mismatch in script #$idx!" -ForegroundColor Red
        }
        if ($openParens -ne $closeParens) {
            Write-Host "  WARNING: Parenthesis mismatch in script #$idx!" -ForegroundColor Red
        }
    }
}
