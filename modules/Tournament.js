import Player from './Player.js'
import Options from './Options.js'
import Match from './Match.js'
import Form  from './Form.js'

const knownBrackets = [2, 4, 8, 16, 32, 64];

export default class Tournament {
  constructor(players, options) {

    this.players = []

    this.options = {
      score : false,
      type : "classique"
    }

    this.matches = [];
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
        id : index-1,
        name : e.target[index].value
      })
    }
    this.createMatches();
  }

  display() {
    for (bracket in this.brackets) {
      bracket.display(this.options)
    }
  }

  createMatches() {
    let nbRound = 1;
    let nbJoueur = this.players.length;
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
    for (let i = closestKnownBracket; i !== 1; i = i / 2) {
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
          if (typeof this.players[t] === 'undefined' && typeof this.players[t + 1] === 'undefined') {
            break;
          }
          //construction des matchs dans un round
          //on récupère les joeurs qui se suivent dans la liste
          joueur1 = this.players[t];
          joueur2 = this.players[t + 1];
          let match = new Match(idMatch, noMatch, [
              joueur1,
              joueur2
            ], null, null, false);
          //on met dans le tableau du round en cours un match identifié par son numéro de match
          matches[nbRound][noMatch] = match;
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
              //a changer
              return j.isWinner;
            });
            JoueursMatch.push(joueurWinnerPM);
          }
          if (previousM2 && previousM2.hasWinner === true) {
            let joueurWinnerPM = previousM2.joueurs.find(function (j) {
              //a changer
              return j.isWinner;
            });
            JoueursMatch.push(joueurWinnerPM);
          }
          let match = new Match(idMatch, noMatch, JoueursMatch, previousM1, previousM2, false);
          matches[nbRound][noMatch] = match;
          noMatch++;
          idMatch++;
        }
      }
      nbRound++;
    }
    this.matches = matches;
  }

  createBracket(tournament) {

    Promise
    .resolve()
    .then(() => {
      let root = document.getElementById('root');
      console.log(tournament);
      console.log(tournament.matches.length);
      for (let index = 1; index <= tournament.matches.length-1; index++) {
        root.innerHTML += '<p>manche '+index+'</p>';
        console.log(tournament.matches[index]);
        console.log(tournament.matches[index].length);
        for (let index2 = 1; index2 <= tournament.matches[index].length-1; index2++) {
          root.innerHTML += '<p><i>match '+index2+'</i></p>';
        }
      }
    })

    // Promise
    // .resolve()
    // .then(() => {
    //   let root = document.getElementById('root');
    //   let skeletonBracket =
    //       '<div class="container-bracket">\n' +
    //       '  <h1>Responsive Tournament Bracket</h1>\n' +
    //       '  <h2>Ice hockey at the 1998 Winter Olympics – Men\'s tournament</h2>\n' +
    //       '  <div class="tournament-bracket tournament-bracket--rounded">' +
    //       '    <div class="tournament-bracket__round tournament-bracket__round--quarterfinals">\n' +
    //       '      <h3 class="tournament-bracket__round-title">Quarterfinals</h3>\n' +
    //       '      <div class="tournament-bracket__list">'+
    //       '      </div>' +
    //       '    </div>' +
    //       '   </div>' +
    //       '</div>';
    //   let matchesNumber = tournament.matches.length;
    //   let bracketList = document.getElementsByClassName('tournament-bracket__list');
    //
    //   // Display bracket head
    //   root.innerHTML = skeletonBracket;
    //
    //   // Display each matches
    //   for (let index = 1; index <= matchesNumber; index++) {
    //     bracketList[0].innerHTML +=
    //         '           <div class="tournament-bracket__item">\n' +
    //         '              <div class="tournament-bracket__match" tabindex="0">\n' +
    //         '                <table class="tournament-bracket__table">\n' +
    //         '                  <caption class="tournament-bracket__caption">\n' +
    //         '                    <time datetime="1998-02-18">18 February 1998</time>\n' +
    //         '                  </caption>\n' +
    //         '                  <thead class="sr-only">\n' +
    //         '                    <tr>\n' +
    //         '                      <th>Country</th>\n' +
    //         '                      <th>Score</th>\n' +
    //         '                    </tr>\n' +
    //         '                  </thead>\n' +
    //         '                  <tbody class="tournament-bracket__content">\n' +
    //         '                    <tr class="tournament-bracket__team tournament-bracket__team--winner">\n' +
    //         '                      <td class="tournament-bracket__country">\n' +
    //         '                        <abbr class="tournament-bracket__code" title="Canada">CAN</abbr>\n' +
    //         '                        <span class="tournament-bracket__flag flag-icon flag-icon-ca" aria-label="Flag"></span>\n' +
    //         '                      </td>\n' +
    //         '                      <td class="tournament-bracket__score">\n' +
    //         '                        <span class="tournament-bracket__number">4</span>\n' +
    //         '                      </td>\n' +
    //         '                    </tr>\n' +
    //         '                    <tr class="tournament-bracket__team">\n' +
    //         '                      <td class="tournament-bracket__country">\n' +
    //         '                        <abbr class="tournament-bracket__code" title="Kazakhstan">KAZ</abbr>\n' +
    //         '                        <span class="tournament-bracket__flag flag-icon flag-icon-kz" aria-label="Flag"></span>\n' +
    //         '                      </td>\n' +
    //         '                      <td class="tournament-bracket__score">\n' +
    //         '                        <span class="tournament-bracket__number">1</span>\n' +
    //         '                      </td>\n' +
    //         '                    </tr>\n' +
    //         '                  </tbody>\n' +
    //         '                </table>\n' +
    //         '              </div>\n' +
    //         '            </div>';
    //   }
    // })
  }
}
