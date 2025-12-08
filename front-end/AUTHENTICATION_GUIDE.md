# Revue de l'Authentification & Guide d'Intégration Frontend

J'ai finalisé la mise en place du système d'authentification backend. Voici un récapitulatif de ce qui a été fait et comment le frontend doit s'interfacer avec l'API.

## Vue d'ensemble

L'authentification repose sur **OAuth2** (via Django OAuth Toolkit) mais avec une particularité importante : **le Login est en 2 étapes (2FA) obligatoire**.

L'URL de base pour toutes les requêtes d'auth est : `/api/auth/`

---

## 1. Inscription (Register)

L'utilisateur crée son compte. Le compte est créé mais **inactif** jusqu'à validation de l'email.

*   **Endpoint** : `POST /register/`
*   **Payload** :
    ```json
    {
        "email": "user@example.com",
        "password": "SecurePass123!",
        "password_confirm": "SecurePass123!",
        "first_name": "John", // Optionnel
        "last_name": "Doe"    // Optionnel
    }
    ```
*   **Réponse (201 Created)** :
    ```json
    {
        "message": "Registration successful. Please check your email to verify your account.",
        "email": "user@example.com"
    }
    ```

## 2. Vérification d'Email

L'utilisateur reçoit un lien par email contenant un token UUID. Le frontend doit extraire ce token de l'URL et l'envoyer au backend.

*   **Endpoint** : `POST /verify-email/`
*   **Payload** :
    ```json
    {
        "token": "le-uuid-recu-par-email"
    }
    ```
*   **Réponse (200 OK)** : Compte activé, l'utilisateur peut se connecter.

## 3. Connexion (Login Flow) - **IMPORTANT**

La connexion se fait en deux temps. On ne reçoit **pas** de token au premier appel.

### Étape 1 : Identifiants
*   **Endpoint** : `POST /login/`
*   **Payload** :
    ```json
    {
        "email": "user@example.com",
        "password": "SecurePass123!"
    }
    ```
*   **Réponse (200 OK)** :
    ```json
    {
        "message": "Verification code sent to your email.",
        "email": "user@example.com"
    }
    ```
    *À ce stade, un code à 6 chiffres a été envoyé par email.*

### Étape 2 : Validation 2FA
C'est ici qu'on récupère les vrais tokens d'accès.

*   **Endpoint** : `POST /verify-2fa/`
*   **Payload** :
    ```json
    {
        "email": "user@example.com",
        "code": "123456"
    }
    ```
*   **Réponse (200 OK)** :
    ```json
    {
        "message": "Login successful.",
        "access_token": "...",
        "refresh_token": "...",
        "expires_in": 3600,
        "token_type": "Bearer",
        "user": { ... }
    }
    ```

## 4. Connexion Google

Pour le login social, le frontend gère la popup Google, récupère l'access token de Google, et nous l'envoie.

*   **Endpoint** : `POST /google/`
*   **Payload** :
    ```json
    {
        "access_token": "google-access-token-from-frontend"
    }
    ```
*   **Réponse (200 OK)** : Retourne directement les tokens AREA (access & refresh) comme pour le login classique.

## 5. Gestion de Session & User

### Récupérer l'utilisateur courant
*   **Endpoint** : `GET /me/`
*   **Header** : `Authorization: Bearer <access_token>`
*   **Réponse** : Infos de l'utilisateur (id, email, nom, etc.)

### Déconnexion
*   **Endpoint** : `POST /logout/`
*   **Header** : `Authorization: Bearer <access_token>`
*   **Action** : Invalide les tokens et ferme la session côté serveur.


## 6. Mot de Passe Oublié (Password Reset)

### Étape 1 : Demande de reset
L'utilisateur entre son email. Si l'email existe, un lien est envoyé.

*   **Endpoint** : `POST /password-reset/`
*   **Payload** :
    ```json
    {
        "email": "user@example.com"
    }
    ```
*   **Réponse (200 OK)** : Message de confirmation (ne révèle pas si l'email existe ou non).

### Étape 2 : Confirmation et Changement
L'utilisateur clique sur le lien reçu par email, qui doit rediriger vers une page frontend du type `/reset-password/:uid/:token`.
Le frontend récupère `uid` et `token` de l'URL et les envoie avec le nouveau mot de passe.

*   **Endpoint** : `POST /password-reset-confirm/`
*   **Payload** :
    ```json
    {
        "uidb64": "...",
        "token": "...",
        "password": "NewPassword123!",
        "password_confirm": "NewPassword123!"
    }
    ```
*   **Réponse (200 OK)** : Mot de passe modifié avec succès.


## Résumé du flux Frontend

1.  **Page Register** : Formulaire -> `POST /register/` -> Afficher "Vérifiez vos emails".
2.  **Page Verify** (route `/verify-email/:token`) : Au chargement -> `POST /verify-email/` avec le token -> Redirection vers Login.
3.  **Page Login** :
    *   Formulaire Email/Password -> `POST /login/`.
    *   Si succès -> Afficher modal/input pour le code 2FA.
    *   Input Code -> `POST /verify-2fa/`.
    *   Si succès -> Stocker tokens (LocalStorage/Cookie) -> Redirection Dashboard.
