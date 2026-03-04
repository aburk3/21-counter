#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repository."
  exit 1
fi

staged_files=$(git diff --cached --name-only)
if [[ -z "${staged_files}" ]]; then
  echo "No staged files to validate."
  exit 0
fi

echo "Checking staged files and staged diff for secrets..."

blocked_file_regex='(^|/)\.env($|\.)|\.(pem|key|p12|pfx)$|service-account.*\.json$|id_rsa(\.pub)?$|db\.sqlite3$'
if echo "${staged_files}" | rg -n --pcre2 "${blocked_file_regex}" >/dev/null; then
  echo "Blocked file type detected in staged files:"
  echo "${staged_files}" | rg -n --pcre2 "${blocked_file_regex}" || true
  exit 1
fi

staged_diff=$(git diff --cached -U0)
secret_pattern='AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_\-]{35}|-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,}|ghp_[0-9A-Za-z]{36}|github_pat_[0-9A-Za-z_]{20,}|(DJANGO_SECRET_KEY|GOOGLE_OAUTH_CLIENT_SECRET|EMAIL_HOST_PASSWORD)\s*[=:]\s*["'"'"']?[A-Za-z0-9_\-+/=]{12,}'
if echo "${staged_diff}" | rg -n --pcre2 "${secret_pattern}" >/dev/null; then
  echo "Potential secret detected in staged diff. Remove it before committing."
  echo "Hint: run 'git diff --cached' and rotate leaked credentials."
  exit 1
fi

echo "Staged security checks passed."
