Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("Frontend\public\hero-bg.png")
$cropArea = New-Object System.Drawing.Rectangle(0, 0, $img.Width, 900)
$bitmap = New-Object System.Drawing.Bitmap($cropArea.Width, $cropArea.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $bitmap.Width, $bitmap.Height)), $cropArea, [System.Drawing.GraphicsUnit]::Pixel)
$bitmap.Save("Frontend\public\hero-cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$img.Dispose()
Write-Host "Cropped successfully"
