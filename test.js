let nbRound = 1;
let Joueurs = [
    {id: 0, name: "1"},
    {id: 1, name: "2"},
    {id: 2, name: "3"},
    {id: 3, name: "4"},
    {id: 4, name: "5"},
    {id: 5, name: "6"},
    {id: 6, name: "7"},
    {id: 7, name: "8"},
    {id: 8, name: "9"},
    {id: 9, name: "10"},
    {id: 10, name: "11"},
    {id: 11, name: "12"},
    {id: 12, name: "13"},
    {id: 13, name: "14"},
    {id: 14, name: "15"},
    {id: 15, name: "16"},
    {id: 16, name: "17"},
    {id: 17, name: "18"},
    {id: 18, name: "19"}
];
let nbJoueur = Joueurs.length;
const knownBrackets = [2, 4, 8, 16, 32, 64];
let closestKnownBracket = knownBrackets.find(function (elem) {
    return elem >= nbJoueur;
});
let matches = [];
let idMatch = 0;
let previousM1 = null;
let previousM2 = null;
for (i = closestKnownBracket; i !== 1; i = i / 2) {
    //construction nombre de round
    nbRound++;
    matches[nbRound] = [];
    let diff = nbJoueur - i;
    let noMatch = 1;
    for (t = 0; t < i; t += 2) {
        //construction des matchs dans un round
        if (typeof Joueurs[t] === 'undefined' && typeof Joueurs[t + 1] === 'undefined') {
            break;
        }
        if (nbRound !== 1) {
            // console.log(matches[nbRound -1][noMatch]);
            previousM1 = matches[nbRound-1][noMatch*2];
            console.log(noMatch*2);
            previousM2 = matches[nbRound-1][(noMatch*2)-1];
            console.log(previousM1);
        }
        let Match = {
            id: idMatch,
            j1: Joueurs[t],
            j2: Joueurs[t + 1],
            pm1: previousM1,
            pm2: previousM2,
        };
        idMatch++;
        noMatch++;
        matches[nbRound][noMatch] = Match;
    }
}
// console.log(nbRound);
// console.log(matches[2][0]);