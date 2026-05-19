$root = 'C:\Users\jakeh\Desktop\resin'
$fallbackImg = 'https://resinpro-cheshire.co.uk/images/vuba/poseidon-01.jpg'

Get-ChildItem $root -Recurse -Filter 'index.html' | ForEach-Object {
  $f = $_.FullName
  $c = Get-Content $f -Raw -Encoding UTF8
  if ($c -match 'twitter:card') { Write-Host "SKIP: $f"; return }

  # Extract OG data
  $title = if ($c -match '<meta property="og:title" content="([^"]+)"') { $Matches[1] } else { 'ResinPro Cheshire' }
  $desc  = if ($c -match '<meta property="og:description" content="([^"]+)"') { $Matches[1] } else { 'Approved Vuba resin bound driveway installers in Cheshire. 25-year guarantee. Free survey.' }
  $img   = if ($c -match '<meta property="og:image" content="([^"]+)"') { $Matches[1] } else { $fallbackImg }

  $tags = @"
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ResinPro_CH" />
  <meta name="twitter:title" content="$title" />
  <meta name="twitter:description" content="$desc" />
  <meta name="twitter:image" content="$img" />
"@

  # Insert after the og:image line (or og:locale if no og:image)
  if ($c -match '(<meta property="og:image"[^\n]+\n)') {
    $c2 = [regex]::Replace($c, '(<meta property="og:image"[^\n]+\n)', "`$1$tags`n", [System.Text.RegularExpressions.RegexOptions]::None, [System.TimeSpan]::FromSeconds(5))
  } elseif ($c -match '(<meta property="og:locale"[^\n]+\n)') {
    $c2 = [regex]::Replace($c, '(<meta property="og:locale"[^\n]+\n)', "`$1$tags`n", [System.Text.RegularExpressions.RegexOptions]::None, [System.TimeSpan]::FromSeconds(5))
  } else {
    Write-Host "NO-OG: $f"; return
  }

  if ($c2 -ne $c) {
    Set-Content -Path $f -Value $c2 -NoNewline -Encoding UTF8
    Write-Host "DONE: $f"
  }
}
