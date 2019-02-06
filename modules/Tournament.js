import Player from './Player.js'
import Options from './Options.js'
import Bracket from './Match.js'
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
        for (Match in this.Matches) {
            Match.display(this.options);
        }
    }

    createMatch() {
        //on doit calculer le nb de Match necessaire
        this.nbMatches = this.calcNbMatch();
        //on push autant de Match que necessaire
        for (let i = 0; i < this.nbMatches; i++){
            this.Matchs.push(new Match(/*firstPlayer, secondPlayer, options*/));
        }
    }

    calcNbMatch() {
        //on calcule le nb de Match en fonction du nb de joueurs
    }
};