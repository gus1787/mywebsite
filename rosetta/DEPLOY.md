# Rosetta site packaging

Run the reproducible packager from the `codex/rosetta-browser-release` checkout:

```sh
export PATH=/Users/gusphillips/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/gusphillips/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH
node rosetta/package-site.mjs --out=rosetta/generated
node rosetta/test-package-site.mjs
pnpm dlx wrangler@4.129.0 pages deploy rosetta/generated --project-name rosettaphillips-site --branch codex/rosetta-browser-release
# After the preview has been checked by the parent workflow:
pnpm dlx wrangler@4.129.0 pages deploy rosetta/generated --project-name rosettaphillips-site --branch MASTER
```

The generated directory is ignored and contains the tracked portfolio snapshot, the Rosetta homepage, the current Reel Recall `dist`, explicit route redirects, and `rosetta-manifest.json` with source SHAs and SHA-256 asset digests. Keep `CNAME` out of uploads so this workflow cannot change `gusphillips.com`. To roll back, redeploy the prior Cloudflare deployment `473a7b39-07de-4c6b-9913-b37e020c38eb` using the Cloudflare dashboard or its documented deployment rollback flow.
