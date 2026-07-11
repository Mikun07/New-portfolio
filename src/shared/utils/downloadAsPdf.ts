export async function downloadAsPdf(url: string, filename: string): Promise<void> {
  const [{ marked }, { default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('marked'),
    import('jspdf'),
    import('html2canvas'),
  ])

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  const md = await res.text()
  const html = await marked(md)

  const container = document.createElement('div')
  container.style.cssText = [
    'position:fixed',
    'left:-9999px',
    'top:0',
    'width:794px',        // A4 at 96dpi
    'padding:48px 56px',
    'background:#ffffff',
    'color:#1a1a1a',
    'font-family:Georgia,serif',
    'font-size:14px',
    'line-height:1.7',
    'box-sizing:border-box',
  ].join(';')
  container.innerHTML = html

  // Minimal inline styles so headings/code render well without external CSS
  const style = document.createElement('style')
  style.textContent = `
    h1{font-size:24px;font-weight:700;margin:0 0 16px;border-bottom:2px solid #e5e5e5;padding-bottom:8px}
    h2{font-size:20px;font-weight:700;margin:24px 0 12px;border-bottom:1px solid #e5e5e5;padding-bottom:6px}
    h3{font-size:16px;font-weight:700;margin:20px 0 8px}
    h4,h5,h6{font-size:14px;font-weight:700;margin:16px 0 6px}
    p{margin:0 0 12px}
    ul,ol{margin:0 0 12px;padding-left:24px}
    li{margin-bottom:4px}
    code{background:#f4f4f4;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:12px}
    pre{background:#f4f4f4;border-radius:6px;padding:12px 16px;overflow:hidden;margin:0 0 12px}
    pre code{background:none;padding:0}
    blockquote{border-left:4px solid #d0d0d0;margin:0 0 12px;padding:4px 16px;color:#555}
    table{border-collapse:collapse;width:100%;margin:0 0 12px;font-size:13px}
    th,td{border:1px solid #d0d0d0;padding:6px 10px;text-align:left}
    th{background:#f4f4f4;font-weight:700}
    hr{border:none;border-top:1px solid #e5e5e5;margin:16px 0}
    a{color:#0066cc}
  `
  container.prepend(style)
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    })

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW
    const imgH = (canvas.height * imgW) / canvas.width
    const margin = 0

    let y = margin
    let remaining = imgH

    while (remaining > 0) {
      const sliceH = Math.min(remaining, pageH - margin * 2)
      const srcY = (imgH - remaining) * (canvas.height / imgH)
      const srcH = sliceH * (canvas.height / imgH)

      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = srcH
      const ctx = sliceCanvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas 2d context')
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

      const sliceData = sliceCanvas.toDataURL('image/png')
      if (y > margin) pdf.addPage()
      pdf.addImage(sliceData, 'PNG', margin, margin, imgW - margin * 2, sliceH)

      remaining -= sliceH
      y += sliceH
    }

    pdf.save(`${filename}.pdf`)
  } finally {
    container.remove()
  }
}
