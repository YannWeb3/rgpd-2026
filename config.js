// Configuration locale — à remplacer par l'URL de la Web App Apps Script au déploiement
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwaCmQ5TLWufcXJgFp1EIWWE9z38_z_Mz-9HOilahu-FBR42QL67EW9tSH8Vi1On-N9mA/exec',
  OPENROUTER_API_KEY: 'CHANGER_DANS_CONFIG_LOCAL', // Mettre la clé dans config.local.js
  OPENROUTER_MODEL: 'nvidia/nemotron-3-ultra-550b-a55b:free'
};

// Pour les tests locaux sans Apps Script, basculer sur MOCK = true
const MOCK = false;

// Données de démo
const MOCK_DATA = {
  referents: [
    { code: '1001', etablissement: 'ESAT Les Lilas', referent: 'Marie Dupont', email: 'm.dupont@unapei92.fr', actif: 'OUI' },
    { code: '1002', etablissement: 'FAM Le Bourget', referent: 'Luc Martin', email: 'l.martin@unapei92.fr', actif: 'OUI' },
    { code: '1003', etablissement: 'MAS Nanterre', referent: 'Sophie Bernard', email: 's.bernard@unapei92.fr', actif: 'OUI' }
  ],
  registre: [
    { id: 'r1', code_etab: '1001', date_ajout: '2026-01-10', categorie: 'RH', traitement: 'Gestion du personnel', finalite: 'Paie et contrats', responsable: 'Marie Dupont', base_legale: 'Contrat de travail', duree_conservation: '5 ans', donnees_concernees: 'Identité, coordonnées bancaires', destinataires: 'Comptable', mesures_securite: 'Accès restreint', commentaire: '' },
    { id: 'r2', code_etab: '1001', date_ajout: '2026-02-05', categorie: 'Santé', traitement: 'Dossiers médicaux', finalite: 'Suivi médical', responsable: 'Infirmier référent', base_legale: 'Obligation légale', duree_conservation: '20 ans', donnees_concernees: 'Données de santé', destinataires: 'Médecin', mesures_securite: 'Cabinet verrouillé', commentaire: '' },
    { id: 'r3', code_etab: '1001', date_ajout: '2026-03-15', categorie: 'Prestataire', traitement: 'Vidéosurveillance', finalite: 'Sécurité des locaux', responsable: 'Directeur', base_legale: 'Intérêt légitime', duree_conservation: '30 jours', donnees_concernees: 'Images', destinataires: 'Société de sécurité (sous-traitant)', mesures_securite: 'Accès restreint', commentaire: '' },
    { id: 'r4', code_etab: '1001', date_ajout: '2026-04-01', categorie: 'Administratif', traitement: 'Gestion des inscriptions', finalite: 'Admission des usagers', responsable: 'Secrétariat', base_legale: 'Contrat', duree_conservation: 'Durée prise en charge + 5 ans', donnees_concernees: 'Identité, coordonnées, situation familiale', destinataires: 'ARS', mesures_securite: 'Armoire fermée', commentaire: '' },
    { id: 'r5', code_etab: '1001', date_ajout: '2026-04-15', categorie: 'Santé', traitement: 'Suivi psychologique', finalite: 'Accompagnement psychologique', responsable: 'Psychologue', base_legale: 'Consentement', duree_conservation: '20 ans', donnees_concernees: 'Données de santé mentale', destinataires: 'Aucun', mesures_securite: 'Cabinet insonorisé, dossier verrouillé', commentaire: 'Données particulièrement sensibles' },
    { id: 'r6', code_etab: '1002', date_ajout: '2026-01-20', categorie: 'RH', traitement: 'Gestion des plannings', finalite: 'Organisation des équipes', responsable: 'Luc Martin', base_legale: 'Contrat de travail', duree_conservation: '3 ans', donnees_concernees: 'Identité, disponibilités', destinataires: 'Chef de service', mesures_securite: 'Logiciel protégé', commentaire: '' },
    { id: 'r7', code_etab: '1002', date_ajout: '2026-02-10', categorie: 'Santé', traitement: 'Suivi médical résidents', finalite: 'Soins et traitements', responsable: 'Médecin coordinateur', base_legale: 'Obligation légale', duree_conservation: '20 ans', donnees_concernees: 'Données de santé complètes', destinataires: 'Médecins traitants', mesures_securite: 'Dossier médical partagé', commentaire: '' },
    { id: 'r8', code_etab: '1002', date_ajout: '2026-03-01', categorie: 'Administratif', traitement: 'Gestion des admissions', finalite: 'Accueil des résidents', responsable: 'Secrétariat', base_legale: 'Contrat de séjour', duree_conservation: 'Durée séjour + 10 ans', donnees_concernees: 'Identité, situation administrative', destinataires: 'Conseil départemental', mesures_securite: 'Armoire fermée', commentaire: '' },
    { id: 'r9', code_etab: '1003', date_ajout: '2026-01-15', categorie: 'RH', traitement: 'Gestion des contrats', finalite: 'Paie et administration', responsable: 'Sophie Bernard', base_legale: 'Contrat de travail', duree_conservation: '5 ans', donnees_concernees: 'Identité, coordonnées bancaires', destinataires: 'Comptable', mesures_securite: 'Accès restreint', commentaire: '' },
    { id: 'r10', code_etab: '1003', date_ajout: '2026-02-20', categorie: 'Santé', traitement: 'Dossiers de soins', finalite: 'Suivi médical personnalisé', responsable: 'Infirmier coordinateur', base_legale: 'Obligation légale', duree_conservation: '20 ans', donnees_concernees: 'Données de santé', destinataires: 'Médecins', mesures_securite: 'Dossier papier verrouillé', commentaire: '' },
    { id: 'r11', code_etab: '1003', date_ajout: '2026-03-10', categorie: 'Prestataire', traitement: 'Transport médicalisé', finalite: 'Déplacements des résidents', responsable: 'Chef de service', base_legale: 'Contrat', duree_conservation: 'Durée contrat + 3 ans', donnees_concernees: 'Identité, besoins médicaux', destinataires: 'Société de transport (sous-traitant)', mesures_securite: 'Transmission sécurisée', commentaire: '' }
  ],
  actions: [
    { id: 'a1', code_etab: '1001', date_ajout: '2026-03-01', titre: 'Mettre à jour les fiches de paie', priorite: 'HAUTE', echeance: '2026-04-15', statut: 'EN_COURS', responsable: 'Marie Dupont', commentaire: '' },
    { id: 'a2', code_etab: '1001', date_ajout: '2026-03-05', titre: 'Signer convention infirmier', priorite: 'MOYENNE', echeance: '2026-05-01', statut: 'A_FAIRE', responsable: 'Directeur', commentaire: '' }
  ],
  incidents: [
    { id: 'i1', code_etab: '1001', date_ajout: '2026-03-10', date_incident: '2026-03-09', type: 'Perte de documents', gravite: 'MOYENNE', description: 'Perte d\'un classeur listant les noms des usagers', nb_personnes: 12, cnil_declare: 'NON', statut: 'OUVERT', commentaire: 'Recherche en cours' }
  ],
  suivi: [
    { id: 's1', code_etab: '1001', mois: '2026-03', score: 65, nb_actions_total: 2, nb_actions_faites: 1, nb_incidents: 1, nb_incidents_critiques: 0, commentaire: '' }
  ]
};

// Helpers mock API
function mockFetch(action, code, method = 'GET', body = null) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (action === 'login') {
        if (code === '0000') return resolve({ success: true, role: 'admin', code });
        const ref = MOCK_DATA.referents.find(r => r.code === code && r.actif === 'OUI');
        if (ref) return resolve({ success: true, role: 'referent', code, etablissement: ref.etablissement, referent: ref.referent, email: ref.email });
        return resolve({ success: false, error: 'Code invalide ou compte inactif' });
      }
      if (action === 'dashboard') {
        return resolve({
          success: true,
          registre: MOCK_DATA.registre.filter(r => r.code_etab === code),
          actions: MOCK_DATA.actions.filter(r => r.code_etab === code),
          incidents: MOCK_DATA.incidents.filter(r => r.code_etab === code),
          suivi: MOCK_DATA.suivi.filter(r => r.code_etab === code)
        });
      }
      if (action === 'admin') {
        return resolve({
          success: true,
          referents: MOCK_DATA.referents,
          registre: MOCK_DATA.registre,
          actions: MOCK_DATA.actions,
          incidents: MOCK_DATA.incidents,
          suivi: MOCK_DATA.suivi
        });
      }
      if (method === 'POST' && body.action === 'create') {
        body.row.id = body.row.id || 'mock-' + Date.now();
        body.row.date_ajout = body.row.date_ajout || new Date().toISOString().split('T')[0];
        MOCK_DATA[body.sheet.toLowerCase()].push(body.row);
        return resolve({ success: true, id: body.row.id });
      }
      if (method === 'POST' && body.action === 'update') {
        const list = MOCK_DATA[body.sheet.toLowerCase()];
        const idx = list.findIndex(r => r.id === body.id);
        if (idx >= 0) Object.assign(list[idx], body.row);
        return resolve({ success: true, id: body.id });
      }
      if (method === 'POST' && body.action === 'delete') {
        const list = MOCK_DATA[body.sheet.toLowerCase()];
        const idx = list.findIndex(r => r.id === body.id);
        if (idx >= 0) list.splice(idx, 1);
        return resolve({ success: true, id: body.id });
      }
      if (method === 'POST' && body.action === 'score') {
        const actions = MOCK_DATA.actions.filter(a => a.code_etab === body.code_etab);
        const incidents = MOCK_DATA.incidents.filter(i => i.code_etab === body.code_etab);
        const total = actions.length;
        const faites = actions.filter(a => a.statut === 'FAIT').length;
        const ouverts = incidents.filter(i => i.statut !== 'CLOTURE').length;
        const critiques = incidents.filter(i => i.gravite === 'CRITIQUE').length;
        let score = total === 0 ? 0 : Math.round((faites / total) * 100);
        score -= ouverts * 5;
        score -= critiques * 15;
        score = Math.max(0, Math.min(100, score));
        const existing = MOCK_DATA.suivi.find(s => s.code_etab === body.code_etab && s.mois === body.mois);
        if (existing) {
          Object.assign(existing, { score, nb_actions_total: total, nb_actions_faites: faites, nb_incidents: ouverts, nb_incidents_critiques: critiques });
        } else {
          MOCK_DATA.suivi.push({ id: 's-' + Date.now(), code_etab: body.code_etab, mois: body.mois, score, nb_actions_total: total, nb_actions_faites: faites, nb_incidents: ouverts, nb_incidents_critiques: critiques, commentaire: '' });
        }
        return resolve({ success: true, score });
      }
      resolve({ success: false, error: 'Action mock inconnue' });
    }, 300);
  });
}

async function api(action, code, method = 'GET', body = null) {
  if (MOCK) return mockFetch(action, code, method, body);
  const url = new URL(CONFIG.API_URL);
  url.searchParams.append('action', action);
  if (code) url.searchParams.append('code', code);
  const opts = { method, redirect: 'follow' };
  if (method === 'POST') {
    opts.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  if (action === 'export') return res.text();
  return res.json();
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('fr-FR');
}

function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}
