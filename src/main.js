
const appendCanvas = require('./appendCanvas')
const game = require('./recs/roboyo1.inp.json')
const { Drawer } = require('./drawer')

const totalFrames = game.length - 1
const cWidth = 292
const cHeight = 240
const pause = 30
const pointsPerFrame = 120
let ctx

const drawer = new Drawer(cWidth, cHeight)

let x = cWidth / 2
let y = cHeight / 2
let lastX = x
let lastY = y
let index = 0
let lastInput
let canvasData
exports.canvasData = canvasData

let running = false
let level = 1

function drawFrames () {
  let count = 0
  while (count < pointsPerFrame) {
    if (index < totalFrames) {
      drawFrame()
    }
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
  if (x > cWidth - 4) {
    x = cWidth - 4
  }
  if (y > cHeight - 6) {
    y = cHeight - 6
  }
  if (lastX !== x || lastY !== y) {
    drawer.drawPixel(x, y, canvasData)
  }

  lastX = x
  lastY = y
  if (noInput(inp)) {
    x = cWidth / 2
    y = cHeight / 2
    lastX = x
    lastY = y
    drawer.changeColour()
  }

  if (newLevel(inp)) {
    ctx.putImageData(canvasData, 0, 0)
    changeLevel()
  }

  lastInput = inp
  index++
}

function changeLevel () {
  level++
  initialiseLevel()

  drawer.resetColours()
}

function initialiseLevel () {
  const cData = appendCanvas(level, cWidth, cHeight)
  ctx = cData.ctx
  canvasData = cData.canvasData
  x = cWidth / 2
  y = cHeight / 2
  lastX = x
  lastY = y
}

function noInput (inp) {
  return inp && lastInput && inp.f - lastInput.f > pause && !lastInput.p[0].includes('START1')
}

function newLevel (inp) {
  return lastInput !== undefined && !lastInput.p[0].includes('START1') && inp.p[0].includes('START1')
}

function addButtonListener () {
  const button = document.querySelector('#play')
  button.addEventListener('mousedown', e => {
    running = !running
    if (running) {
      window.requestAnimationFrame(drawFrames)
    }
  })
}

async function start () {
  addButtonListener()
  initialiseLevel()
}

window.addEventListener('load', start)
