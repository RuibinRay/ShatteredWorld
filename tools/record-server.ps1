param([int]$Port = 8793)
# Play-test recording server: serves the game like serve.ps1, and also accepts POST /__rec/<file name> and writes the body
# to ..\..\recordings\<file name> (next to the game folder, outside the repository). tools/autoplay.js uses it to save its
# gameplay videos (.webm) and difficulty logs (.json). Runs on its own port, so its saves and settings live apart from the
# ones the game keeps at localhost:8765.
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path (Split-Path -Parent $root) 'recordings'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $root at http://localhost:$Port/ ; recordings go to $out"
$types = @{ '.html' = 'text/html'; '.js' = 'application/javascript'; '.css' = 'text/css'; '.png' = 'image/png'; '.json' = 'application/json'; '.md' = 'text/plain'; '.webm' = 'video/webm'; '.mp4' = 'video/mp4' }
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
        $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
        if ($ctx.Request.HttpMethod -eq 'POST' -and $rel.StartsWith('__rec/')) {
            $name = $rel.Substring(6)
            if ($name -notmatch '^[A-Za-z0-9_.-]{1,80}$') { $ctx.Response.StatusCode = 400 }
            else {
                $fs = [System.IO.File]::Create((Join-Path $out $name))
                try { $ctx.Request.InputStream.CopyTo($fs) } finally { $fs.Close() }
                $ctx.Response.StatusCode = 200
            }
        } else {
            if ($rel -eq '') { $rel = 'index.html' }
            $path = [System.IO.Path]::GetFullPath((Join-Path $root $rel))
            if ($path.StartsWith($root) -and (Test-Path $path -PathType Leaf)) {
                $bytes = [System.IO.File]::ReadAllBytes($path)
                $ext = [System.IO.Path]::GetExtension($path).ToLower()
                $ctx.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
                $ctx.Response.Headers.Add('Cache-Control', 'no-store')
                $ctx.Response.ContentLength64 = $bytes.Length
                $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else { $ctx.Response.StatusCode = 404 }
        }
    } catch { $ctx.Response.StatusCode = 500 }
    $ctx.Response.Close()
}
