$url = "https://my-portfolio-kappa-teal-10.vercel.app/api/chat"
$body = '{"messages":[{"role":"user","parts":[{"text":"hello"}]}]}'

try {
    $response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
            $reader = New-Object IO.StreamReader($stream)
            Write-Host "Error Body: $($reader.ReadToEnd())"
        }
    }
}