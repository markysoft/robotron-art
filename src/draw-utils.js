class Drawer {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.r = {
      val: 255,
      decreasing: true
    }
    this.g = {
      val: 255,
      decreasing: true
    }
    this.b = {
      val: 255,
      decreasing: true
    }
    this.resetColours()
    this.colToUpdate = this.r
  }

  resetColours () {
    this.r.val = 255
    this.r.decreasing = true
    this.g.val = 255
    this.g.decreasing = true
    this.b.val = 255
    this.b.decreasing = true
  }

  setCanvasPoint (x, y, canvasData) {
    const idx = (x + y * this.width) * 4
    canvasData.data[idx + 0] = this.r.val
    canvasData.data[idx + 1] = this.g.val
    canvasData.data[idx + 2] = this.b.val
    canvasData.data[idx + 4 + 0] = this.rVal
    canvasData.data[idx + 4 + 1] = this.g.val
    canvasData.data[idx + 4 + 2] = this.b.val
  }

  drawPixel (x, y, canvasData) {
    this.setCanvasPoint(x, y, canvasData)
    this.setCanvasPoint(x, y + 1, canvasData)
    this.updateColour(this.colToUpdate)
  }

  updateColour (colour) {
    colour.val = colour.decreasing ? colour.val - 6 : colour.val + 6
    if (colour.val < 0) {
      colour.val = 0
      colour.decreasing = false
    }
    if (colour.val > 255) {
      colour.val = 255
      colour.decreasing = true
      this.changeColour()
    }
  }

  changeColour () {
    if (this.colToUpdate === this.r) {
      this.colToUpdate = this.g
    } else if (this.colToUpdate === this.g) {
      this.colToUpdate = this.b
    } else if (this.colToUpdate === this.b) {
      this.colToUpdate = this.r
    }
  }
}

module.exports = { Drawer }
