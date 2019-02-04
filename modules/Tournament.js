import Player from './Player.js'
import Options from './Options.js'
import Bracket from './Bracket.js'
import Form  from './Form.js'

export default class Tournament {
  constructor(players, options) {

    this.players = []

    this.options = new Options(options)
    this.brackets = []
    this.nbBrackets = 0

    this.form = new Form()
    this.form.initForm()
  }

  /**
   * Ajouter un joueur au tableau
   * @param {*} player : id et nom du joueur
   */
  addPlayer(player) {
    this.players.push(new Player(player.id, player.name))
  }

  /**
   * Fonction utilisée pour construire le tableau de joueur
   * à partir des inputs du formulaire
   * @param {e} target html
   */
  setPlayers(e){

    // Pour chaque input, on ajoute le joueur en question
    for (let index = 0; index < e.target.length-1; index++) {

      this.addPlayer({
        id : index,
        name : e.target[index].value
      })
    }
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
