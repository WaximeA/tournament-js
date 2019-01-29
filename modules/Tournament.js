import Player from './Player.js'
import Options from './Options.js'
import Bracket from './Bracket.js'

export default class Tournament {
  constructor(players, options) {

    this.players = []
    players.forEach(player => {
      this.addPlayer(player)
    })
    this.options = new Options(options)
    this.brackets = []
    this.nbBrackets = 0
  }

  addPlayer(player) {
    this.players.push(new Player(player.id, player.name))
  }

  display() {
    for (bracket in this.brackets) {
      bracket.display(this.options)
    }
  }

  createBracket() {
    //on doit calculer le nb de bracket necessaire
    this.nbBrackets = this.calcNbBracket()
    //on push autant de bracket que necessaire
    for (let i = 0; i < this.nbBrackets; i++) {
      this.brackets.push(new Bracket(/*firstPlayer, secondPlayer, options*/))
    }
  }

  calcNbBracket() {
    //on calcule le nb de bracket en fonction du nb de joueurs
  }
}
