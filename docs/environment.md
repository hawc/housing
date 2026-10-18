# Environment configuration

Use `.env.local` locally and the hosting provider's environment settings in production.
The separate research worker needs its own environment (see [research.md](research.md)).
The root `.env.example` contains placeholders for the variables used by the application.
All `.env*` files except that template are ignored, including `.env.production` and backups.
Git's ignore rules do not protect files that were already tracked.

Keep `DATABASE_URL`, `AUTH0_SECRET`, `AUTH0_CLIENT_SECRET`, `OPENAI_API_KEY` and
`CLOUDINARY_API_SECRET` on the server. `ADMIN_USER_SUBS` is also server configuration.
Do not put any of these into a `NEXT_PUBLIC_` variable, a committed file, a log or a screenshot.
If a real credential ever reaches Git history, revoke/rotate it; moving it into `.env`
afterwards does not remove the exposed credential.

`BASE_URL` is the site's canonical URL, including the scheme. `APP_BASE_URL` is the
application origin used for authentication and admin request checks. Set both to the
deployed HTTPS origin in production.

`NEXT_PUBLIC_MAPBOX_API_TOKEN` and `NEXT_PUBLIC_CESIUM_TOKEN` are deliberately delivered
to visitors. Use separate browser tokens with allowed website origins and the minimum
read permissions/assets required by the maps. Environment variables help configuration,
but cannot hide a token used by the browser. Cloudinary's cloud name and API key are
identifiers; its API secret must stay private.

The Formspree form ID is a public destination, not a secret. Optionally set
`NEXT_PUBLIC_FORMSPREE_FORM_ID`; leaving it unset preserves the existing contact form.
`NEXT_PUBLIC_SHOW_LOGGER` controls the production logger. The old container ID/URL
variables are unused and need not be copied.
