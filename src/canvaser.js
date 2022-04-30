class Canvaser {
  constructor (width, height, document) {
    this.width = width
    this.height = height
    this.document = document
    this.ctx = undefined
    this.canvas = undefined
  }

  appendCanvas (level) {
    const canv = document.createElement('canvas')
    canv.id = 'cvs' + level
    canv.width = this.width
    canv.height = this.height + 10

    document.body.appendChild(canv)

    this.canvas = document.querySelector('#cvs' + level)
    this.ctx = this.setupContext(this.canvas, level)
    const canvasData = this.ctx.getImageData(0, 0, canv.width, canv.height)
    return canvasData
  }

  finaliseCanvas (canvasData, gameState, inp) {
    this.ctx.putImageData(canvasData, 0, 0)
    const levelData = gameState.levelData[gameState.level]
    if (gameState.levelData[gameState.level]) {
      const seconds = Math.round((inp.f - levelData.s) / 60)
      this.ctx.fillText(`level: ${gameState.level}, lives lost: ${levelData.ll}, time: ${seconds}s`, 4, this.canvas.height - 4)
    } else {
      this.ctx.fillText(`level: ${gameState.level}`, 4, this.canvas.height - 4)
    }
  }

  setupContext (canvas, level) {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillStyle = 'black'

    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = 1

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.font = '12px Consolas'

    ctx.fillText(`level: ${level}`, 4, canvas.height - 4)
    return ctx
  }
}

module.exports = { Canvaser }
