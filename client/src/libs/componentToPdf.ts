import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf"

const pdfWidth: number = 8.5
const pdfHeight: number = 11
const pageMargin: number = 1

// Mainly standardizes the width of the element, then resets it back to current view
async function getCanvasFromHtmlElem(elem: HTMLElement): Promise<HTMLCanvasElement> {
  const oldWidth = elem.style.width
  elem.style.setProperty('width', '800px', 'important')
  const canvas = await html2canvas(elem)
  if (oldWidth.length > 0) {
    elem.style.setProperty('width', oldWidth)
  } else {
    elem.style.removeProperty('width')
  }
  return canvas
}

function createSubCanvasWithCoordinates(
  context: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number
): HTMLCanvasElement {
  const img = context.getImageData(x1, y1, x2, y2)
  const canvas = document.createElement('canvas')
  canvas.width = x2 - x1
  canvas.height = y2 - y1
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
  canvasContext.putImageData(img, 0, 0)
  return canvas
}

function splitCanvasIntoPages(
  canvas: HTMLCanvasElement,
  width: number, height: number, margin: number
): HTMLCanvasElement[] {
  const pageCanvases: HTMLCanvasElement[] = []
  const canvasPageHeight: number = canvas.width * ((height - (margin * 2)) / (width - (margin * 2)))
  let startAtPageHeight: number = 0
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
  while (startAtPageHeight < canvas.height) {
    pageCanvases.push(createSubCanvasWithCoordinates(
      canvasContext,
      0, startAtPageHeight,
      // Height is capped at either the end of the canvas, or the next page's worth of canvas
      canvas.width, Math.min(startAtPageHeight + canvasPageHeight, canvas.height))
    )
    // increment start height
    startAtPageHeight += canvasPageHeight
  }
  return pageCanvases
}

function addPageCanvasesToPdf(pageCanvases: HTMLCanvasElement[], pdf: jsPDF): jsPDF {
  for (let i = 0; i < pageCanvases.length; i++) {
    if (i > 0) {
      pdf.addPage()
    }
    pdf.addImage(
      pageCanvases[i], 'canvas',
      pageMargin, pageMargin, // offset from top left corner
      (pdfWidth - pageMargin * 2),
      pageCanvases[i].height / pageCanvases[i].width * (pdfWidth - pageMargin * 2)
    )
  }
  return pdf
}

export async function divToPdf(divId: string): Promise<jsPDF | null> {
  const elem = document.getElementById(divId)
  // make sure element id is valid
  if (elem != null) {
    const fullCanvas = await getCanvasFromHtmlElem(elem)
    const pageCanvases = splitCanvasIntoPages(fullCanvas, pdfWidth, pdfHeight, pageMargin)
    // dont want to return blank pdf
    if (pageCanvases.length === 0) return null
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [pdfHeight, pdfWidth]
    })
    return addPageCanvasesToPdf(pageCanvases, pdf)
  }
  return null
}

