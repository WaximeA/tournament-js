export default class Form {

  constructor() {
    // On créer le formulaire pour le nombre de players
    let formNblayers = document.createElement('form')
    // On lui met un id qu'on pourra utiliser après
    formNblayers.setAttribute('id', "nbPlayers");
    // On l'ajoute au HTML de la page
    document.body.appendChild(formNblayers);

    // On créer le formulaire pour les joueurs
    let formPlayers = document.createElement('form')
    // On lui met un id qu'on pourra utiliser après
    formPlayers.setAttribute('id', "players");
    // On l'ajoute au HTML de la page
    document.body.appendChild(formPlayers);

    this.formNblayers = formNblayers
    this.formPlayers = formPlayers
  }
  createForm(nb) {

    Promise
      .resolve()
      .then(() => {
        // On reset tout le formulaire du nombre de joueurs
        this.formNblayers.innerHTML = ""
        // On change le nom du formulaire

        for (let index = 0; index < nb; index++) {
          let div = document.createElement('div');
          let input = document.createElement('input');
          input.type = 'text';
          // On lui met comme nom players + l'id du tableau
          input.setAttribute('name', `players[${index}]`);
          input.setAttribute('placeholder', `Nom du joueur ${index+1}`);

          // On ajoute tout ça au formulaire
          div.appendChild(input);
          this.formPlayers.appendChild(div);
        }

        // On ajoute le bouton submit
        let submit = document.createElement('input');
        submit.type = 'submit';
        this.formPlayers.appendChild(submit);
      })
        .catch((err) => { console.log(err) })

    }


  initForm(){
    // On ajoute un champ pour indiquer le nombre de joueurs
    this.formNblayers.innerHTML += `<input id="nb" name="nb" type="number" placeholder="Nombre de joueurs"><input type="submit">`;
  }
}

