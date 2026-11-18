#!/bin/sh
# Joins the clips tools/hardcore-reel.js saved (recordings/reel_<n>_<part>.raw, RGBA 480x270, 30 fps) into
# recordings/<name>.mp4 (1080p, nearest-neighbour) and a contact sheet of each clip's key moment
# (recordings/<name>_sheet.png). Run with: sh tools/hardcore-reel.sh [name]   (name: nightmare_reel if left out)
R="$(cd "$(dirname "$0")/../.." && pwd)/recordings"; OUT="${1:-nightmare_reel}"
cd "$R" || exit 1
rm -f reel_list.txt reel_key_*.png
for n in $(ls reel_*_*.raw | sed 's/reel_\([0-9]*\)_.*/\1/' | sort -u); do
  cat reel_"$n"_*.raw > reel_"$n".rgba
  ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 480x270 -r 30 -i reel_"$n".rgba -vf "scale=1920:1080:flags=neighbor" -c:v libx264 -crf 17 -preset fast -pix_fmt yuv420p reel_"$n".mp4
  ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 480x270 -r 30 -i reel_"$n".rgba -vf "select=eq(n\,58)" -frames:v 1 reel_key_"$n".png
  rm -f reel_"$n".rgba
  echo "file 'reel_$n.mp4'" >> reel_list.txt
done
ffmpeg -v error -y -f concat -safe 0 -i reel_list.txt -c copy "$OUT".mp4
ffmpeg -v error -y -pattern_type sequence -start_number 0 -i reel_key_%02d.png -vf "tile=4x5:padding=4:color=black" -frames:v 1 "$OUT"_sheet.png 2>/dev/null || true
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT".mp4
