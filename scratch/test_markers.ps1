$dash = [System.IO.File]::ReadAllText('c:\Users\tiago\Desktop\crm-teste\dashboard.html', [System.Text.Encoding]::UTF8)

function Test-Marker($name, $str) {
    $idx = $dash.IndexOf($str)
    Write-Host "$name index: $idx"
}

Test-Marker "view-journalists start" '<div id="view-journalists"'
Test-Marker "view-outlets start" '<div id="view-outlets"'
Test-Marker "view-project-detail start" '<div id="view-project-detail"'
Test-Marker "modal-new-journalist start" '<div id="modal-new-journalist"'
Test-Marker "modal-new-outlet start" '<div id="modal-new-outlet"'
Test-Marker "modal-new-request start" '<div id="modal-new-request"'
Test-Marker "DEFAULT_SAMPLE_OUTLETS" 'const DEFAULT_SAMPLE_OUTLETS = ['
Test-Marker "DEFAULT_SAMPLE_JOURNALISTS" 'const DEFAULT_SAMPLE_JOURNALISTS = ['
Test-Marker "DEFAULT_SAMPLE_END" '// 3. AUXILIARES DE FORMATAÇÃO E STATUS'
Test-Marker "renderJournalistsTable" 'function renderJournalistsTable()'
Test-Marker "renderOutletsTable" 'function renderOutletsTable()'
