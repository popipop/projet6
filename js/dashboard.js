const dashboard = {

  // Afficher le tableau de bord
  afficherDashboard () {
    this.afficherJoueur(perso1);
    this.afficherJoueur(perso2);
  },

  // Actualiser le tableau de bord du joueur
  afficherJoueur (joueur, combat) {
    let divJoueur;
    let autreJoueur;
    if (joueur.nom === 'perso1') {
      divJoueur = $('#joueur1');
      autreJoueur = $('#joueur2');
    } else {
      divJoueur = $('#joueur2');
      autreJoueur = $('#joueur1');
    }
    if (!combat) {
      $(divJoueur).removeClass('actif');
      $(autreJoueur).addClass('actif')
    } else {
      $(divJoueur).addClass('actif');
      $(autreJoueur).removeClass('actif');
    }
    const vie = $(divJoueur).find('.vie')[0];
    if (joueur.sante > 0) {
      $(vie).text(joueur.sante + ' points');
    } else {
      $(vie).text('vous êtes morts !')
    }
    const nomArme = $(divJoueur).find('.nomArme')[0];
    $(nomArme).text('Arme : ' + joueur.arme.nom);
    const imgArme = $(divJoueur).find('.imageArme');
    $(imgArme).removeAttr('id');
    $(imgArme).attr('id', joueur.arme.nom);
    const force = $(divJoueur).find('.force')[0];
    $(force).text(joueur.arme.force + ' points');
    const btnAtt = $(divJoueur).find('.btn')[0];
    const btnDef = $(divJoueur).find('.btn')[1];
    if (combat === 'att') {
      $(btnAtt).addClass('attaquer').on('click', this.attaquer);
      $(btnDef).addClass('defendre').on('click', this.defendre);
    } else if (combat === 'def') {
      $(btnAtt).removeClass('attaquer').off('click', this.attaquer);
      $(btnDef).removeClass('defendre').off('click', this.defendre);
    }
  },

  // Lancer la séquence de combat
  lancerCombat (joueur) {
    theme1.pause();
    sonFight.play();
    console.log(joueur);
    MicroModal.show('modal-1');
    window.setTimeout(function() {
      MicroModal.close('modal-1');
      theme2.play();
      }, 2000);
    this.afficherJoueur(joueur, 'att');
  },

  // Callback du bouton Attaquer
  attaquer () {
    if ( $(this).attr('id') === 'att1') {
      dashboard.combattre(perso1, perso2);
    } else {
      dashboard.combattre(perso2, perso1);
    }
    laser.play();
  },

  // Callback du bouton Défendre
  defendre () {
    sonBouclier.play();
    if ($(this).attr('id') === 'def1') {
      perso1.bouclier = true;
      perso2.bouclier = false;
      dashboard.afficherJoueur(perso1, 'def');
      dashboard.afficherJoueur(perso2, 'att');
      dashboard.journal(perso1, perso2, 'defense')
    } else {
      perso2.bouclier = true;
      perso1.bouclier = false;
      dashboard.afficherJoueur(perso2, 'def');
      dashboard.afficherJoueur(perso1, 'att');
      dashboard.journal(perso2, perso1, 'defense');
    }
  },

  // Gestion du combat
  combattre (att, def) {
    if (!def.bouclier) {
      def.sante -= att.arme.force;
    } else {
      def.sante -= att.arme.force / 2;
    }
    this.afficherJoueur(att, 'def');
    this.journal(att, def, 'attaque');
    def.bouclier = false;
    if (def.sante <= 0) {
      this.journal(att, def);
      this.afficherJoueur(def, 'def');
      theme2.pause();
      deathScream.play();
      theme3.play();
    } else {
    this.afficherJoueur(def, 'att');
    }
  },

  // Affichage du journal de combat
  journal (att, def, action) {
    let phrase;
    if (action === 'attaque') {
      let degats = att.arme.force;
      if (def.bouclier) {
        degats = degats / 2;
      }
      phrase = att.nom + ' a infligé ' + degats + ' points à ' + def.nom + ' !';
    } else if (action === 'defense') {
      phrase = att.nom + ' aura 50% de dégats en moins au prochain coup.';
    } else {
      phrase = 'Victoire! ' + att.nom + ' a gagné !';
    }
    const ligne = $('#journal');
    $('<p>').addClass(att.nom).text(phrase).appendTo(ligne);
  }
}