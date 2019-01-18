export default class Match {
    constructor(firstPlayer, secondPlayer) {
        this.firstPlayer = firstPlayer;
        this.secondPlayer = secondPlayer;
    }

    display(options) {
        //début affichage div

        //affichage joueur1
        this.firstPlayer.display();
        //affichage joueur2
        this.secondPlayer.display();

        //fin affichage div
    }

}