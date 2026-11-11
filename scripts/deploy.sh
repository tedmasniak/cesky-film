#!/usr/bin/env bash
# Uploads a built site (dist/) to MyDevil over SSH.
#
# Required environment:
#   DEPLOY_HOST          SSH host, e.g. s67.mydevil.net
#   DEPLOY_LOGIN         MyDevil account login
#   DEPLOY_DOMAIN        website added in DevilWEB, e.g. ceskyfilm.pl
#   DEPLOY_KEY_FILE      private key file (its public key is in ~/.ssh/authorized_keys)
#   DEPLOY_KNOWN_HOSTS   file with the server host key (ssh-keyscan output, verified)
# Optional:
#   DEPLOY_PORT          default 22
#   DEPLOY_PATH          default /usr/home/$DEPLOY_LOGIN/domains/$DEPLOY_DOMAIN/public_html
#   DEPLOY_METHOD        rsync (default) | sftp   (sftp needs lftp; for accounts without rsync)
#   DEPLOY_PURGE_CACHE   1 = run "devil www options DOMAIN cache purge" after upload
#   DEPLOY_KEEP_BACKUPS  number of previous versions kept on the server (default 5, rsync only)
#   DEPLOY_PROTECT       space-separated server paths never deleted (default ".well-known/ errors/")
#   DEPLOY_DRY_RUN       1 = show what would change, change nothing
#   DEPLOY_SOURCE        default dist
set -euo pipefail

: "${DEPLOY_HOST:?missing}" "${DEPLOY_LOGIN:?missing}" "${DEPLOY_DOMAIN:?missing}"
: "${DEPLOY_KEY_FILE:?missing}" "${DEPLOY_KNOWN_HOSTS:?missing}"
PORT="${DEPLOY_PORT:-22}"
SOURCE="${DEPLOY_SOURCE:-dist}"
METHOD="${DEPLOY_METHOD:-rsync}"
KEEP="${DEPLOY_KEEP_BACKUPS:-5}"
PROTECT="${DEPLOY_PROTECT:-.well-known/ errors/}"
DOMAIN_DIR="/usr/home/${DEPLOY_LOGIN}/domains/${DEPLOY_DOMAIN}"
TARGET="${DEPLOY_PATH:-${DOMAIN_DIR}/public_html}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_ROOT="$(dirname "$TARGET")/deploy-backups"

[[ "$DEPLOY_LOGIN" =~ ^[a-z0-9_-]+$ ]] || { echo "Invalid DEPLOY_LOGIN" >&2; exit 1; }
[[ "$DEPLOY_DOMAIN" =~ ^[a-z0-9.-]+$ ]] || { echo "Invalid DEPLOY_DOMAIN" >&2; exit 1; }
[[ "$TARGET" == /usr/home/"$DEPLOY_LOGIN"/* ]] || { echo "DEPLOY_PATH must be inside /usr/home/$DEPLOY_LOGIN" >&2; exit 1; }
[[ "$TARGET" != *..* ]] || { echo "DEPLOY_PATH must not contain .." >&2; exit 1; }
[[ -f "$SOURCE/index.html" ]] || { echo "No $SOURCE/index.html — run the build first" >&2; exit 1; }

SSH_OPTS=(-p "$PORT" -i "$DEPLOY_KEY_FILE" -o IdentitiesOnly=yes -o BatchMode=yes
  -o StrictHostKeyChecking=yes -o UserKnownHostsFile="$DEPLOY_KNOWN_HOSTS"
  -o ConnectTimeout=20 -o ServerAliveInterval=15)
REMOTE="${DEPLOY_LOGIN}@${DEPLOY_HOST}"
remote() { ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"; }
q() { printf '%q' "$1"; }  # quoting for the remote shell (bash on MyDevil)

echo "Deploy $SOURCE -> $REMOTE:$TARGET ($METHOD)"
# The website directory must already exist (created by DevilWEB / "devil www add").
remote "test -d $(q "$DOMAIN_DIR") || { echo 'Domain directory not found: $DOMAIN_DIR (add the website in DevilWEB first)' >&2; exit 3; }; mkdir -p $(q "$TARGET")"

if [[ "$METHOD" == rsync ]]; then
  remote "command -v rsync >/dev/null" || { echo "rsync is not available on the server; set DEPLOY_METHOD=sftp" >&2; exit 4; }
  FILTERS=()
  for p in $PROTECT; do FILTERS+=(--filter="P /$p"); done
  DRY=()
  [[ "${DEPLOY_DRY_RUN:-0}" == 1 ]] && DRY=(--dry-run)
  # --delay-updates: new files are moved into place at the end, so visitors do not
  # see a half-uploaded site; --backup-dir keeps every replaced/deleted file.
  rsync -rlt --checksum --delete-after --delay-updates --itemize-changes \
    --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
    --backup --backup-dir="$BACKUP_ROOT/$STAMP" \
    "${FILTERS[@]}" "${DRY[@]}" \
    -e "ssh ${SSH_OPTS[*]}" "$SOURCE"/ "$REMOTE:$TARGET/"
  if [[ "${DEPLOY_DRY_RUN:-0}" != 1 ]]; then
    # Keep the newest $KEEP backups.
    remote "cd $(q "$BACKUP_ROOT") 2>/dev/null && ls -1 | sort -r | tail -n +$((KEEP + 1)) | while read -r d; do rm -rf -- \"\$d\"; done; true"
  fi
elif [[ "$METHOD" == sftp ]]; then
  command -v lftp >/dev/null || { echo "lftp is required for DEPLOY_METHOD=sftp" >&2; exit 4; }
  EXCLUDES=""
  for p in $PROTECT; do EXCLUDES+=" --exclude ^${p}"; done
  DRY=""
  [[ "${DEPLOY_DRY_RUN:-0}" == 1 ]] && DRY="--dry-run"
  lftp -e "set sftp:connect-program 'ssh -a -x ${SSH_OPTS[*]}'; set net:max-retries 2; mirror --reverse --delete --overwrite --parallel=4 $DRY $EXCLUDES $SOURCE/ $TARGET/; bye" \
    "sftp://$REMOTE:$PORT" -u "$DEPLOY_LOGIN,"
else
  echo "Unknown DEPLOY_METHOD=$METHOD" >&2; exit 1
fi

if [[ "${DEPLOY_PURGE_CACHE:-0}" == 1 && "${DEPLOY_DRY_RUN:-0}" != 1 ]]; then
  remote "devil www options $(q "$DEPLOY_DOMAIN") cache purge" || echo "warning: cache purge failed" >&2
fi
remote "test -f $(q "$TARGET/index.html")"
echo "Deploy finished: $STAMP"
