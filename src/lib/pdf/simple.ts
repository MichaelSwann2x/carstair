/** Minimal single-page PDF generator (no deps) for RTS packages */

function escapePdf(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function textToPdf(title: string, lines: string[]): Blob {
  const contentLines = [title, "", ...lines].slice(0, 45);
  let y = 800;
  const ops: string[] = ["BT", "/F1 11 Tf", "14 TL", `50 ${y} Td"`];
  // rebuild properly
  const streamParts: string[] = ["BT", "/F1 10 Tf"];
  y = 800;
  for (const line of contentLines) {
    streamParts.push(`1 0 0 1 50 ${y} Tm`, `(${escapePdf(line.slice(0, 90))}) Tj`);
    y -= 14;
    if (y < 50) break;
  }
  streamParts.push("ET");
  const stream = streamParts.join("\n");
  const objects: string[] = [];
  objects.push("1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj");
  objects.push("2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj");
  objects.push(
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj"
  );
  objects.push(`4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`);
  objects.push("5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
