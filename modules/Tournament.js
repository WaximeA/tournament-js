import Player from "./Player";
import Options from "./Options";
import Match from "./Match";

export default class Tournament {
    constructor(players, options, id_tournament) {
        this.players = [];
        for (player in players) {
            this.addPlayer(player);
        }
        this.options = new Options(options);
        this.Matches = [];
        this.nbMatchs = 0;
        this.id_tournament = document.getElementById(id_tournament);
    }

    addPlayer(player) {
        this.players.push(new Player(player.id, player.name));
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