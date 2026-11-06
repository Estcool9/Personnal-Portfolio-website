# Portfolio — Esteban Bueno

Portfolio personnel statique, construit en HTML, CSS et JavaScript sans dépendance de build. Le site est servi par Nginx et déployable avec Docker / Coolify.

**Site :** https://est1.dev

## Structure

```
.
├── Dockerfile
├── nginx.conf
├── README.md
└── public/
    ├── index.html
    ├── 404.html
    ├── robots.txt
    ├── sitemap.xml
    └── assets/
        ├── css/style.css
        ├── js/main.js
        ├── favicon.svg
        ├── og-image.png
        └── projects/             # Logos SVG des projets, référencés dans le sitemap d’images
```

## Aperçu local

Aucun outil de build n'est nécessaire. Depuis la racine du dépôt :

```bash
cd public
python3 -m http.server 8080
```

Ouvrir ensuite http://localhost:8080.

## Déploiement avec Coolify

1. Créer une ressource **Application** depuis ce dépôt GitHub.
2. Choisir le build pack **Dockerfile** et la branche `main`.
3. Vérifier que le Dockerfile à la racine est utilisé.
4. Associer le domaine `est1.dev` à la ressource.
5. Lancer le déploiement et vérifier que le certificat TLS est actif.

L'image Nginx sert directement le contenu du dossier `public/`. Aucun processus npm ou étape de compilation n'est nécessaire.

## Personnalisation

- Le contenu, les métadonnées SEO et les données structurées Person / ProfilePage sont dans `public/index.html`.
- Les styles, couleurs et points de rupture sont dans `public/assets/css/style.css`.
- Les interactions (navigation mobile, animations d'apparition, copie d'adresse) sont dans `public/assets/js/main.js`.
- Les consignes d'exploration sont dans `public/robots.txt`. Le sitemap `public/sitemap.xml` référence la page d'accueil et ses logos via les extensions Google Images.

Après une modification de contenu importante, mettre à jour le champ `lastmod` du sitemap avec la date réelle de modification.

## Contact

Le bouton de contact ouvre un email à `esteban@est1.dev`. Le site ne collecte pas de données via un formulaire.

## Image de partage

`public/assets/og-image.png` est utilisée pour l'aperçu Open Graph et les partages sur les réseaux. Elle doit rester au format 1200 × 630 px.

## Licence

Contenu et code libres d'être réutilisés et modifiés par Esteban Bueno.
