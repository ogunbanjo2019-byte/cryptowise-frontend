# Connect the separate frontend and backend

These folders are separate projects: deploy this static frontend to Vercel and deploy `cryptowise-backend` independently to Render. The frontend calls the backend origin configured in `api/config.js`.

## Local connection

1. In the backend folder, configure its Firebase secrets and CORS allowlist, then start it on `http://localhost:10000`.
2. In Firebase Console, enable the chosen Authentication provider (email/password for the current UI) and add the frontend domain to Authorized domains.
3. Copy only the Firebase Web App config fields into `api/config.js`. These web config values are public client identifiers. Never put the Firebase Admin service-account JSON or any wallet private key in this folder.
4. Start the frontend on a local static server. Customer sign-up/sign-in obtains Firebase ID tokens and the API client sends them as Bearer tokens. The admin sign-in requires Firebase custom claims and uses session persistence.

## After the backend is hosted on Render

Replace `baseUrl` in `api/config.js` from `http://localhost:10000` to the Render service origin, e.g. `https://your-api-name.onrender.com`. Change the backend `CORS_ORIGINS` setting to the exact deployed frontend origin. Redeploy the static frontend. If API routes change, update `api/client.js` and the backend together.

## Current integration limits

`LIVE_FUNDS_ENABLED` is false by default, so deposit and withdrawal submission is blocked. The backend has manual-review code but does not independently verify chain transactions, sign or broadcast withdrawals, or include custody. There is no matching engine yet; `TRADING_ENABLED` is a reserved flag, not an implemented feature. KYC provider integration and compliance workflows are also not yet connected. Do not enable live deposits, withdrawals, or trading until these components and external reviews are complete.
