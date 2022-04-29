
const appendCanvas = require('./appendCanvas')
const { Drawer } = require('./drawer')
const { GameState } = require('./game-state')

const pause = 30
const pointsPerFrame = 120
let ctx
let canvasData

let running = false
let gameState
let drawer

function drawFrames () {
  let count = 0
  while (count < pointsPerFrame) {
    if (gameState.gameInProgress()) {
      drawFrame()
    } else {
      drawer.drawDiePos(gameState.x, gameState.y, canvasData)
      break
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
    gameState.levelData[gameState.level].ll++
    gameState.setStartPosition()
    drawer.changeColour()
  }

  if (newLevel(inp)) {
    // write remaining image data before changing to new canvas
    ctx.putImageData(canvasData, 0, 0)
    const levelData = gameState.levelData[gameState.level]
    if (gameState.levelData[gameState.level]) {
      ctx.fillText(`level: ${gameState.level}, lives lost ${levelData.ll}, took: ${Math.round((inp.f - levelData.s) / 60)}s`, 4, 250 - 4)
    } else {
      ctx.fillText(`level: ${gameState.level}`, 4, 250 - 4)
    }

    gameState.levelData[gameState.level] = {
      s: inp.f,
      e: undefined,
      ll: 0
    }
    changeLevel(inp)
  }

  gameState.endMove()
}

function changeLevel (inp) {
  if (gameState.levelData[gameState]) {
    gameState.levelData[gameState].e = inp.f
  }
  gameState.level++
  gameState.levelData[gameState.level] = {
    s: inp.f,
    e: undefined,
    ll: 0
  }
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
  gameState = new GameState()

  drawer = new Drawer(gameState.frameWidth, gameState.frameHeight, document)
  addButtonListener()
  initialiseLevel()
}

window.addEventListener('load', start)
