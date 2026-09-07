Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("Frontend\public\hero-mockup.png")
$bmp = new-object System.Drawing.Bitmap($img)
$orangeHits = @()
$blueHits = @()
for ($y = 0; $y -lt $bmp.Height; $y+=5) {
    for ($x = 0; $x -lt $bmp.Width; $x+=5) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -gt 240 -and $pixel.G -gt 130 -and $pixel.G -lt 170 -and $pixel.B -lt 70) {
            $orangeHits += [PSCustomObject]@{X=$x; Y=$y}
        }
        if ($pixel.R -lt 20 -and $pixel.G -lt 60 -and $pixel.G -gt 30 -and $pixel.B -gt 70 -and $pixel.B -lt 120) {
            $blueHits += [PSCustomObject]@{X=$x; Y=$y}
        }
    }
}
if ($orangeHits.Count -gt 0) {
    $minX = ($orangeHits | Measure-Object -Property X -Minimum).Minimum
    $maxX = ($orangeHits | Measure-Object -Property X -Maximum).Maximum
    $minY = ($orangeHits | Measure-Object -Property Y -Minimum).Minimum
    $maxY = ($orangeHits | Measure-Object -Property Y -Maximum).Maximum
    Write-Host "Orange Btn: X $minX-$maxX, Y $minY-$maxY. Percent: L $([math]::Round($minX / $img.Width * 100, 1))%, T $([math]::Round($minY / $img.Height * 100, 1))%, W $([math]::Round(($maxX - $minX) / $img.Width * 100, 1))%, H $([math]::Round(($maxY - $minY) / $img.Height * 100, 1))%"
}
if ($blueHits.Count -gt 0) {
    $minX = ($blueHits | Measure-Object -Property X -Minimum).Minimum
    $maxX = ($blueHits | Measure-Object -Property X -Maximum).Maximum
    $minY = ($blueHits | Measure-Object -Property Y -Minimum).Minimum
    $maxY = ($blueHits | Measure-Object -Property Y -Maximum).Maximum
    Write-Host "Blue Btn: X $minX-$maxX, Y $minY-$maxY. Percent: L $([math]::Round($minX / $img.Width * 100, 1))%, T $([math]::Round($minY / $img.Height * 100, 1))%, W $([math]::Round(($maxX - $minX) / $img.Width * 100, 1))%, H $([math]::Round(($maxY - $minY) / $img.Height * 100, 1))%"
}
$bmp.Dispose()
$img.Dispose()
