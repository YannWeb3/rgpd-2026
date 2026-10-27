// Envoi d'un questionnaire RGPD vers Microsoft Forms (équipe Teams « Registre RGPD »).
// La page prépare un lien pré-rempli ; la personne vérifie dans Forms et clique sur « Envoyer ».
// Remplace l'ancien envoi vers le script Google (27/10/2026). Aucun nom de personne n'est demandé ni envoyé.
const QUESTIONNAIRE_FORMS = {
  url: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=LcAyZjdMg0KASCwDRRv1uw9KjH-aE45HmDG8kJuMxntURURYSlhWR1pWN1hLVVBDTTMxWVU3UFdRTiQlQCN0PWcu',
  champs: {
    questionnaire: 'r50102610c2ef440580cb42f78c58664a',
    etab: 'rc090cd01d9c345509cb0cc8792c06a59',
    fonction: 'r8956f1067b8e40e7a286fac86f215203',
    date: 'rc1e15cc49e9b48fcbeed18300b057d76',
    reponses: 'r000670fabf32445da8bb7370345d00c3',
    commentaires: 'rd5c6bffa99c14b878e8ed3ce6ab68891'
  }
};
// Forms accepte 6 391 caractères et refuse 10 110 (mesuré le 25/10) : on garde de la marge.
const QUESTIONNAIRE_LIEN_MAX = 6000;

// Selon la page, r.id est le nom du champ (« q0_1_nom_etablissement ») ou le repère de la question (« Q0.1 »).
function champDe(r) {
  const parNom = r.id && document.querySelector('[name="' + CSS.escape(r.id) + '"]');
  if (parNom) return parNom;
  const codes = [r.id, ((r.question || '').match(/(Q[\w.]+|ID-\d+)\s*$/) || [])[1]];
  const repere = Array.from(document.querySelectorAll('.question-id')).find(s => codes.includes(s.textContent.trim()));
  const bloc = repere && repere.closest('.question');
  return bloc ? bloc.querySelector('input:not([type="hidden"]), textarea, select') : null;
}

// Repère court d'une question : « Q6.2.3 » ou « ID-4 » quand la page en a un, sinon le nom du champ.
function repereQuestion(r, champ) {
  const m = (r.question || '').match(/(Q[\w.]+|ID-\d+)\s*$/) || (r.id || '').match(/^(Q[\w.]+|ID-\d+)$/);
  return m ? m[1] : (champ && champ.name) || r.id;
}

function dateFr(v) {
  const m = (v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return m[3] + '/' + m[2] + '/' + m[1];
  return v || new Date().toLocaleDateString('fr-FR');
}

function lienForms(valeurs) {
  let lien = QUESTIONNAIRE_FORMS.url;
  Object.entries(valeurs).forEach(([cle, v]) => {
    if (v) lien += '&' + QUESTIONNAIRE_FORMS.champs[cle] + '=' + encodeURIComponent(v);
  });
  return lien;
}

function valeurChamp(champ) {
  const groupe = Array.from(document.querySelectorAll('[name="' + CSS.escape(champ.name) + '"]'));
  if (champ.type === 'radio') return (groupe.find(c => c.checked) || {}).value || '';
  if (champ.type === 'checkbox') return groupe.filter(c => c.checked).map(c => c.value).join(' | ');
  return (champ.value || '').trim();
}

// Ce que la page envoie : la collecte de la page, plus les champs qu'elle ignore (ex. « précisez » sous un choix),
// sans les champs cachés ni les e-mails. Sert aussi à construire le dictionnaire des questions (registre-excel).
function lireReponses(responses) {
  const lues = [];
  const vus = new Set();
  responses.forEach(r => {
    const champ = champDe(r);
    if (champ) vus.add(champ.name);
    // Cases à cocher : toujours « a | b », quelle que soit la façon dont la page les joint.
    const reponse = champ && champ.type === 'checkbox' ? valeurChamp(champ) : (r.answer || '').trim();
    lues.push({ repere: repereQuestion(r, champ), champ: champ, reponse: reponse });
  });
  document.querySelectorAll('form [name]').forEach(champ => {
    if (vus.has(champ.name)) return;
    vus.add(champ.name);
    lues.push({ repere: champ.name, champ: champ, reponse: valeurChamp(champ) });
  });
  return lues.filter(l => !(l.champ && (l.champ.type === 'hidden' || l.champ.type === 'email')));
}

// responses : [{ id, question, answer }] (collecte de la page) ; ids : noms des champs établissement, fonction, date.
function ouvrirFormsQuestionnaire(questionnaire, responses, ids) {
  const lues = lireReponses(responses);
  const valeur = nom => ((lues.find(l => l.champ && l.champ.name === nom) || {}).reponse || '');
  const identite = Object.values(ids);
  const codes = [];
  const textes = [];
  lues.forEach(({ repere, champ, reponse }) => {
    if (!reponse || (champ && identite.includes(champ.name))) return;
    if (champ && champ.tagName === 'TEXTAREA') textes.push(repere + ' : ' + reponse);
    else codes.push(repere + '=' + reponse.replace(/[\n=]/g, ' '));
  });

  const valeurs = {
    questionnaire: questionnaire,
    etab: valeur(ids.etab),
    fonction: valeur(ids.fonction),
    date: dateFr(valeur(ids.date)),
    reponses: codes.join('\n'),
    commentaires: textes.join('\n')
  };
  let lien = lienForms(valeurs);
  const aColler = lien.length > QUESTIONNAIRE_LIEN_MAX && textes.length > 0;
  if (aColler) lien = lienForms(Object.assign({}, valeurs, { commentaires: '' }));
  afficherEnvoiForms(lien, aColler ? valeurs.commentaires : '');
  return lien;
}

function afficherEnvoiForms(lien, commentaires) {
  let boite = document.getElementById('envoi-forms');
  if (!boite) {
    boite = document.createElement('div');
    boite.id = 'envoi-forms';
    boite.style.cssText = 'max-width:760px;margin:24px auto;padding:20px 22px;background:#fff;border:3px solid #10b981;border-radius:14px;font:16px/1.5 Arial,sans-serif;color:#1f2937';
    const form = document.querySelector('form');
    (form || document.body).after(boite);
  }
  const echapper = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let html = '<p style="margin:0 0 8px;font-weight:bold;font-size:18px">Dernière étape : envoyer vos réponses</p>' +
    '<p style="margin:0 0 14px">Le formulaire d\'envoi s\'ouvre dans un nouvel onglet, déjà rempli. Vérifiez, puis cliquez sur <b>« Envoyer »</b> : sans ce clic, rien n\'est enregistré.</p>';
  if (commentaires) {
    html += '<p style="margin:0 0 6px"><b>Vos commentaires sont trop longs pour le lien.</b> Copiez-les, puis collez-les dans la dernière question, « Commentaires » :</p>' +
      '<textarea id="envoi-forms-textes" readonly style="width:100%;min-height:110px;box-sizing:border-box;font:14px Arial,sans-serif">' + echapper(commentaires) + '</textarea>' +
      '<button type="button" id="envoi-forms-copier" style="margin:6px 0 14px;padding:8px 14px;border-radius:8px;border:1px solid #10b981;background:#ecfdf5;cursor:pointer">Copier les commentaires</button>';
  }
  html += '<a href="' + echapper(lien) + '" target="_blank" rel="noopener" style="display:inline-block;padding:12px 20px;border-radius:10px;background:#10b981;color:#fff;font-weight:bold;text-decoration:none">Ouvrir le formulaire d\'envoi →</a>';
  boite.innerHTML = html;
  const copier = document.getElementById('envoi-forms-copier');
  if (copier) copier.addEventListener('click', () => {
    const zone = document.getElementById('envoi-forms-textes');
    zone.select();
    (navigator.clipboard ? navigator.clipboard.writeText(zone.value) : Promise.reject()).catch(() => document.execCommand('copy'));
    copier.textContent = 'Copié ✓';
  });
  boite.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
