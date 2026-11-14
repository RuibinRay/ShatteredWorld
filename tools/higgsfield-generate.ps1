param([string]$Manifest = (Join-Path $PSScriptRoot 'higgsfield-backdrops.json'), [string]$OutDir = (Join-Path $PSScriptRoot '..\assets\source'))
# Generates every image in a manifest with the Higgsfield API and saves the full-size PNGs.
# The API key is read from the environment and is never written to disk:
#   $env:HF_KEY = "<key id>:<key secret>"
# Manifest format: [{ "name": "slums", "endpoint": "recraft/v4.1/text-to-image", "body": { "prompt": "...", ... } }]
# Images that already exist in the output folder are skipped. Resize to 600x300 (zone backdrops) or
# 480x270 (title / memory art) and put them in assets/bg to use them in the game.
$ErrorActionPreference = 'Stop'
if (-not $env:HF_KEY) { throw 'Set $env:HF_KEY to "<key id>:<key secret>" first.' }
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$hdr = @{ Authorization = "Key $($env:HF_KEY)" }
$list = Get-Content $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force $OutDir | Out-Null }
$pending = @()
foreach ($j in $list) {
    $dest = Join-Path $OutDir ($j.name + '.png')
    if (Test-Path $dest) { "skip $($j.name) (exists)"; continue }
    $bytes = [System.Text.Encoding]::UTF8.GetBytes(($j.body | ConvertTo-Json -Depth 8 -Compress))
    try {
        $r = Invoke-RestMethod -Method Post -Uri ("https://api.higgsfield.ai/" + $j.endpoint) -Headers ($hdr + @{ 'Idempotency-Key' = [guid]::NewGuid().ToString() }) -ContentType 'application/json' -Body $bytes
        "submitted $($j.name)"
        $pending += @{ name = $j.name; url = $r.status_url; dest = $dest }
    } catch {
        $msg = $_.Exception.Message
        try { $sr = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream()); $msg += ' :: ' + $sr.ReadToEnd() } catch {}
        "FAILED $($j.name): $msg"
    }
}
$deadline = (Get-Date).AddMinutes(12)
while ($pending.Count -gt 0 -and (Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 4
    $next = @()
    foreach ($p in $pending) {
        try { $s = Invoke-RestMethod -Method Get -Uri $p.url -Headers $hdr } catch { $next += $p; continue }
        if ($s.status -eq 'completed') { Invoke-WebRequest -Uri $s.images[0].url -OutFile $p.dest -UseBasicParsing; "done $($p.name)" }
        elseif ($s.status -in @('failed', 'nsfw', 'canceled')) { "$($p.name): $($s.status)" }
        else { $next += $p }
    }
    $pending = $next
}
foreach ($p in $pending) { "TIMEOUT $($p.name)" }
