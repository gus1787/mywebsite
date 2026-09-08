# Rosetta site packaging

Run the reproducible packager from the `codex/rosetta-browser-release` checkout:

```sh
export PATH=/Users/gusphillips/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/gusphillips/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH
ROSETTA_ROLLBACK_DEPLOYMENT_ID=1ec62523-1da3-42e0-bb52-43c827583714 node rosetta/package-site.mjs --out=rosetta/generated
node rosetta/test-package-site.mjs
pnpm dlx wrangler@4.129.0 pages deploy rosetta/generated --project-name rosettaphillips-site --branch codex/rosetta-browser-release
# After the preview has been checked by the parent workflow:
pnpm dlx wrangler@4.129.0 pages deploy rosetta/generated --project-name rosettaphillips-site --branch MASTER
```

The generated directory is ignored and contains the tracked portfolio snapshot, the Rosetta homepage, the current Reel Recall `dist`, explicit route redirects, and `rosetta-manifest.json` with source SHAs and SHA-256 asset digests. Keep `CNAME` out of uploads so this workflow cannot change `gusphillips.com`. Set `ROSETTA_ROLLBACK_DEPLOYMENT_ID` to the currently live production deployment before packaging; the manifest records that exact rollback target for the next upload.
