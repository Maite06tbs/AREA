# Authentication & OAuth Backend Integration (AREA)

This document describes how authentication and OAuth integrations should be implemented on the backend to match the frontend expectations in the AREA project.

It covers two related areas:
- User authentication (AREA native login + Google social login used to sign-in users)
- Service OAuth connections (connecting external services like Google/Gmail, GitHub)

Keep the API URLs under `/api/` and ensure CORS and HTTPS are configured for production.

---

## Table of contents

- User authentication (native + Google social)
  - Endpoints
  - Payloads & responses
  - Token management
- About / Services discovery
  - `GET /api/core/about.json` schema
- Service OAuth (connect external services)
  - Endpoints (status, complete, disconnect, callback)
  - Payloads & responses
  - Scopes & validation
- Security & operational notes
- Examples (curl)

---

## 1) User authentication (native + Google social)

These endpoints are used by the frontend pages `LoginPage.vue` and `SignUpPage.vue`.

Base path: `/api/auth/`

### POST /api/auth/register/
- Purpose: Register a new user
- Body (application/json):
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPass123!",
    "password_confirm": "StrongPass123!",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- Responses:
  - 201 Created: user created (optional: sends verification email)
  - 400 Bad Request: validation errors

### POST /api/auth/login/
- Purpose: Login with email/password (Step 1)
- Body:
  ```json
  { "email": "user@example.com", "password": "StrongPass123!" }
  ```
- Responses:
  - 200 OK: may indicate 2FA required (frontend currently shows 2FA modal) or returns session detail
  - 401 Unauthorized: invalid credentials

### POST /api/auth/verify-2fa/
- Purpose: Verify 2FA code (Step 2)
- Body:
  ```json
  { "email": "user@example.com", "code": "123456" }
  ```
- Responses:
  - 200 OK: returns tokens and user info
    ```json
    {
      "access_token": "<AREA_ACCESS_TOKEN>",
      "refresh_token": "<AREA_REFRESH_TOKEN>",
      "expires_in": 3600,
      "token_type": "Bearer",
      "user": { "id": 1, "email": "user@example.com", "first_name": "John" }
    }
    ```
  - 400 / 401: invalid code or expired

### POST /api/auth/google/
- Purpose: Social sign-in / sign-up using a Google access token supplied by frontend
- Body:
  ```json
  { "access_token": "<google-access-token-from-frontend>" }
  ```
- Behavior expected on backend:
  1. Validate the Google access token by calling Google userinfo endpoint:
     - `GET https://www.googleapis.com/oauth2/v3/userinfo?access_token=<token>`
     - Ensure response is OK and contains `email` (and optionally `sub`, `name`, `given_name`, `family_name`).
     - Optionally verify `aud` matches your client ID if token contains that field.
  2. Find or create a local User record using returned email. If creating, set unusable password.
  3. Create and return AREA access & refresh tokens (same shape as regular login).
- Responses:
  - 200 OK: returns AREA tokens and user info
  - 400 Bad Request: invalid Google token or missing email

### POST /api/auth/logout/
- Purpose: Invalidate the current AREA session/tokens
- Requires Authorization: Bearer <access_token>
- Response: 204 No Content or 200 OK

### GET /api/auth/me/
- Purpose: Return current authenticated user
- Requires Authorization: Bearer <access_token>
- Response: 200 OK: user object

---

## 2) About / Services discovery

Frontend fetches services and their OAuth configuration from a single endpoint. Implement the endpoint the frontend expects:

### GET /api/core/about.json
- Purpose: Provide basic server & client metadata, including the `server.services` array.
- Response schema (example):
  ```json
  {
    "client": { "host": "app.example.com" },
    "server": {
      "current_time": 1700000000000,
      "services": [
        {
          "name": "google",
          "display_name": "Google Mail",
          "requires_oauth": true,
          "oauth_config": {
            "scopes": [
              "https://www.googleapis.com/auth/userinfo.email",
              "https://www.googleapis.com/auth/userinfo.profile",
              "https://www.googleapis.com/auth/gmail.readonly",
              "https://www.googleapis.com/auth/gmail.send"
            ],
            "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
            "token_url": "https://oauth2.googleapis.com/token"
          },
          "actions": [ /* ... */ ],
          "reactions": [ /* ... */ ]
        }
      ]
    }
  }
  ```
- Notes: Keep `oauth_config` full and accurate for each service so frontend can render connect buttons and request correct scopes.

---

## 3) Service OAuth (connect external services)

These endpoints are for managing connections between AREA and external services (Gmail, GitHub, etc.). The frontend uses the following endpoints (implement equivalent paths and behavior):

Base path proposal: `/api/oauth/`

### POST /api/oauth/{service}/complete/
- Purpose: Complete the OAuth flow for a service when frontend supplies an access token (or server receives a code for code-exchange flows).
- Example (frontend uses this for Google after receiving an access token from Google Identity Services):
  - Request body:
    ```json
    { "access_token": "<external-access-token>" }
    ```
  - Expected backend actions (Google example):
    1. Validate token with provider (`userinfo` or `tokeninfo` endpoint).
    2. If provider requires server-side exchange (e.g., GitHub code), exchange code for access_token + refresh_token.
    3. Persist provider tokens securely (encrypt at rest), with metadata: user id, service name, scopes, expires_at.
    4. Return success and connection details (email/username, expires_at) or error.
  - Response success example:
    ```json
    { "success": true, "details": { "email": "user@gmail.com", "expires_at": "2025-12-31T12:00:00Z" } }
    ```
  - Errors: 400 Bad Request for invalid token, 401 unauthorized for provider rejection, 500 server error for storage issues.

### GET /api/oauth/status/  (or /api/oauth/connection-status/)
- Purpose: Return connection status for each service for the current user.
- Requires Authorization: Bearer <AREA access token>
- Response example:
  ```json
  {
    "google": { "connected": true, "details": { "email": "user@gmail.com", "expires_at": "2025-12-31T12:00:00Z" }},
    "github": { "connected": false, "details": null }
  }
  ```
- Frontend calls this to render connection badges.

### DELETE /api/oauth/{service}/disconnect/
- Purpose: Disconnect a previously connected service (revoke tokens and delete stored credentials)
- Requires Authorization: Bearer <AREA access token>
- Response: 200 OK or 204 No Content on success.

### (Optional) GET/POST /api/oauth/{service}/callback/
- Purpose: Server-side callback endpoint to handle provider redirects for code-based flows (e.g., GitHub)
- If you prefer server-side code exchange, implement this route and make sure the frontend popup can close and signal success back to the parent (the frontend expects a redirect to `/oauth/callback/:service`).

---

## 4) Scopes & validation

- Always respect the `scopes` published in `/api/core/about.json` for each service.
- When validating provider tokens, ensure they are issued for the expected client/app (check `aud`/`azp` fields when available).
- For Google: prefer calling `https://www.googleapis.com/oauth2/v3/userinfo` to retrieve user email and profile; for token introspection use `https://oauth2.googleapis.com/tokeninfo?access_token=...`.
- If you need refresh tokens on server side (to call provider APIs from server), implement the full OAuth Authorization Code flow and persist refresh tokens. The Google Identity Services popup implicit token flows often don't return refresh tokens—prefer code flow if long-term access is required.

---

## 5) Token storage & lifecycle

- Store access tokens and refresh tokens encrypted at rest (e.g., use KMS or environment-based encryption keys).
- Store `expires_at` for each stored token and implement a scheduled job (Celery/cron) to refresh tokens if refresh_token is available.
- If a refresh fails (revoke/invalid), mark service as disconnected and notify user accordingly.

---

## 6) Frontend expectations (summary)

- `GET /api/core/about.json` must exist and return `server.services` as shown.
- `POST /api/auth/google/` must accept a Google access token from the frontend and return AREA tokens.
- `POST /api/oauth/{service}/complete/` must accept provider tokens (or exchange codes) and store provider credentials.
- `GET /api/oauth/status/` must return a map of connection statuses keyed by service name.
- `DELETE /api/oauth/{service}/disconnect/` must remove stored credentials for that service and user.

Naming note: the frontend code expects to call logical API functions named `areasAPI.about()`, `authAPI.googleLogin()`, and `oauthAPI.completeOAuth(service, token)` / `oauthAPI.getConnectionStatus()` / `oauthAPI.disconnectService(service)`; adapt your backend paths to match these logical operations (examples above).

---

## 7) Security & operational notes

- Always require valid AREA access tokens (Bearer) to view/modify OAuth connection status or stored tokens.
- Use HTTPS in production, and set appropriate CORS and CSP headers.
- Rate-limit token validation calls if needed.
- Log OAuth errors and token refresh failures for monitoring.

---

## 8) Quick curl examples

- About:
```bash
curl -s "https://api.example.com/api/core/about.json" | jq
```

- Google social login (frontend flow sends google token to backend):
```bash
curl -X POST -H "Content-Type: application/json" -d '{"access_token":"<google-token>"}' https://api.example.com/api/auth/google/
```

- Complete OAuth for service (frontend to backend after obtaining provider access token):
```bash
curl -X POST -H "Authorization: Bearer <AREA_TOKEN>" -H "Content-Type: application/json" -d '{"access_token":"<provider-token>"}' https://api.example.com/api/oauth/google/complete/
```

- Get connection status:
```bash
curl -H "Authorization: Bearer <AREA_TOKEN>" https://api.example.com/api/oauth/status/
```

- Disconnect service:
```bash
curl -X DELETE -H "Authorization: Bearer <AREA_TOKEN>" https://api.example.com/api/oauth/google/disconnect/
```

---

If you want I can also:
- Provide a Django/DRF view skeleton and serializers for rapid backend implementation.
- Add unit test templates for these endpoints.

Tell me which you'd prefer next and I will add it in the repository. 