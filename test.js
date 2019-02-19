let nbRound = 1;
let nbJoueur = Joueurs.length;
const knownBrackets = [2, 4, 8, 16, 32, 64];
let closestKnownBracket = knownBrackets.find(function (elem) {
    return elem >= nbJoueur;
});
let matches = [];
//l'id des matchs sera différents entre tous les matchs jusqu'à la finale
let idMatch = 0;
let previousM1 = null;
let previousM2 = null;
let previousRoundNbMatch = null;
//cette boucle permet de créer le bon nombre de match à chaque fois, en divisant par deux le nombre de match à chaque nouveau round
for (i = closestKnownBracket; i !== 1; i = i / 2) {
    let previousRound = null;
    if (nbRound !== 1) {
        previousRound = matches[nbRound - 1];
    }
    let noMatch = 1;
    matches[nbRound] = [];

    //la construction du premier round est différente puisqu'on utilise la liste des joueurs et pas la liste des matchs précédents
    if (nbRound === 1) {

        //Création des matchs en 1v1 -> on fait +2 à chaque itération pour récupèrer deux joueurs
        for (let t = 0; t < i; t += 2) {
            let joueur1 = null;
            let joueur2 = null;
            //si on a plus de joueurs, on arrete la boucle
            if (typeof Joueurs[t] === 'undefined' && typeof Joueurs[t + 1] === 'undefined') {
                break;
            }
            //construction des matchs dans un round
            //on récupère les joeurs qui se suivent dans la liste
            joueur1 = Joueurs[t];
            joueur2 = Joueurs[t + 1];
            let Match = {
                id: idMatch,
                noMatch: noMatch,
                joueurs: [
                    joueur1,
                    joueur2
                ],
                pm1: null,
                pm2: null,
                hasWinner: true
            };
            //on met dans le tableau du round en cours un match identifié par son numéro de match
            matches[nbRound][noMatch] = Match;
            idMatch++;
            noMatch++;
            previousRoundNbMatch = noMatch;
        }
    } else {
        previousRoundNbMatch = previousRound.length;
        for (let t = 1; t < previousRoundNbMatch; t += 2) {
            let JoueursMatch = [];

            //récupération des matchs précédent
            //on va récupère ces match en fonction du numéro du match en cours -> si on est au match n°2, on va récupèrer le match numéro 3 et 4 du round précédent
            previousM1 = previousRound[noMatch * 2];
            previousM2 = previousRound[(noMatch * 2) - 1];
            //récupération des joueurs gagnants des matchs précédents
            if (previousM1 && previousM1.hasWinner === true) {
                let joueurWinnerPM = previousM1.joueurs.find(function (j) {
                    return j.isWinner;
                });
                JoueursMatch.push(joueurWinnerPM);
            }
            if (previousM2 && previousM2.hasWinner === true) {
                let joueurWinnerPM = previousM2.joueurs.find(function (j) {
                    return j.isWinner;
                });
                JoueursMatch.push(joueurWinnerPM);
            }
            let Match = {
                id: idMatch,
                noMatch: noMatch,
                joueurs: JoueursMatch,
                pm1: previousM1,
                pm2: previousM2,
                hasWinner: false
            };
            matches[nbRound][noMatch] = Match;
            noMatch++;
            idMatch++;
        }
    }
    nbRound++;
}
console.log(matches);