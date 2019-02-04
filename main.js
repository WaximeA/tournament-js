import Tournament from './modules/Tournament.js'

let tournament = new Tournament()

let formNbPlayers = document.getElementById("nbPlayers")

formNbPlayers.onsubmit = function(){

  // TODO : Vérifier si le nombre de joueur est bon

  let nbPlayers = document.getElementById("nb").value

  tournament.form.createForm(nbPlayers)
  return false
};

let players = document.getElementById("players")

players.onsubmit = function(e){

  // TODO : vérifier si les champs sont des texts
  tournament.setPlayers(e)
  console.log(tournament.players)
  //tournament.createBracket() // TODO
  return false
};


console.log(tournament)
