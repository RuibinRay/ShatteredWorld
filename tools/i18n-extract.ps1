param([string]$Out = (Join-Path $PSScriptRoot 'i18n\strings.json'))
# Collects every piece of display text in js/*.js (string literals that read like words), in source order, without
# duplicates, and writes them to tools/i18n/strings.json as [{ "s": text, "f": file }]. Template literals become
# patterns: `Lv ${n}` is written as "Lv {0}". The translation files in js/lang are keyed by exactly these strings.
# Language files (js/lang/*) and the language code itself (i18n.js, settings.js) are skipped.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$skip = @('i18n.js', 'settings.js')
$rx = [regex]"'((?:[^'\\\r\n]|\\.)*)'|""((?:[^""\\\r\n]|\\.)*)""|``((?:[^``\\]|\\.)*)``"
function Unescape([string]$s) {
    $sb = New-Object System.Text.StringBuilder
    for ($i = 0; $i -lt $s.Length; $i++) {
        $c = $s[$i]
        if ($c -ne '\' -or $i -eq $s.Length - 1) { [void]$sb.Append($c); continue }
        $i++; $n = $s[$i]
        switch -CaseSensitive ($n) {
            'n' { [void]$sb.Append("`n") } 't' { [void]$sb.Append("`t") }
            'u' { [void]$sb.Append([char][Convert]::ToInt32($s.Substring($i + 1, 4), 16)); $i += 4 }
            'x' { [void]$sb.Append([char][Convert]::ToInt32($s.Substring($i + 1, 2), 16)); $i += 2 }
            default { [void]$sb.Append($n) }
        }
    }
    $sb.ToString()
}
# string literals of a JS source, skipping comments and regex literals (an apostrophe in a comment must not start a string)
function Literals([string]$src) {
    $out = New-Object System.Collections.ArrayList; $i = 0; $n = $src.Length; $prev = ''
    while ($i -lt $n) {
        $c = $src[$i]
        if ($c -eq '/' -and $i + 1 -lt $n -and $src[$i + 1] -eq '/') { $j = $src.IndexOf("`n", $i); if ($j -lt 0) { break }; $i = $j; continue }
        if ($c -eq '/' -and $i + 1 -lt $n -and $src[$i + 1] -eq '*') { $j = $src.IndexOf('*/', $i + 2); if ($j -lt 0) { break }; $i = $j + 2; continue }
        if ($c -eq '/' -and $prev -match '^[\(,=:\[!&|?{};]?$') {   # a regex literal can only start where an operand is expected
            $j = $i + 1; $cls = $false
            while ($j -lt $n -and $src[$j] -ne "`n") { $d = $src[$j]; if ($d -eq '\') { $j += 2; continue }; if ($d -eq '[') { $cls = $true } elseif ($d -eq ']') { $cls = $false } elseif ($d -eq '/' -and -not $cls) { break }; $j++ }
            if ($j -lt $n -and $src[$j] -eq '/') { $i = $j + 1; $prev = 'x'; continue }
        }
        if ($c -eq "'" -or $c -eq '"' -or $c -eq '`') {
            $j = $i + 1; $sb = New-Object System.Text.StringBuilder
            while ($j -lt $n -and $src[$j] -ne $c) { if ($src[$j] -eq '\' -and $j + 1 -lt $n) { [void]$sb.Append($src[$j]); $j++ }; if ($c -ne '`' -and $src[$j] -eq "`n") { break }; [void]$sb.Append($src[$j]); $j++ }
            [void]$out.Add(@{ raw = $sb.ToString(); tpl = ($c -eq '`') }); $i = $j + 1; $prev = 'x'; continue
        }
        if ($c -notmatch '\s') { $prev = [string]$c }
        $i++
    }
    $out
}
$seen = New-Object 'System.Collections.Generic.HashSet[string]'; $list = New-Object System.Collections.ArrayList
$order = @('data.js', 'data2.js', 'data3.js', 'ui.js', 'game.js', 'elements.js', 'heroes3.js', 'versus.js', 'zones.js', 'actors.js', 'enemies.js', 'core.js')
$files = Get-ChildItem (Join-Path $root 'js') -Filter *.js | Where-Object { $skip -notcontains $_.Name } | Sort-Object { $i = [array]::IndexOf($order, $_.Name); if ($i -lt 0) { 100 } else { $i } }, LastWriteTime
foreach ($f in $files) {
    $src = [System.IO.File]::ReadAllText($f.FullName)
    foreach ($lit in (Literals $src)) {
        $tpl = $lit.tpl; $raw = $lit.raw
        if ($tpl) { $k = 0; $raw = [regex]::Replace($raw, '\$\{[^}]*\}', { param($x) $script:k++; '{' + ($script:k - 1) + '}' }) }
        $s = Unescape $raw
        if ($s -notmatch '[A-Za-z]{2}') { continue }                                  # no words
        if ($s -cmatch '^[a-z0-9_.\-/:@#]*$') { continue }                             # ids, keys, paths
        if ($s -match '^#[0-9a-fA-F]{3,8}$') { continue }                             # colours
        if ($s -notmatch '\s' -and ($s -match '[_:@#/\\=]' -or $s -match '\d' -or $s -cmatch '^[a-z]+[A-Z]')) { continue }   # one-word ids
        if ($s -cmatch '^(Key|Digit|Numpad|Arrow)[A-Za-z0-9]+$') { continue }
        if ($s -match 'px |sans-serif|source-in|use strict|^(Enter|Escape|Space|Backspace|Shift|Tab)$') { continue }
        if ($s -match '^\s*(function|return|const|let|var)\b') { continue }
        if ($seen.Add($s)) { [void]$list.Add([ordered]@{ s = $s; f = $f.Name }) }
    }
}
$dir = Split-Path -Parent $Out; if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
$json = ConvertTo-Json -InputObject @($list) -Depth 3 -Compress
[System.IO.File]::WriteAllText($Out, $json, (New-Object System.Text.UTF8Encoding($false)))
$chars = 0; foreach ($e in $list) { $chars += $e.s.Length }
"wrote $($list.Count) strings ($chars characters) to $Out"
