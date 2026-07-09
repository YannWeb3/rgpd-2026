# rgpd-2026
Formulaires RGPD — Audit 2026

Site déployé : https://yannweb3.github.io/rgpd-2026/

## Contenu
- **index.html** — Landing page boîte à outils (14 outils)
- **login.html** — Connexion par code établissement (avec paramètre `?redirect=`)
- **dashboard.html** — Dashboard v1 (référent) + **Assistant IA** (Nemotron via OpenRouter)
- **dashboard-v2.html** — Dashboard v2 (v1 + Kit fusion)
- **Kit UNAPEI92.html** — Kit pédagogique interactif
- **kit_unapei92.html** — Kit carnet visuel (moderne, cartes, timeline)
- **dashboard_premium.html** — Vue direction consolidée
- **admin.html** — Admin DPO
- **config.js** — Configuration API + mode MOCK + clé OpenRouter
- **formation_RGPD.html**, **journal_incidents.html**, **plan_action_rgpd.html**, etc.

## Backend
- **Google Sheet** : `173hyHK1reC4HaLxZRAvRQKPSxaVH6hF52P4NPEHQPSw` (5 onglets)
- **API Apps Script** : déployée et branchée (`MOCK = false`)
- **Assistant IA** : OpenRouter → Nvidia Nemotron 3 Ultra 550B (free)

## Codes de test
| Code | Rôle |
|------|------|
| `1001` | Référent — ESAT Les Lilas |
| `1002` | Référent — FAM Le Bourget |
| `1003` | Référent — MAS Nanterre |
| `0000` | Admin / DPO |
