param([string[]]$Langs = @('es', 'zh'))
# Builds the game's language files js/lang/<id>.js from the translation work in tools/i18n:
#   glossary.json            { "English": { "es": "...", "zh": "..." } }       names, places, abilities, terms
#   src/chunk_NN.json        [ "English", ... ]                                  the text, in batches
#   out/chunk_NN.json        [ { "i": index, "es": "...", "zh": "..." } ]        the translations of each batch
#   extra.json (optional)    { "English": { "es": "...", "zh": "..." } }         later additions and fixes; wins over the rest
# Each output file is one call: SW.i18n.add('<id>', { "English": "translation", ... }); see js/i18n.js.
# Reports, per language, how many strings are translated and which batches have no translation yet.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot; $t = Join-Path $root 'tools\i18n'; $outDir = Join-Path $root 'js\lang'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force $outDir | Out-Null }
$utf8 = New-Object System.Text.UTF8Encoding($false)
function ReadJson($p) { [System.IO.File]::ReadAllText($p, $utf8) | ConvertFrom-Json }
Add-Type -AssemblyName System.Web.Extensions
$jss = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $jss.MaxJsonLength = [int]::MaxValue
function ReadMap($p) { $jss.DeserializeObject([System.IO.File]::ReadAllText($p, $utf8)) }   # keys are case-sensitive here (ConvertFrom-Json would merge Back/BACK)
function ReadList($p) { @((ReadJson $p) | ForEach-Object { $_ }) }   # PowerShell 5 returns a JSON array as one object
function Js([string]$s) {
    $sb = New-Object System.Text.StringBuilder; [void]$sb.Append('"')
    foreach ($c in $s.ToCharArray()) {
        switch ([int]$c) {
            34 { [void]$sb.Append('\"') } 92 { [void]$sb.Append('\\') } 10 { [void]$sb.Append('\n') } 13 { } 9 { [void]$sb.Append('\t') }
            0x2028 { [void]$sb.Append(' ') } 0x2029 { [void]$sb.Append(' ') }
            default { if ([int]$c -lt 32) { [void]$sb.Append(('\u{0:x4}' -f [int]$c)) } else { [void]$sb.Append($c) } }
        }
    }
    [void]$sb.Append('"'); $sb.ToString()
}
$maps = @{}; foreach ($l in $Langs) { $maps[$l] = New-Object 'System.Collections.Generic.Dictionary[string,string]' }
$all = New-Object 'System.Collections.Generic.HashSet[string]'
function Put($en, $obj) { foreach ($l in $Langs) { $v = if ($obj -is [System.Collections.IDictionary]) { $obj[$l] } else { $obj.$l }; if ($v -is [string] -and $v.Length) { $maps[$l][$en] = $v } } }
# glossary
$gp = Join-Path $t 'glossary.json'
if (Test-Path $gp) { $g = ReadMap $gp; foreach ($k in $g.Keys) { [void]$all.Add($k); Put $k $g[$k] } } else { 'no glossary.json yet' }
# batches
$missing = @()
foreach ($src in Get-ChildItem (Join-Path $t 'src') -Filter 'chunk_*.json' | Sort-Object Name) {
    $en = ReadList $src.FullName; foreach ($s in $en) { [void]$all.Add($s) }
    $parts = @(Get-ChildItem (Join-Path $t 'out') -Filter ($src.BaseName + '*.json') -ErrorAction SilentlyContinue | Sort-Object Name)   # chunk_NN.json, or chunk_NN.a.json + chunk_NN.b.json ...
    if (-not $parts.Count) { $missing += $src.BaseName; continue }
    $done = New-Object 'System.Collections.Generic.HashSet[int]'
    foreach ($op in $parts) { foreach ($e in (ReadList $op.FullName)) { $i = [int]$e.i; if ($i -ge 0 -and $i -lt $en.Count) { Put $en[$i] $e; [void]$done.Add($i) } } }
    $n = $done.Count
    if ($n -lt $en.Count) { "{0}: {1} of {2} translated" -f $src.BaseName, $n, $en.Count }
}
# later additions win
$xp = Join-Path $t 'extra.json'
if (Test-Path $xp) { $x = ReadMap $xp; foreach ($k in $x.Keys) { [void]$all.Add($k); Put $k $x[$k] } }
foreach ($l in $Langs) {
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine("'use strict';")
    [void]$sb.AppendLine("// Built by tools/i18n-build.ps1 from tools/i18n. Do not edit by hand: add fixes to tools/i18n/extra.json and rebuild.")
    [void]$sb.AppendLine("SW.i18n.add('$l', {")
    $keys = @($maps[$l].Keys); $k = 0
    foreach ($en in $keys) { $k++; [void]$sb.Append('  ' + (Js $en) + ': ' + (Js $maps[$l][$en])); if ($k -lt $keys.Count) { [void]$sb.AppendLine(',') } else { [void]$sb.AppendLine() } }
    [void]$sb.AppendLine('});')
    [System.IO.File]::WriteAllText((Join-Path $outDir "$l.js"), $sb.ToString(), $utf8)
    "{0}: {1} of {2} strings translated -> js/lang/{0}.js" -f $l, $maps[$l].Count, $all.Count
}
if ($missing.Count) { 'batches with no translation yet: ' + ($missing -join ', ') }
