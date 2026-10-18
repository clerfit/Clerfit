#!/usr/bin/env python3
"""Regenerate logo-small.webp from the unchanged full-resolution brand source.

Requires Pillow (pip install Pillow). This keeps the visible branding consistent while
serving a 128x128 high-quality WebP to UI elements that render at 44px or less.
The original logo.jpeg and logo.png remain unchanged for full-resolution uses and social previews.
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
print(f"Generated {target.name} ({target.stat().st_size} bytes) from {source.name}.")
