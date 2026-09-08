"""Owner-approved alpha-only masking of the supplied product illustration.

No generation, RGB alteration, screen replacement, resizing or retouching.
The manually measured paths describe only the three original outer silhouettes.
Run from the repository with Pillow and NumPy; output is a versioned sibling.
"""
from pathlib import Path
from hashlib import sha256
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'deployment/v1/danzuni-devices-642dba75.png'
EXPECTED = '642dba7579308024cf07e22a6ad4b710e4f139eb34b9eb57eef1dad62b637990'
assert sha256(SOURCE.read_bytes()).hexdigest() == EXPECTED, 'Review changed source'
original = Image.open(SOURCE).convert('RGB')
assert original.size == (1474, 1067)
SCALE = 4
mask = Image.new('L', (original.width * SCALE, original.height * SCALE), 0)
draw = ImageDraw.Draw(mask)

def silhouette(start, commands):
    points = [start]
    current = start
    for command in commands:
        if len(command) == 2:
            current = command
            points.append(current)
        else:
            x0, y0 = current
            x1, y1, x2, y2, x3, y3 = command
            for t in np.linspace(0, 1, 40)[1:]:
                u = 1 - t
                points.append((u**3*x0+3*u*u*t*x1+3*u*t*t*x2+t**3*x3,
                               u**3*y0+3*u*u*t*y1+3*u*t*t*y2+t**3*y3))
            current = (x3, y3)
    draw.polygon([(round(x*SCALE), round(y*SCALE)) for x, y in points], fill=255)

# Laptop: preserve the silver rim, lid and visible base, not the old floor shadow.
silhouette((102, 46), [
    (1291, 46), (1315, 46, 1331, 64, 1331, 88),
    (1331, 847), (1355, 847), (1355, 867),
    (1348, 877, 1325, 881, 1304, 881), (87, 881),
    (67, 881, 45, 877, 38, 868), (38, 847), (63, 847),
    (63, 88), (63, 64, 79, 46, 102, 46),
])
# Tablet in the foreground.
silhouette((411, 455), [
    (1046, 455), (1072, 455, 1091, 473, 1091, 498),
    (1091, 968), (1091, 991, 1073, 1007, 1047, 1007),
    (411, 1007), (385, 1007, 367, 992, 367, 968),
    (367, 498), (367, 473, 384, 455, 411, 455),
])
# Phone: its white body remains opaque, including the space around the notch.
silhouette((1195, 442), [
    (1388, 442), (1419, 442, 1443, 465, 1443, 496),
    (1443, 975), (1443, 1003, 1424, 1022, 1395, 1022),
    (1193, 1022), (1164, 1022, 1143, 1003, 1143, 975),
    (1143, 496), (1143, 466, 1166, 442, 1195, 442),
])

mask = mask.resize(original.size, Image.Resampling.LANCZOS)
result = original.convert('RGBA')
result.putalpha(mask)
assert np.array_equal(np.asarray(result)[:, :, :3], np.asarray(original)), 'RGB drift'
alpha = np.asarray(mask)
assert alpha[0, 0] == 0 and np.count_nonzero(alpha == 0) > 100_000
assert np.all(alpha[100:435, 100:1295] == 255), 'Desktop screen is not opaque'
assert np.all(alpha[505:980, 403:1054] == 255), 'Tablet screen is not opaque'
assert np.all(alpha[499:980, 1166:1418] == 255), 'Phone screen is not opaque'

output = ROOT / 'deployment/v1/danzuni-devices-isolated.png'
result.save(output, optimize=True)
digest = sha256(output.read_bytes()).hexdigest()
report = {
    'source_sha256': EXPECTED, 'output_sha256': digest,
    'size': original.size, 'mode': result.mode,
    'rgb_changed_pixels': 0,
    'transparent_pixels': int(np.count_nonzero(alpha == 0)),
    'opaque_pixels': int(np.count_nonzero(alpha == 255)),
    'partial_alpha_pixels': int(np.count_nonzero((alpha > 0) & (alpha < 255))),
    'scope': 'Only alpha edited; static contour shadow is added by CSS.',
}
qa = ROOT / 'docs/product-isolation-20260909'
qa.mkdir(parents=True, exist_ok=True)
(qa / 'mask-report.json').write_text(json.dumps(report, indent=2)+'\n', encoding='utf8')

# Readable equal-size before/after comparison; originals remain untouched.
thumbsize = (737, 534)
sheet = Image.new('RGB', (1514, 1170), '#f2f2f7')
label = ImageDraw.Draw(sheet)
label.text((20, 12), 'SOURCE: original white canvas', fill='#242428')
label.text((777, 12), 'ALPHA CUTOUT: RGB pixels unchanged', fill='#242428')
sheet.paste(original.resize(thumbsize, Image.Resampling.LANCZOS), (20, 40))
light = Image.new('RGBA', original.size, '#f2f2f7')
light.alpha_composite(result)
sheet.paste(light.convert('RGB').resize(thumbsize, Image.Resampling.LANCZOS), (777, 40))
dark = Image.new('RGBA', original.size, '#242428')
dark.alpha_composite(result)
sheet.paste(dark.convert('RGB').resize(thumbsize, Image.Resampling.LANCZOS), (777, 614))
label.text((20, 610), 'Dark background reveals mask errors; not proposed site background.', fill='#242428')
sheet.save(qa / 'asset-comparison.png')
details = Image.new('RGB', (660, 570), '#f2f2f7')
detail_draw = ImageDraw.Draw(details)
for index, (name, box) in enumerate([
    ('Laptop rim', (40, 30, 260, 180)),
    ('Tablet lower left', (340, 890, 560, 1040)),
    ('Phone upper right', (1240, 425, 1460, 575)),
]):
    y = index * 190
    detail_draw.text((10, y+4), name + ': original | alpha on pale | alpha on dark', fill='#242428')
    for column, image in enumerate([original, light.convert('RGB'), dark.convert('RGB')]):
        details.paste(image.crop(box), (column*220, y+28))
details.save(qa / 'edge-details.png')
print(json.dumps(report, indent=2))
