export default class Match {
    constructor(idMatch, numeroMatch, joueurs, previousMatch1, previousMatch2, hasWinner, round) {
        this.id = idMatch;
        this.numeroMatch = numeroMatch;
        this.joueurs = joueurs;
        this.previousMatch1 = previousMatch1;
        this.previousMatch2 = previousMatch2;
        this.hasWinner = hasWinner;
        this.round = round
        this.isFinished = false
    }

    display(options) {
        //début affichage div

        //fin affichage div
    }

}
