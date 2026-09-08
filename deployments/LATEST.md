# Rosetta deployment ledger

## Latest preview

- Deployed: 2026-09-08 UTC
- Environment: Cloudflare Pages preview (`codex/rosetta-browser-release`)
- Deployment ID: `ef2928fa-rosettaphillips-site` (preview URL deployment `https://ef2928fa.rosettaphillips-site.pages.dev`)
- Portfolio source SHA: `fc214f76cf97c8b5e9e1738eb849b0919c794457`
- Reel Recall source SHA: `d66b22fcb8175a3fd1c06eb8f6a5e0e082939699`
- Pet Portrait source SHA: `afaf3b30c06bdcc8684252a853a9e454da4a06a1`
- Rollback production deployment ID: `1ec62523-1da3-42e0-bb52-43c827583714`
- Packaging evidence: clean immutable Reel Recall and Pet Portrait worktrees, manifest source-dirty flags false, and `rosetta package test passed`
- HTTP evidence: `/pet-portrait/`, privacy/support routes, `/reel-recall/`, and `/reel-recall/rush/` returned HTTP 200
- Browser evidence: pending because the local Mac was locked when browser automation was attempted; production (`MASTER`) was not changed

## Previous preview

- Deployed: 2026-09-08 UTC
- Environment: Cloudflare Pages preview (`codex/rosetta-browser-release`)
- Deployment ID: `8082f02d-db37-4d69-bced-2024d50d66f3`
- Preview URL: https://8082f02d.rosettaphillips-site.pages.dev
- Portfolio source SHA: `fc214f76cf97c8b5e9e1738eb849b0919c794457`
- Reel Recall source SHA: `edc237c457802194a2f0367250333d5418209d74`
- Rollback production deployment ID: `1ec62523-1da3-42e0-bb52-43c827583714`
- Packaging evidence: clean immutable Reel Recall clone, manifest SHA-256 digests, `rosetta package test passed`
- Browser evidence: root, direct Solo route, and Rush reconnect route loaded successfully with no console errors

This preview serves the verified Reel Recall request in `projects/reel-recall/DEPLOY_REQUEST.md`. Production (`MASTER`) was not changed.
