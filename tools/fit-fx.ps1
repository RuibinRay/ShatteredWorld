param([int]$Grid = 3, [int]$Size = 64, [switch]$Force, [string]$Out = '')
# Turns generated effect sheets into the strips the game plays (js/moves.js):
#   assets/source/fx_<name>.png   a square picture holding a Grid x Grid sheet of frames, read left to right, top to bottom
#   -> assets/fx/fx_<name>.png    the same frames in ONE row, each Size x Size (9 frames of 64 = 576 x 64)
#   -> assets/fx/list.json        the names that exist, which is what the game asks for
# The frames are drawn additively, so black shows as nothing. Generated backgrounds are only NEARLY black, which would draw
# a faint box round each effect, so the strip is cleaned: a pixel whose brightest channel is under 40 becomes pure black,
# and 40 to 72 is faded in. Existing strips are kept unless -Force is given. -Out writes somewhere else (for a trial run).
# To drop an effect, delete its strip and run this again: the game falls back to its built-in particles.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'assets\source'
$dst = if ($Out) { $Out } else { Join-Path $root 'assets\fx' }
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force $dst | Out-Null }
$lo = 40; $hi = 72
foreach ($f in Get-ChildItem $src -Filter 'fx_*.png') {
    $dest = Join-Path $dst $f.Name
    if ((Test-Path $dest) -and -not $Force) { continue }
    $im = [System.Drawing.Image]::FromFile($f.FullName)
    try {
        $cw = $im.Width / $Grid; $ch = $im.Height / $Grid; $w = $Size * $Grid * $Grid
        $bmp = New-Object System.Drawing.Bitmap($w, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::Black)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        for ($i = 0; $i -lt ($Grid * $Grid); $i++) {
            $sx = [int](($i % $Grid) * $cw); $sy = [int]([math]::Floor($i / $Grid) * $ch)
            $g.DrawImage($im, (New-Object System.Drawing.Rectangle(($i * $Size), 0, $Size, $Size)), (New-Object System.Drawing.Rectangle($sx, $sy, [int]$cw, [int]$ch)), [System.Drawing.GraphicsUnit]::Pixel)
        }
        $g.Dispose()
        # near-black -> black
        $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $Size)
        $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $bytes = New-Object byte[] ($data.Stride * $Size)
        [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
        for ($p = 0; $p -lt $bytes.Length; $p += 4) {
            $m = [math]::Max($bytes[$p], [math]::Max($bytes[$p + 1], $bytes[$p + 2]))
            if ($m -lt $lo) { $bytes[$p] = 0; $bytes[$p + 1] = 0; $bytes[$p + 2] = 0 }
            elseif ($m -lt $hi) { $k = ($m - $lo) / ($hi - $lo); $bytes[$p] = [byte]($bytes[$p] * $k); $bytes[$p + 1] = [byte]($bytes[$p + 1] * $k); $bytes[$p + 2] = [byte]($bytes[$p + 2] * $k) }
            $bytes[$p + 3] = 255
        }
        [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
        $bmp.UnlockBits($data)
        $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        "fitted $($f.Name) -> $($Grid * $Grid) frames of ${Size}x${Size}"
    } finally { $im.Dispose() }
}
$names = @(Get-ChildItem $dst -Filter 'fx_*.png' | ForEach-Object { $_.BaseName.Substring(3) })
$json = if ($names.Count) { '[' + (($names | ForEach-Object { '"' + $_ + '"' }) -join ', ') + ']' } else { '[]' }
[System.IO.File]::WriteAllText((Join-Path $dst 'list.json'), $json)
"list.json: $json"
