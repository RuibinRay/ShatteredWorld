param([switch]$Force)
# Fits generated splash art from assets/source into the sizes the game uses, in assets/bg:
#   hero_<id>.png  ->  96 x 128   (hero select tile)
#   ult_<id>.png   ->  520 x 260  (ultimate cut-in band)
# Pictures are centre-cropped to the target shape first, so nothing is squashed. Existing files in assets/bg are
# left alone unless -Force is given. The game picks the new files up by name; no code change is needed.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'assets\source'
$dst = Join-Path $root 'assets\bg'
$sizes = @{ 'hero_' = @(96, 128); 'ult_' = @(520, 260) }
foreach ($f in Get-ChildItem $src -Filter *.png) {
    $kind = $sizes.Keys | Where-Object { $f.Name.StartsWith($_) } | Select-Object -First 1
    if (-not $kind) { continue }
    $out = Join-Path $dst $f.Name
    if ((Test-Path $out) -and -not $Force) { continue }
    $w = $sizes[$kind][0]; $h = $sizes[$kind][1]
    $im = [System.Drawing.Image]::FromFile($f.FullName)
    try {
        $want = $w / $h; $have = $im.Width / $im.Height
        if ($have -gt $want) { $ch = $im.Height; $cw = [int]($ch * $want) } else { $cw = $im.Width; $ch = [int]($cw / $want) }
        $cx = [int](($im.Width - $cw) / 2); $cy = [int](($im.Height - $ch) / 2)
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($im, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), (New-Object System.Drawing.Rectangle($cx, $cy, $cw, $ch)), [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        "fitted $($f.Name) -> ${w}x${h}"
    } finally { $im.Dispose() }
}
