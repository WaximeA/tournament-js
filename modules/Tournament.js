import Player from './Player.js'
import Options from './Options.js'
import Bracket from './Match.js'
import Form  from './Form.js'

export default class Tournament {
  constructor(players, options) {

    this.players = []

    this.options = {
      score : false,
      type : "classique"
    }

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
   * Fonction utilisée pour construire le tournoi
   * à partir des inputs du formulaire
   * @param {e} target html
   */
  buildTournament(e){

    // On sait que le premier input est le type de tournoi
    this.options.type = e.target[0].value
    this.options.score = e.target[1].checked

    // Pour chaque input, on ajoute le joueur en question
    for (let index = 2; index < e.target.length-1; index++) {

      this.addPlayer({
        id : index-2,
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