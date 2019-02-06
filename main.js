import Tournament from './modules/Tournament.js'
import { type_check } from "./modules/Common.js";

let tournament = new Tournament()

let formNbPlayers = document.getElementById("nbPlayers")

formNbPlayers.onsubmit = function () {

  const nbPlayers = parseInt(document.getElementById('nb').value);
  // TODO : Vérifier si le nombre de joueur est bon
  if (type_check(nbPlayers, { type: "number" }) && nbPlayers > 1 && !(isNaN(nbPlayers))) {
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
  for (let index = 0; index < e.target.length-1; index++) {
    if(e.target[index].value !== ""){
      alert("Un ou plusieurs joueurs n'ont pas de nom...");
      return false;
    }
  }
  tournament.setPlayers(e)
  console.log(tournament.players)
  //tournament.createBracket() // TODO
  return false
};


console.log(tournament)
