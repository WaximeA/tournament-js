import Tournament from '../../modules/Tournament.js'
import Helper from '../../modules/Common.js';

let tournament = new Tournament()

let auto = document.getElementById("auto")

let formNbPlayers = document.getElementById("nbPlayers")

formNbPlayers.onsubmit = function () {

  const nbPlayers = parseInt(document.getElementById('nb').value);
  // TODO : Vérifier si le nombre de joueur est bon
  if (Helper.type_check(nbPlayers, { type: "number" }) && nbPlayers > 1 && !(isNaN(nbPlayers))) {
    tournament.form.createForm(nbPlayers)
  }
  else {
    alert('Nombre de joueurs incorrect (2 joueurs minimum)')
  }
  return false
};

let players = document.getElementById("players")

players.onsubmit = function (e) {
  // TODO : vérifier si les champs sont des texts
  for (let index = 2; index < e.target.length-1; index++) {
    if(e.target[index].value == ""){
      alert("Un ou plusieurs joueurs n'ont pas de nom...");
      return false;
    }
  }

  // TODO : vérifier si les champs sont des texts
  tournament.buildTournament(e)
  tournament.createBracket(tournament)
  return false
};

auto.onclick = function (e) {
  let nb = document.getElementById("nb").value = 8
  const nbPlayers = parseInt(document.getElementById('nb').value);
  tournament.form.createForm(nbPlayers)
 // players.submit()
  tournament.buildTournament(e)
  tournament.createBracket(tournament)


  return false
};




