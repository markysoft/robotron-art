
const game = require('./recs/roboyo.inp.json')
const totalFrames = game.length - 1
const cWidth = 292
const cHeight = 240
const pause = 55
const pointsPerFrame = 12
let rVal = 255
let rValDecreasing = true
let ctx

let x = cWidth / 2
let y = cHeight / 2
let lastX = x
let lastY = y
let index = 0
let lastFrame
let canvasData

let running = false
let level = 1

function setCavasPoint (xPos, yPos) {
  const idx = (xPos + yPos * cWidth) * 4
  canvasData.data[idx + 0] = rVal
  canvasData.data[idx + 1] = 255
  canvasData.data[idx + 2] = 255
  canvasData.data[idx + 4 + 0] = rVal
  canvasData.data[idx + 4 + 1] = 255
  canvasData.data[idx + 4 + 2] = 255
}

function drawPixel () {
  setCavasPoint(x, y)
  setCavasPoint(x, y + 1)
  rVal = rValDecreasing ? rVal - 6 : rVal + 6
  if (rVal < 0) {
    rVal = 0
    rValDecreasing = false
  }
  if (rVal > 255) {
    rVal = 255
    rValDecreasing = true
  }
}

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
    drawPixel()
  }

  lastX = x
  lastY = y
  index++
  if (lastFrame && inp.f - lastFrame > pause) {
    // console.log('paused for', inp.f - lastFrame)
    ctx.putImageData(canvasData, 0, 0)
    ctx.fillText(`pause: ${inp.f - lastFrame}`, 4, cHeight - 4)
    changeLevel()
  }
  lastFrame = inp.f
}

function changeLevel () {
  level++
  appendCanvas()
  ctx.fillStyle = 'white'
  x = cWidth / 2
  y = cHeight / 2
  lastX = x
  lastY = y

  rVal = 255
  rValDecreasing = true
}

function appendCanvas () {
  const canv = document.createElement('canvas')
  canv.id = 'cvs' + level
  canv.width = 292
  canv.height = 240

  document.body.appendChild(canv)

  const canvas = document.querySelector('#cvs' + level)
  ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'

  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 1

  ctx.fillRect(0, 0, cWidth, cHeight)
  ctx.fillStyle = 'white'
  ctx.font = '12px Consolas'
  canvasData = ctx.getImageData(0, 0, cWidth, cHeight)
}

async function start () {
  const button = document.querySelector('#play')
  button.addEventListener('mousedown', e => {
    running = !running
    if (running) {
      window.requestAnimationFrame(drawFrames)
    }
  })
  appendCanvas()
}

window.addEventListener('load', start)
