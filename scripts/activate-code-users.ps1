param(
  [string]$RosterPath = (Join-Path $PSScriptRoot '..\student-roster.csv'),
  [switch]$IncludeAll
)

$ErrorActionPreference = 'Stop'
$projectUrl = $env:VALLE_SUPABASE_URL
$serviceKey = $env:VALLE_SUPABASE_SERVICE_ROLE_KEY
if ([string]::IsNullOrWhiteSpace($projectUrl) -or [string]::IsNullOrWhiteSpace($serviceKey)) {
  throw 'Faltan VALLE_SUPABASE_URL y VALLE_SUPABASE_SERVICE_ROLE_KEY en esta terminal.'
}

$headers = @{ apikey = $serviceKey; Authorization = "Bearer $serviceKey"; 'Content-Type' = 'application/json' }
$rows = Import-Csv -LiteralPath $RosterPath
$targets = $rows | Where-Object {
  $_.status -eq 'pending' -and $_.access_code -match '^\d{6}$' -and ($IncludeAll -or $_.course -eq 'PRUEBA')
}

foreach ($row in $targets) {
  $body = @{
    email = "$($row.access_code)@estudiantes.valle-esmeralda.invalid"
    password = $row.access_code
    email_confirm = $true
    user_metadata = @{
      first_name = $row.full_name
      last_name = ''
      course = $row.course
      roster_number = $row.number
    }
  } | ConvertTo-Json -Depth 4

  try {
    Invoke-RestMethod -Method Post -Uri "$projectUrl/auth/v1/admin/users" -Headers $headers -Body $body | Out-Null
    $row.status = 'active'
    Write-Host "ACTIVO: $($row.full_name)"
  } catch {
    Write-Warning "NO CREADO: $($row.full_name) — $($_.Exception.Message)"
  }
}

$rows | Export-Csv -LiteralPath $RosterPath -NoTypeInformation -Encoding utf8
