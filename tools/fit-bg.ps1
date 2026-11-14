param([switch]$Force)
# Fits generated map backdrops from assets/source/bg_<map>.png into assets/bg/bg_<map>.png at 600 x 300 (the size of every
# backdrop the game draws). Pictures are centre-cropped to 2:1 first (Recraft gives 16:9, so a strip comes off the top and
# bottom), never squashed. Existing files are left alone unless -Force is given.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'assets\source'
$dst = Join-Path $root 'assets\bg'
$w = 600; $h = 300
foreach ($f in Get-ChildItem $src -Filter 'bg_*.png') {
    $out = Join-Path $dst $f.Name
    if ((Test-Path $out) -and -not $Force) { continue }
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
