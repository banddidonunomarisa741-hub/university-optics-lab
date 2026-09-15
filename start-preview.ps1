param([switch]$NoOpen, [int]$Port = 0)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = (Get-Command node -ErrorAction Stop).Source
$logDir = Join-Path $root 'output'; $log = Join-Path $logDir 'preview.log'; $err = Join-Path $logDir 'preview-error.log'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$preferred = if ($Port -gt 0) { $Port } else { 18765 }
try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:$preferred/health" -TimeoutSec 1
  if ($health.app -eq 'university-physics-optics-course') {
    $url = "http://127.0.0.1:$preferred/"; if (-not $NoOpen) { Start-Process $url }
    Write-Output "Optics course preview: $url"; exit 0
  }
} catch { }
$env:OPTICS_PORT = [string]$preferred
$serve = Join-Path $root 'serve.cjs'
# Start-Process joins ArgumentList into one command line, so quote paths with spaces explicitly.
$proc = Start-Process -FilePath $node -ArgumentList @('"' + $serve + '"') -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError $err -PassThru
$url = $null
for ($i = 0; $i -lt 50 -and -not $url; $i++) {
  Start-Sleep -Milliseconds 100
  if ($proc.HasExited) { throw "Preview server exited. See $err" }
  if (Test-Path $log) {
    $match = Select-String -Path $log -Pattern 'Optics course preview: (http://127\.0\.0\.1:\d+/)' | Select-Object -Last 1
    if ($match) { $url = $match.Matches[0].Groups[1].Value }
  }
}
if (-not $url) { throw "Preview server did not announce a URL within 5 seconds. See $log" }
if (-not $NoOpen) { Start-Process $url }
Write-Output "Optics course preview: $url"; Write-Output "Server PID: $($proc.Id) (hidden background process)"
