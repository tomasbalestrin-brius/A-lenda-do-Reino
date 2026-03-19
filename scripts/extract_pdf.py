import os
from PyPDF2 import PdfReader

pdf_path = "docs/T20 - Livro Básico.pdf"
out_path = "docs/T20_text.txt"

print(f"Lendo o arquivo: {pdf_path}")
reader = PdfReader(pdf_path)
page_count = len(reader.pages)
print(f"Número de páginas: {page_count}")

with open(out_path, "w", encoding="utf-8") as f:
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            f.write(text + "\n\n")
        if (i+1) % 50 == 0:
            print(f"Extraindo página {i+1} de {page_count}...")

print(f"Sucesso! {out_path} salvo.")
