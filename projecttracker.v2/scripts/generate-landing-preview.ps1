$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$width = 1800
$height = 1120
$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function ColorFromHex([string]$hex, [int]$alpha = 255) {
  $clean = $hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b)
}

function SolidBrush([string]$hex, [int]$alpha = 255) {
  return [System.Drawing.SolidBrush]::new((ColorFromHex $hex $alpha))
}

function PenFromHex([string]$hex, [float]$width = 1, [int]$alpha = 255) {
  return [System.Drawing.Pen]::new((ColorFromHex $hex $alpha), $width)
}

function New-RoundedRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRect($g, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-RoundedRect $x $y $w $h $r
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-RoundedRect($g, $pen, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-RoundedRect $x $y $w $h $r
  $g.DrawPath($pen, $path)
  $path.Dispose()
}

function Draw-Text($g, [string]$text, [string]$family, [float]$size, [System.Drawing.FontStyle]$style, [string]$color, [float]$x, [float]$y, [float]$w, [float]$h) {
  $font = [System.Drawing.Font]::new($family, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = SolidBrush $color
  $format = [System.Drawing.StringFormat]::new()
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap
  $g.DrawString($text, $font, $brush, ([System.Drawing.RectangleF]::new($x, $y, $w, $h)), $format)
  $format.Dispose()
  $brush.Dispose()
  $font.Dispose()
}

$background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  ([System.Drawing.Rectangle]::new(0, 0, $width, $height)),
  (ColorFromHex "#f8fafc"),
  (ColorFromHex "#dbeafe"),
  35
)
$graphics.FillRectangle($background, 0, 0, $width, $height)
$background.Dispose()

$gridPen = PenFromHex "#93a4b8" 1 42
for ($x = 0; $x -lt $width; $x += 80) {
  $graphics.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -lt $height; $y += 80) {
  $graphics.DrawLine($gridPen, 0, $y, $width, $y)
}
$gridPen.Dispose()

$shadow = SolidBrush "#020617" 36
Fill-RoundedRect $graphics $shadow 150 120 1500 870 34
$shadow.Dispose()

$window = SolidBrush "#ffffff" 246
Fill-RoundedRect $graphics $window 120 92 1500 870 34
$window.Dispose()

$borderPen = PenFromHex "#b6c2d1" 2 180
Draw-RoundedRect $graphics $borderPen 120 92 1500 870 34
$borderPen.Dispose()

$sidebar = SolidBrush "#07111f"
Fill-RoundedRect $graphics $sidebar 120 92 310 870 34
$sidebar.Dispose()
$sidebarEdge = SolidBrush "#07111f"
$graphics.FillRectangle($sidebarEdge, 400, 92, 60, 870)
$sidebarEdge.Dispose()

Draw-Text $graphics "PT" "Segoe UI" 34 ([System.Drawing.FontStyle]::Bold) "#07111f" 178 142 60 50
$logoBrush = SolidBrush "#5eead4"
Fill-RoundedRect $graphics $logoBrush 166 132 84 72 14
$logoBrush.Dispose()
Draw-Text $graphics "PT" "Segoe UI" 34 ([System.Drawing.FontStyle]::Bold) "#07111f" 183 146 70 46
Draw-Text $graphics "ProjectTracker" "Segoe UI" 22 ([System.Drawing.FontStyle]::Bold) "#ffffff" 270 136 180 34
Draw-Text $graphics "Operations Hub" "Segoe UI" 18 ([System.Drawing.FontStyle]::Regular) "#94a3b8" 272 170 150 32

$navItems = @("Dashboard", "PNRR", "Fondul de Modernizare", "Setari")
$navY = 260
foreach ($item in $navItems) {
  $active = $item -eq "Dashboard"
  $navBrush = SolidBrush ($(if ($active) { "#12344a" } else { "#07111f" })) ($(if ($active) { 255 } else { 1 }))
  Fill-RoundedRect $graphics $navBrush 165 $navY 220 54 12
  $navBrush.Dispose()
  Draw-Text $graphics $item "Segoe UI" 21 ([System.Drawing.FontStyle]::Bold) ($(if ($active) { "#e0f2fe" } else { "#94a3b8" })) 190 ($navY + 13) 210 32
  $navY += 74
}

Draw-Text $graphics "Dashboard general" "Segoe UI" 42 ([System.Drawing.FontStyle]::Bold) "#0f172a" 500 142 500 60
Draw-Text $graphics "PNRR, REPowerEU si Fondul de Modernizare intr-o singura vedere." "Segoe UI" 24 ([System.Drawing.FontStyle]::Regular) "#64748b" 503 198 780 42

$pill = SolidBrush "#dcfce7"
Fill-RoundedRect $graphics $pill 1290 145 230 48 24
$pill.Dispose()
Draw-Text $graphics "Portofoliu stabil" "Segoe UI" 22 ([System.Drawing.FontStyle]::Bold) "#166534" 1320 156 190 32

$cardData = @(
  @("Proiecte active", "18", "#e0f2fe", "#0369a1"),
  @("Clarificari", "42", "#fef3c7", "#b45309"),
  @("Risc urgent", "7", "#ffe4e6", "#be123c"),
  @("AA restante", "5", "#ccfbf1", "#0f766e")
)
$cardX = 500
foreach ($card in $cardData) {
  $cardBrush = SolidBrush "#ffffff"
  Fill-RoundedRect $graphics $cardBrush $cardX 280 240 150 18
  $cardBrush.Dispose()
  $cardPen = PenFromHex "#d8e0ea" 2 210
  Draw-RoundedRect $graphics $cardPen $cardX 280 240 150 18
  $cardPen.Dispose()
  $tone = SolidBrush $card[2]
  Fill-RoundedRect $graphics $tone ($cardX + 24) 304 52 52 14
  $tone.Dispose()
  Draw-Text $graphics $card[0] "Segoe UI" 18 ([System.Drawing.FontStyle]::Bold) "#64748b" ($cardX + 24) 372 180 28
  Draw-Text $graphics $card[1] "Segoe UI" 44 ([System.Drawing.FontStyle]::Bold) "#0f172a" ($cardX + 24) 318 100 58
  $cardX += 270
}

$mainPanel = SolidBrush "#ffffff"
Fill-RoundedRect $graphics $mainPanel 500 475 680 390 20
$mainPanel.Dispose()
$panelPen = PenFromHex "#d8e0ea" 2 210
Draw-RoundedRect $graphics $panelPen 500 475 680 390 20
$panelPen.Dispose()
Draw-Text $graphics "Health proiecte" "Segoe UI" 28 ([System.Drawing.FontStyle]::Bold) "#0f172a" 530 505 300 44

$rows = @(
  @("UAT Alba", "PNRR", "78%", "#16a34a"),
  @("UAT Arges", "FM", "52%", "#d97706"),
  @("UAT Cluj", "PNRR", "91%", "#16a34a"),
  @("UAT Timis", "FM", "33%", "#dc2626")
)
$rowY = 575
foreach ($row in $rows) {
  $rowBrush = SolidBrush "#f8fafc"
  Fill-RoundedRect $graphics $rowBrush 530 $rowY 610 54 12
  $rowBrush.Dispose()
  Draw-Text $graphics $row[0] "Segoe UI" 20 ([System.Drawing.FontStyle]::Bold) "#0f172a" 555 ($rowY + 15) 180 28
  Draw-Text $graphics $row[1] "Segoe UI" 18 ([System.Drawing.FontStyle]::Bold) "#64748b" 765 ($rowY + 16) 80 28
  $track = SolidBrush "#e2e8f0"
  Fill-RoundedRect $graphics $track 880 ($rowY + 18) 160 16 8
  $track.Dispose()
  $fill = SolidBrush $row[3]
  $fillWidth = [int](160 * ([int]$row[2].TrimEnd("%") / 100))
  Fill-RoundedRect $graphics $fill 880 ($rowY + 18) $fillWidth 16 8
  $fill.Dispose()
  Draw-Text $graphics $row[2] "Segoe UI" 18 ([System.Drawing.FontStyle]::Bold) "#0f172a" 1065 ($rowY + 15) 60 28
  $rowY += 68
}

$sidePanel = SolidBrush "#07111f"
Fill-RoundedRect $graphics $sidePanel 1220 475 300 390 20
$sidePanel.Dispose()
Draw-Text $graphics "Termene critice" "Segoe UI" 28 ([System.Drawing.FontStyle]::Bold) "#ffffff" 1250 510 240 42
Draw-Text $graphics "Urmatoarele actiuni" "Segoe UI" 20 ([System.Drawing.FontStyle]::Regular) "#94a3b8" 1252 552 220 32

$timelineY = 620
foreach ($label in @("Clarificare RUE", "Cerere finala", "Act aditional")) {
  $dot = SolidBrush "#5eead4"
  Fill-RoundedRect $graphics $dot 1255 ($timelineY + 6) 18 18 9
  $dot.Dispose()
  Draw-Text $graphics $label "Segoe UI" 20 ([System.Drawing.FontStyle]::Bold) "#e2e8f0" 1290 $timelineY 190 30
  Draw-Text $graphics "necesita verificare" "Segoe UI" 17 ([System.Drawing.FontStyle]::Regular) "#94a3b8" 1290 ($timelineY + 28) 190 26
  $timelineY += 78
}

$output = Join-Path $PSScriptRoot "..\public\landing\projecttracker-product-preview.png"
$directory = Split-Path $output
New-Item -ItemType Directory -Force -Path $directory | Out-Null
$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Generated $output"
