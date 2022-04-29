
const game = require('./recs/roboyo1.inp.json')

class GameState {
  constructor () {
    this.frameWidth = 292
    this.frameHeight = 240
    this.index = 0
    this.lastInput = undefined
    this.game = game
    this.totalFrames = game.length - 1
    this.setStartPosition()
  }

  movePlayer () {
    const inp = game[this.index]
    for (const action of inp.p[0]) {
      if (action === 'LEFT') {
        this.x -= 2
      } else if (action === 'RIGHT') {
        this.x += 2
      }
      if (action === 'DOWN') {
        this.y -= 2
      } else if (action === 'UP') {
        this.y += 2
      }
    }

    if (this.x < 2) {
      this.x = 2
    }
    if (this.y < 4) {
      this.y = 4
    }
    if (this.x > this.frameWidth - 4) {
      this.x = this.frameWidth - 4
    }
    if (this.y > this.frameHeight - 6) {
      this.y = this.frameHeight - 6
    }
  }

  setStartPosition () {
    this.x = this.frameWidth / 2
    this.y = this.frameWidth / 2
    this.lastX = this.x
    this.lastY = this.y
  }

  endMove () {
    this.lastX = this.x
    this.lastY = this.y
    this.lastInput = this.game[this.index]
    this.index++
  }
}

module.exports = { GameState }
