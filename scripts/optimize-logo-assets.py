#!/usr/bin/env python3
"""Generate a small high-quality WebP derivative for tiny on-page brand marks.

The original logo.jpeg remains unchanged and continues to be used for large previews.
At current on-page sizes (44px or smaller), a 128px image retains ample resolution.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
source = ROOT / "logo.jpeg"
target = ROOT / "logo-small.webp"

with Image.open(source) as original:
    image = original.convert("RGB")
    image.thumbnail((128, 128), Image.Resampling.LANCZOS)
    image.save(target, format="WEBP", quality=92, method=6)
    print(f"Generated {target.name}: {original.size[0]}x{original.size[1]} -> {image.size[0]}x{image.size[1]}, {target.stat().st_size} bytes")
