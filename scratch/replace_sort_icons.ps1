$path = "$pwd/scratch/views_markup.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$svgSort = '<svg class="w-3 h-3 text-[#6B6B6B] inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>'

# Replace all <span id="sort-icon-...">↕</span> with SVG
$updated = [regex]::Replace($content, '(<span id="sort-icon-[^"]*" class="[^"]*">)↕(<\/span>)', "`$1$svgSort`$2")

[System.IO.File]::WriteAllText($path, $updated, [System.Text.Encoding]::UTF8)
Write-Output "Successfully replaced sort icons in scratch/views_markup.html"
