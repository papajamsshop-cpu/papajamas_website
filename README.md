# PAPA JAMS — Website

Site officiel **PAPA JAMS** (tienda de discos · sello · distribución).
100 % statique : HTML + CSS + JS, **aucun build ni dépendance**.
Langues : **EN par défaut, ES et FR** via le sélecteur en haut à droite.

## Lancer en local

```bash
ruby -run -e httpd . -p 4173
```

→ <http://localhost:4173>

## Modifier le site au quotidien

| Je veux… | Fichier |
|---|---|
| Ajouter / retirer / corriger un disco, precio o talla | `js/catalog.js` (commenté, c'est le seul fichier à toucher) |
| Changer un texte (titres, botones, footer…) dans les 3 langues | `js/i18n.js` |
| Couleurs, polices, espacements | `styles.css` (variables `:root`) |
| Structure de la page | `index.html` |

Après modification : recharger le navigateur. C'est tout.

### `js/catalog.js` — champs disponibles

```
id, section, artist, title, label, cat, format, price,
oldPrice (precio tachado), sold (true = agotado),
condition ("VG+", "NM"… para 2ª mano),
shipDate ("2026-12-12" para preventas),
sizes (["S","M","L","XL","XXL"] para merch),
hue (color de portada: green|yellow|magenta|cyan|white|grey)
```

`section` ∈ `novedades` · `segunda-mano` · `preventas` · `distribucion` · `merch`

Les pochettes sont **générées en SVG** (pas d'images à téléverser) : chaque disque reçoit un design typographique + vinyle, chaque t-shirt un gabarit.

## Structure

```
website AI/
├── index.html        # page unique (topbar, header, hero, 5 collections, info, about, newsletter, footer)
├── styles.css        # design system (tokens : max-width 1380 · gutter 10 · radius 15/30)
├── js/
│   ├── i18n.js       # traductions EN / ES / FR
│   ├── catalog.js    # ← LE STOCK (à éditer)
│   └── app.js        # rendu, panier, búsqueda, newsletter, i18n
└── assets/
    ├── logo.png        # emblema (header/footer/favicon)
    ├── emblem-dark.jpg # hero
    └── emblem-light.jpg# "Sobre nosotros"
```

## Contenu repris des consignes (chat Ricardo Arroyo)

- **800+** références en tienda, **250+** sur Discogs, **30** de distribución, **1–2** novedades/mes
- Merch : 4–5 modèles de camisetas **S–XXL**
- Envois via **Packlink** : Europe + USA, Canada, Mexico, Brésil, Argentine, Uruguay, Colombie, Australie, Japon, Chine
- Paiements : TPV tarjeta (Visa/Mastercard), PayPal, transferencia, efectivo en boutique
- B2B : 1–2 commandes/mois (150–1 000 €)

> ⚠️ Les **produits, prix, dates et liens sociaux sont des exemples** (démo).
> Remplacer par le vrai stock et les vrais liens (Instagram, Discogs) avant mise en ligne.
> Le panier et le checkout sont **démo** : aucun paiement n'est traité — brancher Stripe/PayPal plus tard.

## Git & déploiement (Orkestr)

Le site vit sur **[Orkestr](https://orkestr.eu)** (hébergement EU).

| | |
|---|---|
| Projet | `papajams` (Papajamas Website) |
| URL live | **https://papajams.orkestr.run/** |
| Repo | github.com/papajamsshop-cpu/papajamas_website (branche `main`) |
| Auto-deploy | **actif** — chaque push redéploie le site (webhook) |

```bash
# --- après CHAQUE modification (workflow normal) ---
git add -A
git commit -m "message"
git push               # → le webhook redéploie le site automatiquement (~1 min)

# --- déploiement manuel (si besoin) ---
orkestr deploy papajams
```

Voir les déploiements : `orkestr deployments list papajams`
(`live` = en ligne, `superseded` = remplacé, `webhook` = déclenché par le push).

### Rollback (« reviens en arrière »)

Revenir à la version juste **avant** une série de modifs, puis republier :

```bash
git log --oneline              # repérer le commit où ça va bien
git revert --no-edit HEAD       # annule LA dernière modif (ou : git revert A..B)
git push                       # → redéploiement automatique de l'ancienne version
```

* `git revert <sha>` = annule un commit précis ; `git revert A..B` = annule une série.
* L'historique git n'est jamais réécrit (pas de force push).
* Plan free : le rollback natif Orkestr (`orkestr deployments rollback`) est réservé au plan Pro — le flux git revert ci-dessus a exactement le même effet.
