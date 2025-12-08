# 🚀 Guide de Déploiement Frontend sur Vercel

Ce guide vous aidera à déployer le frontend Vue.js de l'application AREA sur Vercel.

## 📋 Prérequis

- Un compte GitHub
- Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Les credentials OAuth (Google, GitHub)

## 🔧 Étapes de Déploiement

### 1️⃣ Préparer votre repository

Assurez-vous que tous vos fichiers sont commitées :

```bash
cd front-end/area-frontend
git add .
git commit -m "feat: add Vercel configuration"
git push origin main
```

### 2️⃣ Se connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### 3️⃣ Importer le projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre repository : `G-DEV-500-COT-5-2-area-9`
3. Cliquez sur **"Import"**

### 4️⃣ Configurer le projet

Dans la page de configuration :

**Framework Preset:**
- Vercel devrait détecter automatiquement **Vite**

**Root Directory:**
- Cliquez sur **"Edit"** à côté de Root Directory
- Sélectionnez : `front-end/area-frontend`
- ✅ Confirmez

**Build and Output Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 5️⃣ Configurer les variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_BASE_URL` | URL de votre backend (ex: `http://localhost:8000` ou URL production) | Production, Preview, Development |
| `VITE_API_VERSION` | `api` | Production, Preview, Development |
| `VITE_GOOGLE_CLIENT_ID` | Votre Google Client ID | Production, Preview, Development |
| `VITE_GITHUB_CLIENT_ID` | Votre GitHub Client ID | Production, Preview, Development |

**⚠️ Important pour OAuth:**
- Vous devrez **créer de nouveaux OAuth credentials** pour votre domaine Vercel
- Les redirect URIs doivent pointer vers votre domaine Vercel (ex: `https://votre-app.vercel.app/oauth/callback/google`)

### 6️⃣ Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-3 minutes)
3. Votre app sera disponible sur : `https://votre-projet.vercel.app`

## 🔄 Redéploiements automatiques

Vercel redéploiera automatiquement votre app à chaque push sur la branche `main` !

## 🎯 Configurer les OAuth Redirect URIs

### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez votre projet
3. **APIs & Services** → **Credentials**
4. Éditez votre OAuth 2.0 Client ID
5. Ajoutez dans **Authorized redirect URIs** :
   ```
   https://votre-app.vercel.app/oauth/callback/google
   ```
6. Ajoutez dans **Authorized JavaScript origins** :
   ```
   https://votre-app.vercel.app
   ```

### GitHub OAuth

1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Sélectionnez votre OAuth App
3. Modifiez :
   - **Homepage URL** : `https://votre-app.vercel.app`
   - **Authorization callback URL** : `https://votre-app.vercel.app/oauth/callback/github`

## 🐛 Dépannage

### Le build échoue

Vérifiez les logs dans Vercel et assurez-vous que :
- Toutes les dépendances sont dans `package.json`
- Les variables d'environnement sont correctement configurées
- Le Root Directory est bien `front-end/area-frontend`

### Les routes ne fonctionnent pas (404)

Le fichier `vercel.json` devrait gérer cela avec la réécriture vers `index.html`.

### OAuth ne fonctionne pas

1. Vérifiez que les redirect URIs correspondent exactement à votre domaine Vercel
2. Vérifiez que les variables d'environnement `VITE_GOOGLE_CLIENT_ID` et `VITE_GITHUB_CLIENT_ID` sont correctes
3. Assurez-vous que votre domaine Vercel est ajouté dans les authorized domains OAuth

## 📊 Fonctionnalités Vercel gratuites

✅ SSL automatique (HTTPS)
✅ CDN global
✅ Déploiements automatiques depuis Git
✅ Preview deployments pour chaque PR
✅ Analytics de base
✅ 100 GB de bande passante/mois

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environnement Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 💡 Conseils

1. **Domaine personnalisé** : Vous pouvez ajouter votre propre domaine gratuitement dans Vercel
2. **Preview URLs** : Chaque PR aura sa propre URL de preview
3. **Rollback** : Vous pouvez facilement revenir à une version précédente dans le dashboard

---

**🎉 Votre frontend est maintenant déployé et accessible publiquement !**

Pour déployer le backend, considérez Railway, Render, ou Fly.io.
