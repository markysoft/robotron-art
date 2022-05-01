class Canvaser {
  constructor (width, height, document) {
    this.width = width
    this.cWidth = width
    this.height = height
    this.cHeight = height + 16
    this.document = document
    this.padding = 2
    this.canvas = document.querySelector('#levels')
    this.canvas.width = ((this.cWidth + this.padding) * 5) - this.padding
    this.canvas.height = ((this.cHeight + this.padding) * 250) / 5
    this.ctx = this.canvas.getContext('2d')
    this.xOffset = this.padding
    this.yOffset = this.padding
  }

  appendCanvas (level) {
    if (level > 1) {
      this.xOffset += this.cWidth + this.padding
      if ((level - 1) % 5 === 0) {
        this.yOffset += this.cHeight + this.padding
        this.xOffset = this.padding
      }
    }
    this.ctx = this.setupContext()
    const canvasData = this.ctx.getImageData(this.xOffset, this.yOffset, this.cWidth, this.cHeight)
    return canvasData
  }

  finaliseCanvas (canvasData, gameState) {
    const inp = gameState.game[gameState.index]
    this.ctx.putImageData(canvasData, this.xOffset, this.yOffset)
    const levelData = gameState.levelData[gameState.level]
    if (gameState.levelData[gameState.level]) {
      const seconds = Math.round((inp.f - levelData.s) / 60)
      this.ctx.fillText(`level: ${gameState.level}, lives lost: ${levelData.ll}, time: ${seconds}s`, this.xOffset + 4, this.yOffset + this.cHeight - 4)
    } else {
      this.ctx.fillText(`level: ${gameState.level}`, this.xOffset + 4, this.yOffset + this.cHeight - 4)
    }
  }

  setupContext () {
    const ctx = this.canvas.getContext('2d')
    ctx.fillStyle = 'black'

    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = 1

    ctx.fillRect(this.xOffset, this.yOffset, this.cWidth, this.cHeight)

    ctx.fillStyle = 'white'
    ctx.font = '12px Consolas'
    return ctx
  }
}

module.exports = { Canvaser }
