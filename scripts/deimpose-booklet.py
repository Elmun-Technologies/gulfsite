#!/usr/bin/env python3
"""
BUKLET IMPOZITSIYASI → O'QISH TARTIBIDAGI PDF (flipbook uchun)
----------------------------------------------------------------
  python3 scripts/deimpose-booklet.py <impozitsiya.pdf> <natija.pdf>

Bosmaxona uchun tayyorlangan "buklet" PDF'da har varaq tomonida ikkita
sahifa yonma-yon va aralash tartibda turadi (skrepka tikish: 1-tomon
[N | 1], 2-tomon [2 | N-1], 3-tomon [N-2 | 3] ...). Bu skript ularni
o'qish tartibiga qaytaradi va UZ katalogi bilan bir xil shaklda yozadi:
muqova (yakka) · yoyilmalar [2|3] [4|5] ... · orqa muqova (yakka).
Natija `scripts/build-brochure.mjs` ga beriladi.

Talab: pypdf.
"""
import sys
from copy import copy

from pypdf import PageObject, PdfReader, PdfWriter, Transformation

src, out = sys.argv[1], sys.argv[2]
reader = PdfReader(src)
sides = len(reader.pages)
n = sides * 2  # buklet sahifalari soni
w = float(reader.pages[0].mediabox.width)
h = float(reader.pages[0].mediabox.height)
half = w / 2

# buklet sahifasi -> (PDF sahifasi indeksi, 0 = chap yarim / 1 = o'ng yarim)
where = {}
for k in range(1, sides + 1):
    if k % 2:  # old tomon: [N-(k-1) | k]
        left, right = n - (k - 1), k
    else:  # orqa tomon: [k | N-k+1]
        left, right = k, n - k + 1
    where[left] = (k - 1, 0)
    where[right] = (k - 1, 1)
assert sorted(where) == list(range(1, n + 1)), 'impozitsiya tartibi kutilganidek emas'

writer = PdfWriter()


def single(p):
    idx, side = where[p]
    page = copy(reader.pages[idx])
    x0 = side * half
    page.mediabox.lower_left = (x0, 0)
    page.mediabox.upper_right = (x0 + half, h)
    page.cropbox = page.mediabox
    writer.add_page(page)


def spread(a, b):
    blank = PageObject.create_blank_page(width=w, height=h)
    for slot, p in enumerate((a, b)):
        idx, side = where[p]
        part = copy(reader.pages[idx])
        x0 = side * half
        part.mediabox.lower_left = (x0, 0)
        part.mediabox.upper_right = (x0 + half, h)
        part.cropbox = part.mediabox
        blank.merge_transformed_page(part, Transformation().translate(slot * half - x0, 0), over=True, expand=False)
    writer.add_page(blank)


single(1)
for p in range(2, n, 2):
    spread(p, p + 1)
single(n)
writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
with open(out, 'wb') as f:
    writer.write(f)
print(f'{src}: {sides} tomon -> {n} sahifa -> {len(writer.pages)} varaq')
