$js = [System.IO.File]::ReadAllText("scratch/test_script_4.js", [System.Text.Encoding]::UTF8)

$html = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Check Script Syntax Inline</title>
</head>
<body>
  <pre id="log"></pre>
  <script>
    window.onerror = function(msg, url, line, col, err) {
      document.getElementById('log').textContent += 'ERROR: ' + msg + '\nLine: ' + line + ', Col: ' + col + '\nStack: ' + (err ? err.stack : 'no stack') + '\n';
    };
  </script>
  <script>
$js
  </script>
  <script>
    document.getElementById('log').textContent += '\nAfter script load: quickLoginRole is ' + typeof quickLoginRole + '\n';
  </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText("scratch/check_inline.html", $html, [System.Text.Encoding]::UTF8)
Write-Output "Created scratch/check_inline.html"
