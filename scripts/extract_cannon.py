from collections import deque
from pathlib import Path

from PIL import Image


root = Path(__file__).resolve().parents[1]
source = Image.open(root / "public/art/workshop-cannon.png").convert("RGB")
width, height = source.size
pixels = source.load()
background = bytearray(width * height)
queue = deque()


def looks_like_checker(x, y):
    red, green, blue = pixels[x, y]
    return min(red, green, blue) >= 205 and max(red, green, blue) - min(red, green, blue) <= 8


for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

while queue:
    x, y = queue.popleft()
    index = y * width + x
    if background[index] or not looks_like_checker(x, y):
        continue
    background[index] = 1
    if x:
        queue.append((x - 1, y))
    if x + 1 < width:
        queue.append((x + 1, y))
    if y:
        queue.append((x, y - 1))
    if y + 1 < height:
        queue.append((x, y + 1))

sprite = source.convert("RGBA")
alpha = Image.new("L", source.size, 255)
alpha.putdata([0 if value else 255 for value in background])
sprite.putalpha(alpha)
box = alpha.getbbox()
padding = 18
box = (
    max(0, box[0] - padding),
    max(0, box[1] - padding),
    min(width, box[2] + padding),
    min(height, box[3] + padding),
)
sprite.crop(box).save(root / "public/art/cannon-transparent.png")
