# 이 폴더의 소스 코드(빌드 전 원본)를 http://localhost:8200 으로 서빙하는 간단한
# 로컬 서버. node/npm이 없는 PC(예: 학교 PC)에서도 게임을 "수정 -> 새로고침"으로
# 바로 확인할 수 있도록, Vite 개발 서버 대신 PowerShell 내장 HttpListener로
# 정적 파일만 서빙한다. dist(빌드 결과물)를 보는 serve.ps1과 달리 이 스크립트는
# 이 PC에 있는 그대로의 소스를 보여주므로, 방금 고친 내용이 즉시 반영된다.
#
# 단, 허브/게임 페이지의 CSS는 <link> 태그로, Phaser는 vendor/ 폴더의 로컬
# 스크립트로 불러오도록 되어 있어야 이 방식이 동작한다 (npm 패키지를 import하는
# 코드는 번들러 없이는 브라우저가 직접 읽을 수 없다).
$port = 8200
$root = $PSScriptRoot

# "localhost" 전용 바인딩은 같은 PC에서만 접속된다. 같은 와이파이의 휴대폰/태블릿에서도
# 열어보려면 "+"(모든 주소)로 바인딩해야 하는데, 이건 Windows 정책상 관리자 권한으로
# 실행하거나 아래 urlacl을 미리 등록해둬야 한다(관리자 PowerShell에서 한 번만: 이 줄
# 그대로 복사해서 실행
#   netsh http add urlacl url=http://+:8200/ user=Everyone
# ). 등록해두면 이후엔 이 스크립트를 관리자 권한 없이 실행해도 "+"바인딩이 된다.
# 실패하면(둘 다 준비 안 된 경우) localhost 전용으로 자동 대체된다 — 이 PC에서 여는 건 계속 된다.
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")
$lanMode = $true
try {
    $listener.Start()
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $lanMode = $false
    try {
        $listener.Start()
    } catch {
        Write-Output "서버를 시작하지 못했습니다. 이미 실행 중인지 확인해주세요: http://localhost:$port/"
        Read-Host "엔터를 누르면 창이 닫힙니다"
        exit
    }
}

Write-Output "로컬 서버 시작: http://localhost:$port/  (서빙 대상: 소스 코드 원본, 빌드 아님)"
if ($lanMode) {
    $lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1 -ExpandProperty IPAddress)
    if ($lanIp) {
        Write-Output "같은 와이파이의 태블릿/휴대폰에서: http://${lanIp}:$port/  (처음 실행 시 방화벽 허용 창이 뜨면 '허용' 클릭)"
    }
} else {
    Write-Output "(휴대폰 접속을 켜려면 관리자 PowerShell에서 한 번만: netsh http add urlacl url=http://+:8200/ user=Everyone 실행 후 이 스크립트를 다시 켜보세요)"
}
Write-Output "(이 창을 닫으면 서버가 멈춥니다. 종료하려면 Ctrl+C)"

$mime = @{
    '.html'  = 'text/html; charset=utf-8'
    '.js'    = 'application/javascript; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.ttf'   = 'font/ttf'
    '.otf'   = 'font/otf'
    '.woff'  = 'font/woff'
    '.woff2' = 'font/woff2'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.svg'   = 'image/svg+xml'
}

# 요청 하나를 처리하는 로직. RunspacePool의 워커들이 각자 이 스크립트를 병렬로 실행한다.
$handleRequest = {
    param($context, $root, $mime)
    $req = $context.Request
    $res = $context.Response
    try {
        $relPath = [Uri]::UnescapeDataString($req.Url.LocalPath.TrimStart('/'))
        if ($relPath -eq '') { $relPath = 'index.html' }
        $filePath = Join-Path $root $relPath

        # node_modules 등 소스 저장소의 다른 폴더는 서빙 대상에서 제외 (필요도 없고,
        # 실수로 큰 폴더를 통째로 웹에 노출하지 않기 위한 안전장치).
        $resolvedRoot = (Resolve-Path $root).Path
        $resolvedFile = $null
        if (Test-Path $filePath -PathType Leaf) {
            $resolvedFile = (Resolve-Path $filePath).Path
        }

        if ($resolvedFile -and $resolvedFile.StartsWith($resolvedRoot) -and $relPath -notmatch '^(node_modules|dist|dist-local|\.git)([\\/]|$)') {
            $bytes = [System.IO.File]::ReadAllBytes($resolvedFile)
            $ext = [System.IO.Path]::GetExtension($resolvedFile)
            $contentType = $mime[$ext]
            if (-not $contentType) { $contentType = 'application/octet-stream' }
            $res.ContentType = $contentType
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
        }
    } finally {
        $res.OutputStream.Close()
    }
}

$runspacePool = [runspacefactory]::CreateRunspacePool(1, 8)
$runspacePool.Open()
$pending = New-Object System.Collections.ArrayList

while ($listener.IsListening) {
    $context = $listener.GetContext()

    $ps = [powershell]::Create()
    $ps.RunspacePool = $runspacePool
    [void]$ps.AddScript($handleRequest).AddArgument($context).AddArgument($root).AddArgument($mime)
    $handle = $ps.BeginInvoke()
    [void]$pending.Add(@{ Ps = $ps; Handle = $handle })

    for ($i = $pending.Count - 1; $i -ge 0; $i--) {
        if ($pending[$i].Handle.IsCompleted) {
            try { $pending[$i].Ps.EndInvoke($pending[$i].Handle) } catch {}
            $pending[$i].Ps.Dispose()
            $pending.RemoveAt($i)
        }
    }
}
