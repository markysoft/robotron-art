
const appendCanvas = require('./appendCanvas')
const game = require('./recs/roboyo.inp.json')
const { Drawer } = require('./draw-utils')

const totalFrames = game.length - 1
const cWidth = 292
const cHeight = 240
const pause = 55
const pointsPerFrame = 120
let ctx

const drawer = new Drawer(cWidth, cHeight)

let x = cWidth / 2
let y = cHeight / 2
let lastX = x
let lastY = y
let index = 0
let lastFrame
let canvasData
exports.canvasData = canvasData

let running = false
let level = 1

function drawFrames () {
  let count = 0
  while (count < pointsPerFrame) {
    drawFrame()
    count++
  }

  ctx.putImageData(canvasData, 0, 0)
  if (running && index < totalFrames) {
    window.requestAnimationFrame(drawFrames)
  }
}

function drawFrame () {
  const inp = game[index]
  for (const action of inp.p[0]) {
    if (action === 'LEFT') {
      x -= 2
    } else if (action === 'RIGHT') {
      x += 2
    }
    if (action === 'DOWN') {
      y -= 2
    } else if (action === 'UP') {
      y += 2
    }
  }

  if (x < 2) {
    x = 2
  }
  if (y < 4) {
    y = 4
  }
  if (x > cWidth - 2) {
    x = cWidth - 2
  }
  if (y > cHeight - 4) {
    y = cHeight - 4
  }
  if (lastX !== x || lastY !== y) {
    drawer.drawPixel(x, y, canvasData)
  }

  lastX = x
  lastY = y
  index++
  if (lastFrame && inp.f - lastFrame > pause) {
    ctx.putImageData(canvasData, 0, 0)
    ctx.fillText(`pause: ${inp.f - lastFrame}`, 4, cHeight - 4)
    changeLevel()
  }
  lastFrame = inp.f
}

function changeLevel () {
  level++
  const cData = appendCanvas(level, cWidth, cHeight)
  ctx = cData.ctx
  canvasData = cData.canvasData
  ctx.fillStyle = 'white'
  x = cWidth / 2
  y = cHeight / 2
  lastX = x
  lastY = y

  drawer.resetColours()
}

async function start () {
  const button = document.querySelector('#play')
  button.addEventListener('mousedown', e => {
    running = !running
    if (running) {
      window.requestAnimationFrame(drawFrames)
    }
  })
  const cData = appendCanvas(level, cWidth, cHeight)
  ctx = cData.ctx
  canvasData = cData.canvasData
}

window.addEventListener('load', start)
