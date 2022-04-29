class Drawer {
  constructor (width, height, document) {
    this.width = width
    this.height = height
    this.colours = [
      { r: 255, g: 255, b: 255 },
      { r: 80, g: 255, b: 255 },
      { r: 255, g: 80, b: 255 },
      { r: 255, g: 255, b: 80 },
      { r: 80, g: 80, b: 255 },
      { r: 80, g: 255, b: 80 },
      { r: 255, g: 80, b: 255 },
      { r: 128, g: 255, b: 255 },
      { r: 255, g: 128, b: 255 },
      { r: 255, g: 255, b: 128 },
      { r: 255, g: 128, b: 128 },
      { r: 128, g: 255, b: 128 },
      { r: 128, g: 128, b: 255 }
    ]
    this.resetColours()
    this.colourStep = 0.5
    this.selectedColour = 0
    this.diedAt = []
    this.initDefeat()
  }

  initDefeat () {
    this.dcanvas = document.querySelector('#defeats')
    this.dctx = this.dcanvas.getContext('2d')
    this.dctx.fillStyle = 'black'

    this.dctx.strokeStyle = 'red'
    this.dctx.lineWidth = 1

    this.dctx.fillRect(0, 0, this.dcanvas.width, this.dcanvas.height)
    this.dctx.globalAlpha = 0.5

    this.dctx.fillStyle = 'red'
  }

  resetColours () {
    this.selectedColour = 0
  }

  setCanvasPoint (x, y, canvasData, col) {
    const idx = (x + y * this.width) * 4
    this.drawBlock(canvasData, idx, col)
  }

  drawBlock (canvasData, idx, col) {
    canvasData.data[idx + 0] = col.r
    canvasData.data[idx + 1] = col.g
    canvasData.data[idx + 2] = col.b
    canvasData.data[idx + 4 + 0] = col.r
    canvasData.data[idx + 4 + 1] = col.g
    canvasData.data[idx + 4 + 2] = col.b
  }

  drawPixel (x, y, canvasData) {
    const col = this.colours[this.selectedColour]
    this.setCanvasPoint(x, y, canvasData, col)
    this.setCanvasPoint(x, y + 1, canvasData, col)
  }

  drawDiePos (x, y, canvasData) {
    this.diedAt.push({ x, y })

    this.dctx.beginPath()
    this.dctx.arc(x, y, 5, 0, Math.PI * 2, true)
    this.dctx.fill()
    const red = { r: 255, g: 0, b: 0 }
    const size = 2

    for (let xPos = x - size; xPos < x + size; xPos++) {
      for (let yPos = y - size; yPos <= y + size; yPos++) {
        this.setCanvasPoint(xPos, yPos, canvasData, red)
      }
    }
  }

  changeColour () {
    this.selectedColour++
    if (this.selectedColour >= this.colours.length) {
      this.selectedColour = 0
    }
  }
}

module.exports = { Drawer }
