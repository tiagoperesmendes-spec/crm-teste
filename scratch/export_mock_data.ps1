$content = Get-Content -Raw -Path 'src/lib/mock-data.ts'
$outletsMatch = [regex]::Match($content, 'export const sampleMediaOutlets: MediaOutlet\[\] = (\[[\s\S]*?\n\]);')
$jourMatch = [regex]::Match($content, 'export const sampleJournalists: Journalist\[\] = (\[[\s\S]*?\n\]);')

$outletsJs = $outletsMatch.Groups[1].Value
$jourJs = $jourMatch.Groups[1].Value

Set-Content -Path 'scratch/sample_outlets.js' -Value ("const DEFAULT_SAMPLE_OUTLETS = " + $outletsJs + ";`n")
Set-Content -Path 'scratch/sample_journalists.js' -Value ("const DEFAULT_SAMPLE_JOURNALISTS = " + $jourJs + ";`n")

Write-Output "Successfully exported mock data to scratch!"
