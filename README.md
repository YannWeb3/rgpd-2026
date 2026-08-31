# rgpd-2026

Formulaires RGPD — Audit 2026

Site déployé : https://yannweb3.github.io/rgpd-2026/

## Contenu

- **index.html** — Landing page boîte à outils (14 outils)
- **login.html** — Connexion par code établissement (avec paramètre `?redirect=`)
- **dashboard-v2.html** — Dashboard référent + Assistant IA
- **kit_unapei92.html** — Kit carnet visuel (moderne, cartes, timeline)
- **formation_RGPD.html** — Formation RGPD
- **3approches.html** — Les 3 approches RGPD
- **Questionnaires par structure** : EMMA-H, SAMSAH, club-loisirs, cmpp, communication, daf, daoc-pfr, direction, donateurs, dos, dsi, eam, eanm, esat, ime, paie, qualite, rh, savs, sessad, soliasso
- **config.js** — Configuration API + mode MOCK

## Mode démo

Le site fonctionne en **mode MOCK** (`MOCK = true`) : les données de démonstration sont intégrées dans `config.js`. Aucun backend n'est exposé publiquement.

## Codes de test (mode démo)

| Code | Rôle |
|------|------|
| `1001` | Référent — ESAT Les Lilas |
| `1002` | Référent — FAM Le Bourget |
| `1003` | Référent — MAS Nanterre |
| `0000` | Admin / DPO |
