function appendCanvas (level, width, height) {
  const canv = document.createElement('canvas')
  canv.id = 'cvs' + level
  canv.width = width
  canv.height = height

  document.body.appendChild(canv)

  const canvas = document.querySelector('#cvs' + level)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'

  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 1

  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'white'
  ctx.font = '12px Consolas'
  const canvasData = ctx.getImageData(0, 0, width, height)
  return { ctx, canvasData }
}
module.exports = appendCanvas
