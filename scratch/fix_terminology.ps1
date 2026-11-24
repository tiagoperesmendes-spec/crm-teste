$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Página título
$html = $html.Replace('document.getElementById(''page-title'').innerText = "Órgãos de Comunicação Social (OCS)";', 'document.getElementById(''page-title'').innerText = "Meios";')

# 2. Drawer cabeçalho
$html = $html.Replace('Ficha do Órgão de Comunicação (OCS)', 'Ficha do Meio')
$html = $html.Replace('Ficha do Órgão', 'Ficha do Meio')
$html = $html.Replace('Órgão(s) de Comunicação Social Associados', 'Meios de Comunicação Associados')
$html = $html.Replace('Nenhum jornalista registado associado a este órgão.', 'Nenhum jornalista registado associado a este meio.')
$html = $html.Replace('Nenhum órgão de comunicação identificado automaticamente.', 'Nenhum meio identificado automaticamente.')
$html = $html.Replace('Abrir ficha deste órgão', 'Abrir ficha deste meio')
$html = $html.Replace('Órgão de comunicação eliminado', 'Meio eliminado')

# 3. Remover referências a "Base 1" e "Base 2" em textos visíveis
$html = $html.Replace('Jornalistas selecionados da Base 2 para cobertura', 'Jornalistas selecionados para cobertura')
$html = $html.Replace('Selecionar jornalista da Base 2...', 'Selecionar jornalista...')
$html = $html.Replace('(Base 1)', '')
$html = $html.Replace('(Base 2)', '')

[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Terminology updated cleanly!"
