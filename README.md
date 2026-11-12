# UF DSI Website

## Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm)
- [Git](https://git-scm.com/)
- [Git LFS](https://git-lfs.github.com/)

## Cloning the Repository

```bash
git clone https://github.com/harryytsao/ufdsi.com.git
cd ufdsi.com
git lfs install
```

## Development Setup

```bash
npm install
npm run dev
```

## Editing the Website

- Follow coding standards and practices.
- Make changes in the `src` directory.

## Using Git LFS

- Track large files using Git LFS.
- Example: `git lfs track "*.psd"`

## Testing Changes

- Test changes locally using `npm run dev`.

## Deploying Changes

- Commit changes: `git commit -m "Your message"`
- Push changes: `git push origin main`

## Contributing

- Follow the contribution guidelines.
- Submit a pull request for review.

## Forms: load testing, email, and data retention

### Email
Form emails go through `src/lib/email.ts`. Optional env vars:
- `EMAIL_PROVIDER`: `brevo` (default) or `none` (skip sending, for load tests)
- `EMAIL_FROM`: sender address (default `noreply@dsiufl.org`); it must be a domain authenticated in Brevo

### Load test (run before big events)
1. Deploy a Vercel preview with `EMAIL_PROVIDER=none`.
2. In admin, create an **open** form with a slug starting with `loadtest-`, capacity 50, First Name / Last Name / Email fields, and (optionally) a file-upload field.
3. Run:
   ```bash
   node --env-file=.env.local scripts/loadtest/forms.mjs --base https://<preview>.vercel.app --slug loadtest-gbm3 --bypass <vercel-protection-bypass-token>
   ```
   The script simulates 100 simultaneous sign-ups, double-taps, 10MB uploads, and bad input. It checks capacity, waitlist positions, and duplicate handling in the database, then deletes its test data.

### Data retention (every May)
The [privacy policy](/privacy) promises submissions and uploads are deleted by May 31 each year:
```bash
node --env-file=.env.local scripts/purge-forms.mjs --before 2027-05-31            # dry run
node --env-file=.env.local scripts/purge-forms.mjs --before 2027-05-31 --execute  # delete
```
