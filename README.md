# Portfolio — Esteban Bueno

Site personnel statique (HTML / CSS / JS, sans dépendance de build), pensé pour être
poussé sur GitHub puis déployé sur ton infrastructure via **Coolify**.

## Structure

```
.
├── Dockerfile          # image nginx:alpine qui sert le site
├── nginx.conf          # config nginx (gzip, cache, en-têtes de sécurité)
├── public/              # tout ce qui est servi au navigateur
│   ├── index.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/
│       ├── css/style.css
│       ├── js/main.js
│       ├── favicon.svg
│       └── og-image.png   # image affichée quand le lien est partagé
└── README.md
```

## Aperçu en local

Aucun outil requis, mais évite d'ouvrir `index.html` en double-clic (certaines
requêtes de police échouent en `file://`). Un petit serveur suffit :

```bash
cd public
python3 -m http.server 8080
# puis ouvre http://localhost:8080
```

## Déploiement sur Coolify

1. Pousse ce dossier sur un dépôt GitHub (public ou privé).
2. Dans Coolify : **New Resource → Application → Dockerfile** (ou "Public Repository"
   si le dépôt est public), et pointe vers ce dépôt.
3. Coolify détecte le `Dockerfile` à la racine et construit l'image nginx directement
   — aucune variable d'environnement n'est nécessaire.
4. Renseigne ton domaine (`est1.be`) dans l'onglet **Domains** de la ressource,
   Coolify se charge du certificat TLS via Let's Encrypt si tu utilises son proxy Traefik/Caddy.
5. Déploie. Chaque nouveau `git push` sur la branche suivie peut ensuite redéployer
   automatiquement si tu actives le webhook Coolify sur le dépôt.

## Personnaliser le contenu

- Tout le texte est dans `public/index.html`, organisé par section
  (`#profil`, `#parcours`, `#competences`, `#projets`, `#infrastructure`, `#contact`).
- Les couleurs, polices et espacements sont centralisés dans les variables CSS en haut
  de `public/assets/css/style.css` (`:root { ... }`).
- L'animation du terminal dans le hero (`whoami`, `systemctl status homelab`, etc.) se
  modifie dans le tableau `bootLines` de `public/assets/js/main.js`.
- Pense à mettre à jour `public/sitemap.xml`, les balises `og:url` / `canonical` dans
  `index.html`, et `robots.txt` si le domaine final diffère de `est1.be`.

## Formulaire de contact

Le bouton "Envoyer un message" ouvre un `mailto:` — ça fonctionne sans backend.
Si tu veux un vrai formulaire plus tard, le plus simple est un service tiers
(ex. Formspree, EmailJS) qui ne demande qu'un `<form>` ou un appel `fetch`, sans
avoir à héberger de backend toi-même.

## Image de partage (Open Graph)

`public/assets/og-image.png` (1200×630) est ce qui s'affiche quand le lien est
partagé sur LinkedIn, Discord, etc. Remplace-la si tu préfères une capture d'écran
réelle du site ou une photo.

## Licence

Contenu et code libres d'être réutilisés et modifiés par Esteban Bueno.
