# CryptoWise frontend

Responsive plain HTML/CSS/JavaScript frontend. The customer and staff/admin screens are separate within the frontend, and the API is maintained as a separate project/repository.

## Run locally

Run a static server from this directory, e.g. `python3 -m http.server 8000`. Open `/` for the marketing site, `/app.html` for the customer platform, `/admin/` for staff sign-in, and `/admin/dashboard.html` for the admin console preview.

## Deploy frontend

Deploy this folder as a static site on Vercel (Other framework, project root output; no build command). The API is **not** included in this folder. Deploy it independently from the `cryptowise-backend` project on Render. When ready to connect them, configure the frontend API base URL and Firebase web client configuration, and set the backend CORS allowlist to the exact frontend origin. Do not include Firebase Admin service credentials or wallet keys in the frontend.

## Deposit flow status

The customer wallet links to an authenticated deposit page that reads instructions and the signed-in user's own deposit requests from the API. The admin console includes a read-only deposit-operations view. In the current backend release, deposit instructions have no active addresses, the submission form remains hidden, and chain verification/crediting is hard-blocked. Do not accept customer funds until the backend chain monitor, attribution, reconciliation, custody, compliance, and recovery controls are complete.

Other balances, market data, and much of the activity/admin interface remain illustrative preview data. Withdrawals and trades are not live.
