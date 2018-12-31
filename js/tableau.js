const tableau = {

  init_table () {
    const table = $('tbody');
    for (let i = 0; i < 10; i++){
      const ligne = $('<tr>').appendTo(table);
      monTableau[i] = [];
      for (let j = 0; j < 10; j++) {
        monTableau[i][j] = new Vide(i, j);
        const td = $('<td>').appendTo(ligne);
        const div = $('<div>').addClass('arme').appendTo(td);
        $('<div>').addClass('perso').appendTo(div);
        $('<input>').attr('type', 'hidden').addClass('abs').val(j).appendTo(td);
        $('<input>').attr('type', 'hidden').addClass('ord').val(i).appendTo(td);
      }
    }

    // positionner les murs
    let x = 0;
    while (x < 12) {
      let abs = this.getRandomInt(10);
      let ord = this.getRandomInt(10);
      if (monTableau[abs][ord].nom === 'vide') {
        monTableau[abs][ord] = new Wall(abs, ord);
        this.cellule(monTableau[abs][ord]);
        x++;
      }
    }

    // Positionner les personnages
    this.positionnerPerso(perso1, true);
    this.positionnerPerso(perso2, true);

    // Positionner les armes
    this.positionnerArme(rifle, true);
    this.positionnerArme(bazooka, true);
  },

  // Ajouter une class à une cellule
  cellule (obj, effacer) {
    const tr = $('tbody').find('tr')[obj.ord];
    const td = $(tr)[0].cells[obj.abs];
    if (effacer) {
      $(td).removeClass(obj.nom);
    } else {
      $(td).addClass(obj.nom);
    }
  },

  // Positionner un personnage
  positionnerPerso (perso, hasard) {
    let ok = true;
    while (ok) {
      if (hasard) {
        perso.abs = this.getRandomInt(10);
        perso.ord = this.getRandomInt(10);
      }
      if (monTableau[perso.abs][perso.ord].nom === 'vide' && this.testVoisin(perso)) {
        monTableau[perso.abs][perso.ord].nom = perso.nom;
        this.cellule(perso);
        perso.arme.abs = perso.abs;
        perso.arme.ord = perso.ord;
        this.cellule(perso.arme);
        ok = false;
      }
    }
  },

  // Positionner un arme
  positionnerArme (arme, hasard) {
    let ok = true;
    while (ok) {
      if (hasard) {
        arme.abs = this.getRandomInt(10);
        arme.ord = this.getRandomInt(10);
      }
      if (monTableau[arme.abs][arme.ord].nom === 'vide') {
        monTableau[arme.abs][arme.ord] = arme;
        this.cellule(arme);
        ok = false;
      }
    }
  },

  effacerPerso (perso) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (monTableau[i][j].nom === 'chemin') {
          this.cellule(monTableau[i][j], true);
          monTableau[i][j] = new Vide(i, j);
        }
      }
    }
    this.cellule(perso, true);
    this.cellule(perso.arme, true);
  },

  testVoisin (perso) {
    let voisin;
    if (perso.nom === 'perso1') {
      voisin = 'perso2';
    } else {
      voisin = 'perso1';
    }
    const abs = perso.abs;
    const ord = perso.ord;
    if ((abs+1) < 10) {
      if (monTableau[abs+1][ord].nom === voisin) {
        return false;
      }
    }
    if ((abs-1) > -1) {
      if (monTableau[abs-1][ord].nom === voisin) {
        return false;
      }
    }
    if ((ord+1) < 10) {
      if (monTableau[abs][ord+1].nom === voisin) {
        return false;
      }
    }
    if ((ord-1) > -1) {
      if (monTableau[abs][ord-1].nom === voisin) {
        return false;
      }
    }
    return true;
  },

  // trouver un entier au hasard
  getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  // Vérifier la présence d'une nouvelle arme et l'échanger le cas échéant
  verifierArme (abs, ord, perso) {
    let arme;
    if (abs === perso.abs) {
      if (ord > perso.ord) {
        for (let i = ord; i > perso.ord; i--) {
          if (monTableau[abs][i].nom !== 'vide') {
            arme = monTableau[abs][i]
          }
        }
      } else {
        for (let i = ord; i < perso.ord; i++) {
          if (monTableau[abs][i].nom !== 'vide') {
            arme = monTableau[abs][i]
          }
        }
      }
    } else {
      if (abs > perso.abs) {
        for (let i = abs; i > perso.abs; i--) {
          if (monTableau[i][ord].nom !== 'vide') {
            arme = monTableau[i][ord]
          }
        }
      }else {
        for (let i = abs; i < perso.ord; i++) {
          if (monTableau[i][ord].nom !== 'vide') {
            arme = monTableau[i][ord]
          }
        }
      }
    }
    return arme;
  }
}