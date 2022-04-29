function appendCanvas (level, width, height) {
  const canv = document.createElement('canvas')
  canv.id = 'cvs' + level
  canv.width = width
  canv.height = height + 10

  document.body.appendChild(canv)

  const canvas = document.querySelector('#cvs' + level)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'

  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 1

  ctx.fillRect(0, 0, canv.width, canv.height)

  ctx.fillStyle = 'white'
  ctx.font = '12px Consolas'

  ctx.fillText(`level: ${level}`, 4, canv.height - 4)
  const canvasData = ctx.getImageData(0, 0, canv.width, canv.height)
  return { ctx, canvasData }
}
module.exports = appendCanvas
