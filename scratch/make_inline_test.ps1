$code = [System.IO.File]::ReadAllText("scratch\test_script_4.js", [System.Text.Encoding]::UTF8)

# We can wrap in try/catch or inline script
$html = @"
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Direct Syntax Test</title></head>
<body>
<pre id="log"></pre>
<script>
window.onerror = function(msg, url, line, col, err) {
  document.getElementById('log').textContent += 'UNCAUGHT: ' + msg + '\nLine: ' + line + ', Col: ' + col + '\nStack:\n' + (err ? err.stack : 'no stack');
};
</script>
<script>
$code
</script>
<script>
document.getElementById('log').textContent += '\nCOMPILATION SUCCESS: quickLoginRole is ' + typeof quickLoginRole;
</script>
</body>
</html>
"@

[System.IO.File]::WriteAllText("scratch\inline_test.html", $html, [System.Text.Encoding]::UTF8)
