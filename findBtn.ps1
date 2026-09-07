Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("Frontend\public\hero-cropped.png")
$bmp = new-object System.Drawing.Bitmap($img)
$orangeHits = @()
for ($y = 0; $y -lt $bmp.Height; $y+=10) {
    for ($x = 0; $x -lt $bmp.Width; $x+=10) {
        $pixel = $bmp.GetPixel($x, $y)
        # Search for orange #FF9933 or similar
        if ($pixel.R -gt 240 -and $pixel.G -gt 130 -and $pixel.G -lt 170 -and $pixel.B -lt 70) {
            $orangeHits += [PSCustomObject]@{X=$x; Y=$y}
        }
    }
}
if ($orangeHits.Count -gt 0) {
    $minX = ($orangeHits | Measure-Object -Property X -Minimum).Minimum
    $maxX = ($orangeHits | Measure-Object -Property X -Maximum).Maximum
    $minY = ($orangeHits | Measure-Object -Property Y -Minimum).Minimum
    $maxY = ($orangeHits | Measure-Object -Property Y -Maximum).Maximum
    Write-Host "Orange Button Bounds: X: $minX to $maxX, Y: $minY to $maxY"
    Write-Host "In Percentages: X: $([math]::Round($minX / $img.Width * 100))% to $([math]::Round($maxX / $img.Width * 100))%, Y: $([math]::Round($minY / $img.Height * 100))% to $([math]::Round($maxY / $img.Height * 100))%"
} else {
    Write-Host "Orange button not found"
}
$bmp.Dispose()
$img.Dispose()
