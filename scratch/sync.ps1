$c = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

$old = @"
      const newContact = {
        contact_name,
        outlet_name,
        contact_type,
        contact_time,
        subject_or_notes,
        contact_date
      };
"@

$new = @"
      const newContact = {
        contact_name,
        outlet_name,
        contact_type,
        contact_time,
        subject_or_notes,
        contact_date,
        collaborator: currentUser?.user_metadata?.full_name || 'Leonor Rodrigues',
        project_name: 'Expansão Ibérica 2026',
        status: 'Enviado',
        next_step: 'Aguardar resposta'
      };
"@

if ($c.Contains($old)) {
  $c = $c.Replace($old, $new)
  [System.IO.File]::WriteAllText("index.html", $c, [System.Text.UTF8Encoding]::new($false))
  Write-Output "Updated handleNewContactSubmit successfully."
} else {
  Write-Output "old string not found (might already be replaced)."
}

# Copy index.html to dashboard.html with identical UTF8 encoding
[System.IO.File]::WriteAllText("dashboard.html", $c, [System.Text.UTF8Encoding]::new($false))

# Verify SHA256 hash match
$hashIndex = (Get-FileHash -Path "index.html" -Algorithm SHA256).Hash
$hashDash = (Get-FileHash -Path "dashboard.html" -Algorithm SHA256).Hash

Write-Output "index.html hash:     $hashIndex"
Write-Output "dashboard.html hash: $hashDash"
if ($hashIndex -eq $hashDash) {
  Write-Output "SUCCESS: Both files have identical byte-for-byte SHA256 hashes!"
} else {
  Write-Error "MISMATCH: File hashes do not match!"
}
