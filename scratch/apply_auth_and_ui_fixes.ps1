$ErrorActionPreference = "Stop"

function Apply-FixesToFile($filePath) {
    Write-Host "Updating $filePath..."
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. CSS: Desativar slashed zero e fixar sidebar sticky no desktop
    $cssOld = '    /* Estilos da Aba / Barra Lateral Retrátil */'
    $cssNew = @"
    /* Desativação estrita de zeros com corte/traço (slashed zeros) */
    *, *::before, *::after {
      font-variant-numeric: normal no-slashed-zero !important;
      font-feature-settings: "zero" 0 !important;
    }

    .font-mono, [class*="font-mono"] {
      font-variant-numeric: normal no-slashed-zero !important;
      font-feature-settings: "zero" 0 !important;
    }

    @media (min-width: 768px) {
      #main-sidebar {
        position: sticky !important;
        top: 0 !important;
        height: 100vh !important;
        max-height: 100vh !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
    }

    /* Estilos da Aba / Barra Lateral Retrátil */
"@
    if ($content.Contains($cssOld) -and -not $content.Contains('no-slashed-zero')) {
        $content = $content.Replace($cssOld, $cssNew)
        Write-Host "Added CSS no-slashed-zero and sticky sidebar rule."
    }

    # 2. Sidebar classes & structure: sticky top-0, flex-1 overflow-y-auto for top nav, shrink-0 mt-auto for user card
    $sidebarOld = '<aside id="main-sidebar"' + "`r`n" + '      class="transition-all duration-300 ease-in-out w-full md:w-72 bg-[#FBF9F6]/90 backdrop-blur-md border-r border-[#E4DDD3] flex flex-col justify-between p-4 md:p-6 shrink-0 z-40 overflow-y-auto">' + "`r`n" + '      <div class="space-y-6">'
    $sidebarOldLF = '<aside id="main-sidebar"' + "`n" + '      class="transition-all duration-300 ease-in-out w-full md:w-72 bg-[#FBF9F6]/90 backdrop-blur-md border-r border-[#E4DDD3] flex flex-col justify-between p-4 md:p-6 shrink-0 z-40 overflow-y-auto">' + "`n" + '      <div class="space-y-6">'

    $sidebarNew = '<aside id="main-sidebar"' + "`r`n" + '      class="transition-all duration-300 ease-in-out w-full md:w-72 md:sticky md:top-0 md:h-screen md:max-h-screen bg-[#FBF9F6]/90 backdrop-blur-md border-r border-[#E4DDD3] flex flex-col justify-between p-4 md:p-6 shrink-0 z-40">' + "`r`n" + '      <div class="space-y-6 flex-1 overflow-y-auto pr-1">'

    if ($content.Contains($sidebarOld)) {
        $content = $content.Replace($sidebarOld, $sidebarNew)
        Write-Host "Updated sidebar header container."
    } elseif ($content.Contains($sidebarOldLF)) {
        $content = $content.Replace($sidebarOldLF, $sidebarNew)
        Write-Host "Updated sidebar header container (LF)."
    }

    # User card container: add shrink-0 mt-auto
    $userCardOld = '      <div class="pt-4 border-t border-[#E4DDD3]">' + "`r`n" + '        <div class="p-2.5 rounded-2xl bg-white border border-[#E4DDD3] flex items-center justify-between shadow-2xs hover:border-[#6C1C37]/30 transition-all">'
    $userCardOldLF = '      <div class="pt-4 border-t border-[#E4DDD3]">' + "`n" + '        <div class="p-2.5 rounded-2xl bg-white border border-[#E4DDD3] flex items-center justify-between shadow-2xs hover:border-[#6C1C37]/30 transition-all">'
    $userCardNew = '      <div class="pt-4 border-t border-[#E4DDD3] shrink-0 mt-auto">' + "`r`n" + '        <div class="p-2.5 rounded-2xl bg-white border border-[#E4DDD3] flex items-center justify-between shadow-2xs hover:border-[#6C1C37]/30 transition-all">'

    if ($content.Contains($userCardOld)) {
        $content = $content.Replace($userCardOld, $userCardNew)
        Write-Host "Updated user card container with shrink-0 mt-auto."
    } elseif ($content.Contains($userCardOldLF)) {
        $content = $content.Replace($userCardOldLF, $userCardNew)
        Write-Host "Updated user card container with shrink-0 mt-auto (LF)."
    }

    # Replace font-mono on sidebar badges to clean sans-serif
    $content = $content.Replace('id="sidebar-projects-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-projects-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')
    $content = $content.Replace('id="sidebar-projects-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-projects-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')

    $content = $content.Replace('id="sidebar-tasks-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-tasks-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')
    $content = $content.Replace('id="sidebar-tasks-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-tasks-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')

    $content = $content.Replace('id="sidebar-journalists-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-journalists-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')
    $content = $content.Replace('id="sidebar-journalists-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-journalists-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')

    $content = $content.Replace('id="sidebar-outlets-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-outlets-count"' + "`r`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')
    $content = $content.Replace('id="sidebar-outlets-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"', 'id="sidebar-outlets-count"' + "`n" + '              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-semibold px-2 py-0.5 rounded-full"')

    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "File saved successfully."
}

Apply-FixesToFile("c:\Users\tiago\Desktop\crm-teste\dashboard.html")
Apply-FixesToFile("c:\Users\tiago\Desktop\crm-teste\index.html")
