# 🚀 GUIDE RAPIDE - Pour Jules

## ✅ Ce que tu as maintenant

Un template GitHub complet prêt à déployer avec :
- Design moderne et responsive ✅
- Filtres dynamiques (Region/Sport/Topic) ✅
- Connexion automatique à ton Notion ✅
- Hébergement gratuit sur Vercel ✅

---

## 📋 CHECKLIST (15 minutes max)

### ☐ Étape 1 : Prépare tes clés Notion (5 min)

1. **Token Notion** :
   - Va sur https://www.notion.so/my-integrations
   - "+ New integration" → Nom: "Sport Business Watch"
   - **COPIE LE TOKEN** (commence par `secret_`)

2. **Database ID** :
   - Ouvre ta base Notion
   - Regarde l'URL : `notion.so/[workspace]/[CETTE_PARTIE]?v=...`
   - **COPIE CETTE PARTIE**

3. **Connecte l'intégration** :
   - Dans ta base Notion → "..." (en haut) → "Connections"
   - Sélectionne "Sport Business Watch"
   - Confirme

---

### ☐ Étape 2 : Crée ton repo GitHub (2 min)

**OPTION A : Via l'interface GitHub (plus simple)**

1. Va sur le template que je t'ai envoyé
2. Clique le bouton vert **"Use this template"**
3. Nom du repo : `sport-business-watch`
4. Public ou Private (ton choix)
5. **"Create repository"**

**OPTION B : Via upload manuel**

1. Télécharge le dossier `sport-business-watch-template`
2. Sur GitHub : "New repository"
3. Nom : `sport-business-watch`
4. Crée le repo
5. Upload tous les fichiers du template

---

### ☐ Étape 3 : Deploy sur Vercel (5 min)

1. **Va sur https://vercel.com**
   - "Sign up" avec GitHub (gratuit)
   - Autorise Vercel à accéder à tes repos

2. **Import ton projet**
   - "Add New" → "Project"
   - Sélectionne `sport-business-watch`
   - Vercel détecte Next.js automatiquement ✅

3. **Ajoute tes variables d'environnement**
   
   Dans la section "Environment Variables" :
   
   ```
   Name: NOTION_TOKEN
   Value: secret_ton_token_ici
   
   Name: NOTION_DATABASE_ID  
   Value: ton_database_id_ici
   ```

4. **Deploy**
   - Clique "Deploy"
   - Attends 2-3 minutes ⏱️
   - **C'EST EN LIGNE !** 🎉

---

### ☐ Étape 4 : Vérifie que ça marche (2 min)

1. Vercel te donne une URL : `https://sport-business-watch-xxx.vercel.app`
2. Clique dessus
3. Tu devrais voir :
   - Ton header avec stats
   - Tes filtres (Region, Sport, Topic)
   - Tes articles de Notion

**Si ça ne marche pas** :
- Check que tes variables d'env sont bonnes
- Vérifie l'intégration Notion
- Regarde les logs Vercel (onglet "Deployments")

---

## 🌐 Domaine Custom (Optionnel - 5 min)

Tu veux `watch.julesmoreau.eu` ?

1. **Dans Vercel** :
   - Settings → Domains
   - Add domain : `watch.julesmoreau.eu`
   - Vercel te donne les DNS à configurer

2. **Chez ton hébergeur** (là où est julesmoreau.eu) :
   - Ajoute un CNAME record
   - Name : `watch`
   - Value : `cname.vercel-dns.com`
   - Sauvegarde

3. **Attends 10-30 min** (propagation DNS)

4. **Done !** `watch.julesmoreau.eu` fonctionne ! 🎉

---

## 🎯 Structure de ton GitHub après setup

```
github.com/jules-moreau/
├── portfolio/                    (existe déjà - Netlify)
├── veille-script/               (existe déjà - ton Python)
└── sport-business-watch/        (NOUVEAU - Vercel)
    ├── app/
    ├── components/
    ├── package.json
    └── README.md
```

---

## 🔄 Workflow quotidien

1. **Ton script Python tourne** (GitHub Actions, chaque matin)
2. **Remplit Notion** avec nouveaux articles
3. **Ton dashboard Vercel** fetch automatiquement
4. **Tes filtres s'adaptent** aux nouvelles données

→ **TU NE TOUCHES PLUS À RIEN** ✅

---

## 💡 Pour partager

Envoie juste le lien :
```
https://sport-business-watch-xxx.vercel.app
```

Ou ton domaine custom :
```
https://watch.julesmoreau.eu
```

**Parfait pour :**
- Envoyer à tes profs
- Montrer en entretien chez BLAST/ESL
- Partager avec ta classe M1 ISA
- Mettre dans ton LinkedIn

---

## 🎨 Personnalisation (si tu veux)

**Changer les couleurs** :
- Édite `app/globals.css`
- Change `--accent-primary` et `--accent-secondary`
- Push sur GitHub → Vercel redeploy auto

**Modifier le texte** :
- Édite `components/Dashboard.js`
- Change "Sport Business Watch" par autre chose
- Push → Redeploy auto

---

## ❓ Si tu bloques

**Problème : "Failed to fetch articles"**
→ Check tes clés Notion dans Vercel settings

**Problème : Filtres vides**
→ Normal si ta base Notion est vide, ajoute des articles

**Problème : Build fail sur Vercel**
→ Regarde les logs (onglet "Deployments" → Click sur le deploy → "View Logs")

**Autre chose**
→ MP moi avec une screenshot et je debug direct

---

## ✅ Validation finale

Quand tout marche, tu devrais avoir :

☑️ Site en ligne sur Vercel
☑️ Tes articles Notion affichés
☑️ Filtres qui fonctionnent (clique dessus)
☑️ Search bar qui filtre en temps réel
☑️ Design responsive (teste sur mobile)
☑️ Lien partageable (sans login)

---

## 🔥 Next Level (optionnel)

Une fois déployé, tu peux ajouter :
- Analytics (Vercel Analytics gratuit)
- Export PDF des résultats filtrés
- Graphiques de tendances
- Notifications pour articles High Priority

Mais ça c'est pour plus tard, déjà déploie la base ! 🚀

---

**Temps total estimé : 15-20 minutes**

Good luck ! 💪

---

PS : Garde ce fichier, tu peux le supprimer du repo une fois déployé.
