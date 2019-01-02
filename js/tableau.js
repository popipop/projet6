const tableau = {

  // Initialiser le tableau de jeu
  init_table () {

    // Générer les cases du tableau de jeu et le tabeau "monTableau"
    const table = $('tbody');
    for (let i = 0; i < 10; i++){
      const ligne = $('<tr>').appendTo(table);
      monTableau[i] = [];
      for (let j = 0; j < 10; j++) {
        monTableau[i][j] = new Cellule(i, j, true);
        const td = $('<td>').appendTo(ligne);
        const div = $('<div>').addClass('arme').appendTo(td);
        $('<div>').addClass('perso').appendTo(div);
        $('<input>').attr('type', 'hidden').addClass('abs').val(j).appendTo(td);
        $('<input>').attr('type', 'hidden').addClass('ord').val(i).appendTo(td);
      }
    }

    // Positionner les murs
    let x = 0;
    while (x < 12) {
      let abs = this.getRandomInt(10);
      let ord = this.getRandomInt(10);
      if (monTableau[abs][ord].libre) {
        monTableau[abs][ord].libre = false;
        this.modifierCellule(monTableau[abs][ord]);
        x++;
      }
    }

    // Positionner les personnages
    this.initialiserPerso(perso1);
    this.initialiserPerso(perso2);

    // Positionner les armes
    this.initialiserArme(rifle);
    this.initialiserArme(bazooka);
  },

  // Modifier les class d'une cellule
  modifierCellule (cellule) {
    const tr = $('tbody').find('tr')[cellule.ord];
    const td = $(tr)[0].cells[cellule.abs];
    $(td).removeClass();
    if (!cellule.libre) {
      $(td).addClass('wall');
    }
    if (cellule.joueur) {
      $(td).addClass(cellule.joueur.nom)
      if (cellule.joueur.arme) {
        $(td).addClass(cellule.joueur.arme.nom)
      }
    } else {
      if (cellule.arme) {
        $(td).addClass(cellule.arme.nom)
      }
    }
    if (cellule.chemin) {
      $(td).addClass('chemin');
      $(td).on('click', this.clickCallback);
    }
  },

  // Afficher un joueur dans une cellule au hasard
  initialiserPerso (perso) {
    let ok = true;
    while (ok) {
      const abs = this.getRandomInt(10);
      const ord = this.getRandomInt(10);
      if (monTableau[abs][ord].libre && !this.testVoisin(monTableau[abs][ord])) {
        monTableau[abs][ord].joueur = perso;
        this.modifierCellule(monTableau[abs][ord]);
        ok = false;
      }
    }
  },

  // Afficher une arme dans une cellule au hasard
  initialiserArme (arme) {
    let ok = true;
    while (ok) {
      const abs = this.getRandomInt(10);
      const ord = this.getRandomInt(10);
      if (monTableau[abs][ord].libre && !monTableau[abs][ord].joueur) {
        monTableau[abs][ord].arme = arme;
        this.modifierCellule(monTableau[abs][ord]);
        ok = false;
      }
    }
  },

  // Effacer toutes les class "chemin" du tableau
  effacerChemins () {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (monTableau[i][j].chemin) {
          monTableau[i][j].chemin = false;
          this.modifierCellule(monTableau[i][j]);
          const tr = $('tbody').find('tr')[j];
          const td = $(tr)[0].cells[i];
          $(td).off('click', this.clickCallback);
        }
      }
    }
  },

  // Tester si un joueur est contre la cellule
  testVoisin (cellule) {
    const abs = cellule.abs;
    const ord = cellule.ord;
    if ((abs+1) < 10) {
      if (monTableau[abs+1][ord].joueur) {
        return true;
      }
    }
    if ((abs-1) > -1) {
      if (monTableau[abs-1][ord].joueur) {
        return true;
      }
    }
    if ((ord+1) < 10) {
      if (monTableau[abs][ord+1].joueur) {
        return true;
      }
    }
    if ((ord-1) > -1) {
      if (monTableau[abs][ord-1].joueur) {
        return true;
      }
    }
    return false;
  },

  // trouver un entier au hasard
  getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  // Déplacer le joueur sur le plateau
  jouer (joueur) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (monTableau[i][j].joueur === joueur) {
          celJoueur = monTableau[i][j];
          this.chemins(i, j);
        }
      }
    }
  },

  // Fonction callback déclenchée par un click sur les cases de class "chemin"
  clickCallback () {
    const nvAbs = Number($(this).find('.abs').val());
    const nvOrd = Number($(this).find('.ord').val());
    let celNvArme = tableau.verifierArme(nvAbs, nvOrd, celJoueur);
    if (celNvArme) {
      const nvArme = celNvArme.arme;
      celNvArme.arme = celJoueur.joueur.arme;
      celJoueur.joueur.arme = nvArme;
      tableau.modifierCellule(celNvArme);
    }
    monTableau[nvAbs][nvOrd].joueur = celJoueur.joueur;
    const nvCelJoueur = monTableau[nvAbs][nvOrd];
    celJoueur.joueur = '';
    tableau.modifierCellule(celJoueur);
    tableau.modifierCellule(nvCelJoueur);
    tableau.effacerChemins();
    if (tableau.testVoisin(nvCelJoueur)) {
      console.log('fight!!');
    } else {
      if (nvCelJoueur.joueur === perso1) {
        tableau.jouer(perso2);
      } else {
        tableau.jouer(perso1);
      }
    }
  },

  // Afficher les chemins possibles autour du joueur
  chemins (abs, ord) {
    for (let i = (abs + 1); i < (abs + 4); i++) {
      if (i < 10) {
        if (this.cellChemin(i, ord)) {
          break;
        }
      }
    }
    for (let i = (abs - 1); i > (abs - 4); i--) {
      if (i > -1) {
        if (this.cellChemin(i, ord)) {
          break;
        }
      }
    }
    for (let i = (ord + 1); i < (ord + 4); i++) {
      if (i < 10) {
        if (this.cellChemin(abs, i)) {
          break;
        }
      }
    }
    for (let i = (ord - 1); i > (ord - 4); i--) {
      if (i > -1) {
        if (this.cellChemin(abs, i)) {
          break;
        }
      }
    }
  },

  // Modifier chaque cellule chemin
  cellChemin (abs, ord) {
    if ( !monTableau[abs][ord].libre || monTableau[abs][ord].joueur) {
      return true;
    } else {
      monTableau[abs][ord].chemin = true;
      tableau.modifierCellule(monTableau[abs][ord]);
      return false;
    }
  },

  // Vérifier la présence d'une nouvelle arme et l'échanger le cas échéant
  verifierArme (abs, ord, celJoueur) {
    let arme;
    if (abs === celJoueur.abs) {
      if (ord > celJoueur.ord) {
        for (let i = celJoueur.ord + 1; i < ord + 1; i++) {
          if (monTableau[abs][i].arme) {
            arme = monTableau[abs][i];
          }
        }
      } else {
        for (let i = celJoueur.ord - 1; i > ord - 1; i--) {
          if (monTableau[abs][i].arme) {
            arme = monTableau[abs][i];
          }
        }
      }
    } else {
      if (abs > celJoueur.abs) {
        for (let i = celJoueur.abs + 1; i < abs + 1; i++) {
          if (monTableau[i][ord].arme) {
            arme = monTableau[i][ord];
          }
        }
      } else {
        for (let i = celJoueur.abs - 1; i > abs - 1; i--) {
          if (monTableau[i][ord].arme) {
            arme = monTableau[i][ord];
          }
        }
      }
    }
    return arme;
  }
}