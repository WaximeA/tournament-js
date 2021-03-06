export default class Form {

  constructor() {
    // On créer le squelette bootstrap
    let container = document.getElementById('root')
    let row = document.createElement('div')
    let col = document.createElement('div')
    // On gère les classes du squelette bootsrap
    container.className = 'container text-center mt-5'
    row.className = 'row'
    col.className = 'col-md-6 offset-md-3'
    // On ajoute le squelette bootstrap à la page
    container.appendChild(row);
    row.appendChild(col);

    // On créer le formulaire pour le nombre de players
    let formNblayers = document.createElement('form')
    // On lui met un id qu'on pourra utiliser après
    formNblayers.setAttribute('id', "nbPlayers");
    // On l'ajoute au HTML de la page
    col.appendChild(formNblayers);

    // On créer le formulaire pour les joueurs
    let formPlayers = document.createElement('form')
    // On lui met un id qu'on pourra utiliser après
    formPlayers.setAttribute('id', "players");
    // On l'ajoute au HTML de la page
    col.appendChild(formPlayers);

    this.formNblayers = formNblayers
    this.formPlayers = formPlayers
  }
  createForm(nb) {

    Promise
      .resolve()
      .then(() => {
        // On reset tout le formulaire des joueurs
        this.formPlayers.innerHTML = ""
        // On change le nom du formulaire

        // On ajoute le select pour le type de tournoi
        let div = document.createElement('div');
        let select = document.createElement('select');
        select.className = 'form-control mb-2';
        select.innerHTML += `<option value="classique"> -- Choisir un type de tournoi -- </option><option value="classique"> Classique </option><option value="poule"> Poule </option><option value="suisse"> Suisse </option>`;
        div.appendChild(select);
        this.formPlayers.appendChild(div);

        div = document.createElement('div');
        div.className = 'form-control mb-2';
        let score = document.createElement('input');
        score.className = 'col-6';
        score.type = 'checkbox'
        score.value = '1'
        let label = document.createElement('label');
        label.className = 'col-3';
        label.innerText = "Avec Score"
        div.appendChild(label)
        div.appendChild(score);

        this.formPlayers.appendChild(div);

        for (let index = 0; index < nb; index++) {
          let div = document.createElement('div');
          let input = document.createElement('input');
          input.type = 'text';
          input.className = 'form-control mb-2';
          // On lui met comme nom players + l'id du tableau
          input.setAttribute('name', `players[${index+1}]`);
          input.setAttribute('id', `players[${index+1}]`);
          input.setAttribute('value', `Joueur ${index+1}`); // Test
          input.setAttribute('placeholder', `Nom du joueur ${index+1}`);

          // On ajoute tout ça au formulaire
          div.appendChild(input);
          this.formPlayers.appendChild(div);
        }

        // On ajoute le bouton submit
        let submit = document.createElement('input');
        submit.type = 'submit';
        submit.className = 'btn btn-md btn-success mt-1';
        this.formPlayers.appendChild(submit);
      })
        .catch((err) => { console.log(err) })

    }


  initForm(){
    // On ajoute un champ pour indiquer le nombre de joueurs
    this.formNblayers.innerHTML += `<input id="nb" name="nb" type="number" placeholder="Nombre de joueurs" class="form-control mb-2"><input type="submit" class="btn btn-md btn-success mt-1">`;
  }
}

