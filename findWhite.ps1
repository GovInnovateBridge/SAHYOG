Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("Frontend\public\hero-bg.png")
$bmp = new-object System.Drawing.Bitmap($img)
# Find the first completely white row after Y=500
$whiteRow = -1
for ($y = 500; $y -lt 1000; $y++) {
    $isWhite = $true
    for ($x = 100; $x -lt $bmp.Width - 100; $x+=50) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250) {
            $isWhite = $false
            break
        }
    }
    if ($isWhite) {
        $whiteRow = $y
        break
    }
}
Write-Host "White row starts at: $whiteRow"
$bmp.Dispose()
$img.Dispose()
