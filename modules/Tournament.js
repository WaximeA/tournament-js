import Player from './Player.js';
import Options from './Options.js';
import Match from './Match.js';
import Form from './Form.js';
import Helper from './Common.js';

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
    this.initModal();
  }

  /**
   * Génere la modal pour l'affichage du vainqueur
   */
  initModal(){

    // Crée le bouton qui sert de lien pour allumer la modal ( on ne l'affichera pas a l'écran)
    let hiddenModalStarter = document.createElement('a');
    hiddenModalStarter.setAttribute("href", "#winner-modal");
    hiddenModalStarter.className = 'hidden-button';
    hiddenModalStarter.textContent = '';

    // Ajout du bouton
    document.body.appendChild(hiddenModalStarter);

    // Création de la fenetre modal
    let modalWindow = document.createElement('div');
    modalWindow.setAttribute("id", "winner-modal");
    modalWindow.className = 'modal-window';

    // Création du conteneur des éléments dans la modal
    let modalDiv = document.createElement('div')
    modalWindow.appendChild(modalDiv);

    // Création du bouton pour fermer la modal
    let closeButton = document.createElement('a')
    closeButton.setAttribute("href", "#");
    closeButton.setAttribute("title", "Close");
    closeButton.className = 'modal-close';
    closeButton.textContent = `X`;
    modalDiv.appendChild(closeButton);

    // Création du titre de la modal
    let modalTitle=document.createElement('h1');
    modalTitle.setAttribute("id","modal-title");
    modalDiv.appendChild(modalTitle);

    // Création du texte de la modal
    let modalText = document.createElement('div');
    modalText.setAttribute("id","modal-text");
    modalDiv.appendChild(modalText)

    //On ajoute la modal (non visible) dans la page
    document.body.appendChild(modalWindow);

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
   * Mélange l'ordre des joueurs dans le tableau
   */
  shufflePlayers() {
    var currentPlayerIndex = this.players.length, tmpValue, randomIndex;

    // Tant qu'il reste des joueurs a mélanger...
    while (0 !== currentPlayerIndex) {

      // On en prend un...
      randomIndex = Math.floor(Math.random() * currentPlayerIndex);
      currentPlayerIndex -= 1;

      // On le mélange avec le joueur courant.
      tmpValue = this.players[currentPlayerIndex];
      this.players[currentPlayerIndex] = this.players[randomIndex];
      this.players[randomIndex] = tmpValue;
    }

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
      if (Helper.isOdd(e.target.length - 1) && index === e.target.length - 2) {
        isPlayerWinner = true;
      }

      this.addPlayer({
        id: index - 1,
        name: e.target[index].value,
        isPlayerWinner: isPlayerWinner,
      });
    }
    this.shufflePlayers();
    this.createMatches();
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
          //si on a plus de joueurs,
          // On met un match vide pour compléter
          if (typeof this.players[t] === 'undefined' &&
              typeof this.players[t + 1] === 'undefined') {
            let emptyMatch = new Match(idMatch, noMatch, [null, null], null, null, true, nbRound);
            matches[nbRound][noMatch] = emptyMatch;
          }
          else{
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
            ], null, null, matchHasWinner, nbRound);
            matches[nbRound][noMatch] = match;
          }

          //on met dans le tableau du round en cours un match identifié par son numéro de match
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

              if(j)
                return j.isWinner;
              else{
                return true
              }

            });
            JoueursMatch.push(joueurWinnerPM);
          }
          if (previousM2 && previousM2.hasWinner === true) {
            let joueurWinnerPM = previousM2.joueurs.find(function(j) {
              //a changer
              if(j)
                return j.isWinner;
              else
                return true
            });
            JoueursMatch.push(joueurWinnerPM);
          }

          let matchHasWinner = false;

          if(JoueursMatch.length > 1) {
            // On a un vainqueur
            let player = (JoueursMatch[0] == null) ? JoueursMatch[1] : JoueursMatch[0]
            if(!player) matchHasWinner = false
            else if(player.isWinner) {
              matchHasWinner = true;
            }
          }

          let match = new Match(idMatch, noMatch, JoueursMatch, previousM1,
              previousM2, matchHasWinner, nbRound);
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
    Promise.resolve().then(() => {
      let root = document.getElementById('root');
      let bracket = tournament.matches;
      let bracketContainer = document.createElement('div');
      bracketContainer.id = 'bracket';
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
                  playerContainer.onclick = function (e) {
                    win(player, matchup, tournament)
                    this.onclick=null;
                  };
                } else {
                  // Affichage d'un message comme quoi il n'y a pas d'opposant
                  playerContainer.className = 'player player-undefined';
                  playerContainer.textContent = 'No opponent.';
                }
                matchupContainer.appendChild(playerContainer);
              }
            } else {
              // Si le match a déjà un vainqueur, on créer la div avec ce dernier
              if (isPreviousMatcheshHasWinner(matchup)){
                let player1 = matchup.joueurs[1]
                let player2 = matchup.joueurs[0]

                let playerContainer = document.createElement('div');
                if(player1){
                  playerContainer.className = 'player player-' + player1.id;
                  playerContainer.textContent = player1.name;
                  playerContainer.onclick = function (e) {
                    win(player1, matchup, tournament)
                    this.onclick=null;
                  };
                }
                else{
                  playerContainer.className = 'player pending-player';
                  playerContainer.textContent = 'Pending player.';
                }
                matchupContainer.appendChild(playerContainer);
                let playerContainer2 = document.createElement('div');
                if(player2){
                  playerContainer2.className = 'player player-' + player2.id;
                  playerContainer2.textContent = player2.name;
                  playerContainer2.onclick = function (e) {
                    win(player2, matchup, tournament)
                    this.onclick=null;
                  };
                }
                else{
                  playerContainer2.className = 'player pending-player';
                  playerContainer2.textContent = 'Pending player.';
                }
                matchupContainer.appendChild(playerContainer2);

                // Si on a un vainqueur dans la
                if(player1) {
                  bracket[roundIndex+1][1].joueurs = [player1]
                }
              }
              else {
                let playerContainer1 = document.createElement('div');
                let playerContainer2 = document.createElement('div');

                // Si un joueur a gagné, on le met dans la div
                if(matchup.joueurs[0]) {
                  playerContainer1.className = 'player player-' + matchup.joueurs[0].id;
                  playerContainer1.textContent = matchup.joueurs[0].name;
                  matchup.joueurs[0].isWinner = false
                  playerContainer1.onclick = function (e) {
                    win(matchup.joueurs[0], matchup, tournament)
                    this.onclick=null;
                  };
                }
                else {
                  playerContainer1.className = 'player pending-player';
                  playerContainer1.textContent = 'Pending player.';
                }

                if(matchup.joueurs[1]) {
                  playerContainer2.className = 'player player-' + matchup.joueurs[1].id;
                  playerContainer2.textContent = matchup.joueurs[1].name;
                  matchup.joueurs[1].isWinner = false
                  playerContainer2.onclick = function (e) {
                    win(matchup.joueurs[1], matchup, tournament)
                    this.onclick=null;
                  };
                }
                else {
                  playerContainer2.className = 'player pending-player';
                  playerContainer2.textContent = 'Pending player.';
                }

                matchupContainer.appendChild(playerContainer1);
                matchupContainer.appendChild(playerContainer2);


              }
            }
          }
          // A décommenter pour voir la génération de l'abre OK avec un nombre de participant pair.
          // Ca ne fonctionne pas avec un nombre de participant impaire
          else {
            // Definition des match en attente
            if (!matchup.joueurs.length > 0) {
              for (let pendingPlayerIndex = 1; pendingPlayerIndex < 3; pendingPlayerIndex++) {
                let pendingPlayerContainer = document.createElement('div');
                pendingPlayerContainer.className = 'player pending-player';
                pendingPlayerContainer.textContent = 'Pending player.';
                matchupContainer.appendChild(pendingPlayerContainer);
              }
            }
          }

          // Ajout du match au round courrant
          roundContainer.appendChild(matchupContainer);
        }
        // Ajout du round au bracket

        bracketContainer.appendChild(roundContainer);
      }

      // Ajout du noeud du vainqueur du brakcet
      getWinnerContainer(bracketContainer);

      // Aout du brakket au container ou remplacement du container
      let actualBrackets = document.getElementById('bracket');
      //

      if(actualBrackets) actualBrackets.replaceWith(bracketContainer);
      else root.replaceWith(bracketContainer);
    });
  }
}

function getWinnerContainer(bracketContainer) {
  // Création du round, matchup et player gagnant
  let winnerRound = document.createElement('div');
  let winnerMatchup = document.createElement('div');
  let winnerPlayer = document.createElement('div');
  // Attribution des classes
  winnerRound.className = 'round winner';
  winnerMatchup.className = 'matchup winner';
  winnerPlayer.className = 'player winner';
  winnerPlayer.setAttribute("id", "winner");
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

function win(player, matchup, tournament) {
  // Le match est fini, on ne fait rien
  if(matchup.isFinished) return;
  matchup.isFinished = true;
  // Dernier round, on a un vainqueur
  if(!tournament.matches[matchup.round+1]){

    // On change l'URL pour afficher la modal
    (location.href.slice(-1) === '#') ? location.href=location.href+'winner-modal' : location.href+="#winner-modal";
    // Modification des infos dans la modal
    let divModalTitle = document.getElementById("modal-title") ;
    let divModalText = document.getElementById("modal-text") ;
    divModalTitle.textContent = "Résultats finaux";
    divModalText.textContent = `Bravo à ${player.name} qui remporte ce tournoi !`;

    let divWinner = document.getElementById("winner")
    divWinner.textContent = player.name;
  }
  // Sinon, on fait monter le vainqueur
  else {
    tournament.matches[matchup.round+1].forEach(match => {

      if(match.previousMatch1.id == matchup.id || match.previousMatch2.id == matchup.id){
        // On va garder le bon ordre des joueurs
        //si pair
        if (!Helper.isOdd(matchup.numeroMatch)) {
          if (!match.joueurs[0]) {
            match.joueurs[0] = null;
          }
          match.joueurs[1] = player;
        } else {
          match.joueurs[0] = player;
        }
        return false
      }
    });
    // On met à jour le bracket
    tournament.createBracket(tournament)
  }
}
