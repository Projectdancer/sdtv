"""Make labelled QA contact sheets only; never change source/site artwork."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

folder = Path(sys.argv[1])
for name, left, right in [
    ('comparison-desktop', 'source-desktop.png', 'local-desktop-fixed.png'),
    ('comparison-mobile', 'source-mobile.png', 'local-mobile.png'),
]:
    source, implementation = [Image.open(folder / path).convert('RGB') for path in (left, right)]
    if source.size != implementation.size:
        raise ValueError(f'{name}: mismatched captures {source.size} vs {implementation.size}')
    w, h = source.size
    sheet = Image.new('RGB', (w * 2, h + 32), 'white')
    ImageDraw.Draw(sheet).text((12, 8), 'SOURCE: go.socialdancetv.com', fill='black')
    ImageDraw.Draw(sheet).text((w + 12, 8), 'DANZUNI COPY', fill='black')
    sheet.paste(source, (0, 32))
    sheet.paste(implementation, (w, 32))
    sheet.save(folder / f'{name}.png')
    if name.endswith('desktop'):
        focus = Image.new('RGB', (1200, 490), 'white')
        focus.paste(source.crop((0, 150, 600, 640)), (0, 0))
        focus.paste(implementation.crop((0, 150, 600, 640)), (600, 0))
        focus.save(folder / 'comparison-hero-detail.png')
    print(name, source.size, '1:1 equal raster comparison')
