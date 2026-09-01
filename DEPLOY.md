# Deploying VeylSMP to Vercel

This site is a TanStack Start app (server-side rendering + server functions), so it
needs a runtime — not static hosting. Vercel supports it out of the box.

## 1. Get the code to GitHub

In Lovable: **GitHub → Connect / Export to GitHub**. This pushes the whole project.

## 2. Import the repo on Vercel

1. vercel.com → **Add New… → Project → Import Git Repository**
2. Framework preset: **Other** (no change needed)
3. Build command: `npm run build`
4. Output: leave default — the build auto-detects Vercel and emits the correct
   serverless output (`.vercel/output`). No config file required.

## 3. Environment variables (Project → Settings → Environment Variables)

Add these for Production **and** Preview:

| Name                            | Value                                              |
| ------------------------------- | -------------------------------------------------- |
| `SUPABASE_URL`                  | `https://pabqvsbyadzaqugjrpjz.supabase.co`         |
| `SUPABASE_PUBLISHABLE_KEY`      | `sb_publishable_e_BTqQAJimdhpmzRf6pYwQ_kAcoqd3L`   |
| `VITE_SUPABASE_URL`             | `https://pabqvsbyadzaqugjrpjz.supabase.co`         |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_e_BTqQAJimdhpmzRf6pYwQ_kAcoqd3L`   |
| `VITE_SUPABASE_PROJECT_ID`      | `pabqvsbyadzaqugjrpjz`                             |

These are publishable keys — safe to expose. The site never uses a secret
service-role key, so nothing else is required.

## 4. Allow the new domain for Google sign-in

After the first deploy, send me the Vercel URL (e.g. `veylsmp.vercel.app`) and any
custom domain. I'll add them to the backend's allowed redirect URLs, otherwise
`/admin` Google login will bounce back with a redirect error.

## Notes

- The database, auth and storage stay on the Lovable Cloud backend; Vercel only
  hosts the app. It keeps working exactly as it does now.
- GitHub Pages will **not** work for this site: it can't run SSR or server
  functions, which is why the pages showed up blank there.
- Redeploys happen automatically on every push to the connected branch.
