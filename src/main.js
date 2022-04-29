
const appendCanvas = require('./appendCanvas')
const { Drawer } = require('./drawer')
const { GameState } = require('./game-state')

const pause = 30
const pointsPerFrame = 120
let ctx
let canvasData

let running = false

const gameState = new GameState()

const drawer = new Drawer(gameState.frameWidth, gameState.frameHeight)

function drawFrames () {
  let count = 0
  while (count < pointsPerFrame) {
    if (gameState.gameInProgress()) {
      drawFrame()
    }
    count++
  }

  ctx.putImageData(canvasData, 0, 0)
  if (running && gameState.gameInProgress()) {
    window.requestAnimationFrame(drawFrames)
  }
}

function drawFrame () {
  const inp = gameState.game[gameState.index]
  gameState.movePlayer()
  if (gameState.positionChanged()) {
    drawer.drawPixel(gameState.x, gameState.y, canvasData)
  }

  if (noInput(inp)) {
    drawer.drawDiePos(gameState.x, gameState.y, canvasData)
    gameState.setStartPosition()
    drawer.changeColour()
  }

  if (newLevel(inp)) {
    // write remaining image data before changing to new canvas
    ctx.putImageData(canvasData, 0, 0)
    changeLevel()
  }

  gameState.endMove()
}

function changeLevel () {
  gameState.level++
  initialiseLevel()
}

function initialiseLevel () {
  const cData = appendCanvas(gameState.level, gameState.frameWidth, gameState.frameHeight)
  ctx = cData.ctx
  canvasData = cData.canvasData
  gameState.setStartPosition()
  drawer.resetColours()
}

function noInput (inp) {
  return inp && gameState.lastInput && inp.f - gameState.lastInput.f > pause && !gameState.lastInput.p[0].includes('START1')
}

function newLevel (inp) {
  return gameState.lastInput !== undefined && !gameState.lastInput.p[0].includes('START1') && inp.p[0].includes('START1')
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
