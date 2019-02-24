import Player from './Player.js';
import Options from './Options.js';
import Match from './Match.js';
import Form from './Form.js';

const knownBrackets = [2, 4, 8, 16, 32, 64];

export default class Tournament {
  constructor(players, options) {

    this.players = [];

    this.options = {
      score: false,
      type: 'classique',
    };

    this.matches = [];
    this.nbBrackets = 0;

    this.form = new Form();
    this.form.initForm();
  }

  /**
   * Ajouter un joueur au tableau
   * @param {*} player : id, nom du joueur et s'il est vainqueur
   */
  addPlayer(player) {
    this.players.push(
        new Player(player.id, player.name, player.isPlayerWinner));
  }

  /**
   * Fonction utilisée pour construire le tournoi
   * à partir des inputs du formulaire
   * @param {e} target html
   */
  buildTournament(e) {

    // On sait que le premier input est le type de tournoi
    this.options.type = e.target[0].value;
    this.options.score = e.target[1].checked;

    // Pour chaque input, on ajoute le joueur en question
    for (let index = 2; index < e.target.length - 1; index++) {
      let isPlayerWinner = false;
      if (isOdd(e.target.length - 1) && index === e.target.length - 2) {
        isPlayerWinner = true;
      }

      this.addPlayer({
        id: index - 1,
        name: e.target[index].value,
        isPlayerWinner: isPlayerWinner,
      });
    }
    this.createMatches();
  }

  display() {
    for (bracket in this.brackets) {
      bracket.display(this.options);
    }
  }

  createMatches() {
    let nbRound = 1;
    let nbJoueur = this.players.length;
    let closestKnownBracket = knownBrackets.find(function(elem) {
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
          if (typeof this.players[t] === 'undefined' &&
              typeof this.players[t + 1] === 'undefined') {
            break;
          }
          //construction des matchs dans un round
          //on récupère les joeurs qui se suivent dans la liste
          joueur1 = this.players[t];
          joueur2 = this.players[t + 1];

          let matchHasWinner = false;
          if (joueur1.isWinner || joueur2.isWinner) {
            matchHasWinner = true;
          }

          let match = new Match(idMatch, noMatch, [
            joueur1,
            joueur2,
          ], null, null, matchHasWinner);
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
            let joueurWinnerPM = previousM1.joueurs.find(function(j) {
              //a changer
              return j.isWinner;
            });
            JoueursMatch.push(joueurWinnerPM);
          }
          if (previousM2 && previousM2.hasWinner === true) {
            let joueurWinnerPM = previousM2.joueurs.find(function(j) {
              //a changer
              return j.isWinner;
            });
            JoueursMatch.push(joueurWinnerPM);
          }
          let match = new Match(idMatch, noMatch, JoueursMatch, previousM1,
              previousM2, false);
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
    console.log(tournament);

    Promise.resolve().then(() => {
      let root = document.getElementById('root');
      let bracket = tournament.matches;
      let bracketContainer = document.createElement('div');
      bracketContainer.className = 'bracket';

      // Chaque round
      for (let roundIndex = 1; roundIndex < bracket.length; roundIndex++) {
        let round = bracket[roundIndex];
        let roundContainer = document.createElement('div');
        roundContainer.className = 'round round-' + roundIndex;

        // Chaque match
        for (let matchupIndex = 1; matchupIndex < round.length; matchupIndex++) {
          let matchup = round[matchupIndex];
          let matchupContainer = document.createElement('div');
          matchupContainer.className = 'matchup matchup-' + matchup.id;

          // Chaque joueur
          if (matchup.joueurs.length > 0) {
            // Test seulement pour le premier round
            if (roundIndex === 1) {
              for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
                let playerContainer = document.createElement('div');
                let player = matchup.joueurs[playerIndex];
                if (player) {
                  // Affichage du joueur
                  playerContainer.className = 'player player-' + player.id;
                  playerContainer.textContent = player.name;
                } else {
                  // Affichage d'un message comme quoi il n'y a pas d'opposant
                  playerContainer.className = 'player player-undefined';
                  playerContainer.textContent = 'No opponent.';
                }
                matchupContainer.appendChild(playerContainer);
              }
            } else {
              if (isPreviousMatcheshHasWinner(matchup)){
                // Ici il faudrait récupérer les vainqueur de chaque match précédent
              }
            }
          }
          // A décommenter pour voir la génération de l'abre OK avec un nombre de participant pair.
          // Ca ne fonctionne pas avec un nombre de participant impaire
          // else {
          //   // Definition des match en attente
          //   if (!matchup.joueurs.length > 0) {
          //   for (let pendingPlayerIndex = 1; pendingPlayerIndex < 3; pendingPlayerIndex++) {
          //     let pendingPlayerContainer = document.createElement('div');
          //     pendingPlayerContainer.className = 'player pending-player';
          //     pendingPlayerContainer.textContent = 'Pending player.';
          //     matchupContainer.appendChild(pendingPlayerContainer);
          // }}}

          // Ajout du match au round courrant
          roundContainer.appendChild(matchupContainer);
        }
        // Ajout du round au bracket
        bracketContainer.appendChild(roundContainer);
      }

      // Ajout du noeud du vainqueur du brakcet
      getWinnerContainer(bracketContainer);

      // Aout du brakket au container ou remplacement du container
      // root.append(bracketContainer);
      root.replaceWith(bracketContainer);
      console.log(bracketContainer);
    });
  }
}

// TODO FONCTIONS CI-DESSOUS A METTRE DANS UN HELPER POUR QUE CA SOIT PLUS PROPRE
function isOdd(num) { return num % 2;}

function getWinnerContainer(bracketContainer) {
  // Création du round, matchup et player gagnant
  let winnerRound = document.createElement('div');
  let winnerMatchup = document.createElement('div');
  let winnerPlayer = document.createElement('div');
  // Attribution des classes
  winnerRound.className = 'round winner';
  winnerMatchup.className = 'matchup winner';
  winnerPlayer.className = 'player winner';
  winnerPlayer.textContent = 'No winner yet';
  // Ajout des divs au bracket
  winnerMatchup.appendChild(winnerPlayer);
  winnerRound.appendChild(winnerMatchup);
  bracketContainer.appendChild(winnerRound);
}

function isPreviousMatcheshHasWinner(matchup) {
  let previousM1 = matchup.previousMatch1;
  let previousM2 = matchup.previousMatch2;
  let isPreviousMatcheshHasWinner = false;

  if (previousM1) {
    isPreviousMatcheshHasWinner = previousM1.hasWinner;
  } else if (previousM2) {
    isPreviousMatcheshHasWinner = previousM2.hasWinner;
  }

  return isPreviousMatcheshHasWinner;
}
