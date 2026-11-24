$files = @("dashboard.html", "index.html", "public/index.html", "public/dashboard.html")

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Tab labels
    $content = $content.Replace('<span>Mural da Direção</span>', '<span>Anúncios</span>')
    $content = $content.Replace('<span>Chat da Equipa</span>', '<span>Chat</span>')

    # 2. Section comments and subtitles
    $content = $content.Replace('<!-- Separadores por Secção: Mural da Direção vs Chat da Equipa -->', '<!-- Separadores por Secção: Anúncios vs Chat -->')
    $content = $content.Replace('<!-- SECÇÃO 1: MURAL DA DIREÇÃO -->', '<!-- SECÇÃO 1: ANÚNCIOS -->')
    $content = $content.Replace('<!-- SECÇÃO 2: CHAT DA EQUIPA -->', '<!-- SECÇÃO 2: CHAT -->')
    $content = $content.Replace('Mural de avisos da direção e mensagens entre a equipa.', 'Anúncios da direção e chat entre colaboradores.')
    $content = $content.Replace('Fixar este anúncio no topo do mural', 'Fixar este anúncio no topo')
    $content = $content.Replace('Anúncio publicado no mural da direção com sucesso.', 'Anúncio publicado com sucesso.')
    $content = $content.Replace('<!-- 4. Comunicação (Mural de Anúncios & Chat) -->', '<!-- 4. Comunicação (Anúncios & Chat) -->')
    $content = $content.Replace('<!-- VISTA 6: COMUNICAÇÃO (MURAL DA DIREÇÃO & CHAT DA EQUIPA) -->', '<!-- VISTA 6: COMUNICAÇÃO (ANÚNCIOS & CHAT) -->')
    $content = $content.Replace('// MÓDULO DE COMUNICAÇÃO (MURAL DA DIREÇÃO & CHAT DA EQUIPA)', '// MÓDULO DE COMUNICAÇÃO (ANÚNCIOS & CHAT)')

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Output "Updated labels to 'Anúncios' and 'Chat' in $file"
}
