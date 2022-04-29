class Drawer {
  constructor (width, height) {
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
  }

  resetColours () {
    this.selectedColour = 0
  }

  setCanvasPoint (x, y, canvasData) {
    const idx = (x + y * this.width) * 4
    const col = this.colours[this.selectedColour]
    canvasData.data[idx + 0] = col.r
    canvasData.data[idx + 1] = col.g
    canvasData.data[idx + 2] = col.b
    canvasData.data[idx + 4 + 0] = col
    canvasData.data[idx + 4 + 1] = col.g
    canvasData.data[idx + 4 + 2] = col.b
  }

  drawPixel (x, y, canvasData) {
    this.setCanvasPoint(x, y, canvasData)
    this.setCanvasPoint(x, y + 1, canvasData)
  }

  changeColour () {
    this.selectedColour++
    if (this.selectedColour >= this.colours.length) {
      this.selectedColour = 0
    }
  }
}

module.exports = { Drawer }
