class Personnage {
  constructor (nom, arme, sante) {
    this.nom = nom;
    this.abs;
    this.ord;
    this.sante = sante;
    this.arme = arme;
  }

  jouer () {
    this.chemins();
    const _this = this;
    //évènement click sur les cases de class chemin
    $('.chemin').on('click', function () {
      tableau.effacerPerso(_this);
      const abs = $(this).find('.abs').val();
      const ord = $(this).find('.ord').val();
      const nvArme = tableau.verifierArme(abs, ord, _this);
      if (nvArme) {
        
        nvArme.abs = abs;
        nvArme.ord = ord;
      }
      _this.abs = abs;
      _this.ord =ord;
      tableau.positionnerPerso(_this);
      tableau.positionnerArme(_this.arme);
    });
  }

  chemins () {
    for (let i = (this.abs + 1); i < (this.abs + 4); i++) {
      if (i < 10) {
        if (this.cellChemin(i, this.ord)) {
          break;
        }
      }
    }
    for (let i = (this.abs - 1); i > (this.abs - 4); i--) {
      if (i > -1) {
        if (this.cellChemin(i, this.ord)) {
          break;
        }
      }
    }
    for (let i = (this.ord + 1); i < (this.ord + 4); i++) {
      if (i < 10) {
        if (this.cellChemin(this.abs, i)) {
          break;
        }
      }
    }
    for (let i = (this.ord - 1); i > (this.ord - 4); i--) {
      if (i > -1) {
        if (this.cellChemin(this.abs, i)) {
          break;
        }
      }
    }
  }

  cellChemin(abs, ord) {
    const reg = RegExp('perso');
    if ((monTableau[abs][ord].nom === 'wall') || (reg.test(monTableau[abs][ord].nom))) {
      return true;
    } else {
      monTableau[abs][ord] = new Chemin(abs, ord);
      tableau.cellule(monTableau[abs][ord]);
      return false;
    }
  }
}