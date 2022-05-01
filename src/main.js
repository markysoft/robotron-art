const { Drawer } = require('./drawer')
const { Canvaser } = require('./Canvaser')
const { GameState } = require('./game-state')

const pointsPerFrame = 480
let canvasData

let running = false
let gameState
let drawer
let canvaser

function drawFrames () {
  for (let count = 0; count < pointsPerFrame; count++) {
    if (gameState.gameInProgress()) {
      drawFrame()
    } else {
      // draw final end position
      drawer.drawDiePos(gameState.x, gameState.y, canvasData)
      break
    }
  }

  canvaser.ctx.putImageData(canvasData, canvaser.xOffset, canvaser.yOffset)

  if (!gameState.gameInProgress()) {
    // game ended, write last level details
    canvaser.finaliseCanvas(canvasData, gameState)
  }

  if (running && gameState.gameInProgress()) {
    window.requestAnimationFrame(drawFrames)
  }
}

function drawFrame () {
  gameState.movePlayer()
  if (gameState.positionChanged()) {
    drawer.drawPlayer(gameState.x, gameState.y, canvasData)
  }

  if (gameState.noInput()) {
    drawer.drawDiePos(gameState.x, gameState.y, canvasData)
    gameState.levelData[gameState.level].ll++
    gameState.setStartPosition()
    drawer.changeColour()
  }

  if (gameState.newLevel()) {
    // write remaining image data before changing to new canvas
    canvaser.finaliseCanvas(canvasData, gameState)
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
