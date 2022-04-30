const { Drawer } = require('./drawer')
const { Canvaser } = require('./Canvaser')
const { GameState } = require('./game-state')

const pointsPerFrame = 120
let canvasData

let running = false
let gameState
let drawer
let canvaser

function drawFrames () {
  let count = 0
  while (count < pointsPerFrame) {
    if (gameState.gameInProgress()) {
      drawFrame()
    } else {
      // draw final end position
      drawer.drawDiePos(gameState.x, gameState.y, canvasData)
      break
    }
    count++
  }

  canvaser.ctx.putImageData(canvasData, 0, 0)
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

  if (gameState.noInput()) {
    drawer.drawDiePos(gameState.x, gameState.y, canvasData)
    gameState.levelData[gameState.level].ll++
    gameState.setStartPosition()
    drawer.changeColour()
  }

  if (gameState.newLevel()) {
    // write remaining image data before changing to new canvas
    canvaser.finaliseCanvas(canvasData, gameState, inp)
    changeLevel()
  }

  gameState.endMove()
}

function changeLevel () {
  gameState.changeLevel()
  initialiseLevel()
}

function initialiseLevel () {
  canvasData = canvaser.appendCanvas(gameState.level)
  gameState.setStartPosition()
  drawer.resetColours()
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
  canvaser = new Canvaser(gameState.frameWidth, gameState.frameHeight, document)
  addButtonListener()
  initialiseLevel()
}

window.addEventListener('load', start)
