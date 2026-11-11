#!/usr/bin/env bash
# End-to-end deployment test against the local MyDevil stand-in.
#   test/mydevil-sim/run-e2e.sh            # scripts/deploy.sh directly
#   test/mydevil-sim/run-e2e.sh --act      # the real .github/workflows/deploy.yml through nektos/act
# Requires Docker. Uses ports 2622 (SSH) and 8692 (HTTP) on 127.0.0.1 by default.
set -euo pipefail
cd "$(dirname "$0")/../.."
REPO="$PWD"
LOGIN=ceskyfilm DOMAIN=ceskyfilm.pl
SSH_PORT="${SIM_SSH_PORT:-2622}" HTTP_PORT="${SIM_HTTP_PORT:-8692}"
NAME=mydevil-sim-e2e
WORK="$(mktemp -d)"
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT

docker build -q -t mydevil-sim test/mydevil-sim >/dev/null
ssh-keygen -q -t ed25519 -N '' -C deploy@github-actions -f "$WORK/key"
docker rm -f "$NAME" >/dev/null 2>&1 || true
docker run -d --name "$NAME" -p "127.0.0.1:$SSH_PORT:22" -p "127.0.0.1:$HTTP_PORT:80" \
  -e AUTHORIZED_KEY="$(cat "$WORK/key.pub")" mydevil-sim >/dev/null
for _ in $(seq 30); do ssh-keyscan -p "$SSH_PORT" -t ed25519 127.0.0.1 > "$WORK/known_hosts" 2>/dev/null && [ -s "$WORK/known_hosts" ] && break; sleep 0.5; done
[ -s "$WORK/known_hosts" ] || { echo "simulator did not start"; exit 1; }

ssh_sim() { ssh -p "$SSH_PORT" -i "$WORK/key" -o IdentitiesOnly=yes -o BatchMode=yes -o UserKnownHostsFile="$WORK/known_hosts" "$LOGIN@127.0.0.1" "$@"; }
pass() { echo "PASS  $*"; }
fail() { echo "FAIL  $*"; exit 1; }

echo "== negative: wrong host key is refused"
ssh-keyscan -p "$SSH_PORT" -t ed25519 127.0.0.1 2>/dev/null | sed 's/AAAA[A-Za-z0-9+\/]*/AAAAC3NzaC1lZDI1NTE5AAAAIBadKeyBadKeyBadKeyBadKeyBadKeyBadKey0000/' > "$WORK/bad_known_hosts"
if DEPLOY_HOST=127.0.0.1 DEPLOY_PORT="$SSH_PORT" DEPLOY_LOGIN=$LOGIN DEPLOY_DOMAIN=$DOMAIN \
   DEPLOY_KEY_FILE="$WORK/key" DEPLOY_KNOWN_HOSTS="$WORK/bad_known_hosts" bash scripts/deploy.sh >/dev/null 2>&1; then
  fail "deploy accepted a wrong host key"; else pass "wrong host key refused"; fi
echo "== negative: password login is disabled"
ssh -p "$SSH_PORT" -o BatchMode=yes -o PubkeyAuthentication=no -o UserKnownHostsFile="$WORK/known_hosts" "$LOGIN@127.0.0.1" true 2>/dev/null && fail "password/no-key login worked" || pass "login without key refused"

run_deploy() {
  if [[ "${1:-}" == --act ]]; then
    command -v act >/dev/null || { echo "act not installed (https://github.com/nektos/act)"; exit 1; }
    # act runs the job in a container; the simulator is reached through the Docker host gateway.
    local gw; gw="$(docker network inspect bridge -f '{{(index .IPAM.Config 0).Gateway}}')"
    ssh-keyscan -p "$SSH_PORT" -t ed25519 "$gw" > "$WORK/known_hosts_act" 2>/dev/null
    act push -W .github/workflows/deploy.yml -j deploy --pull=false \
      -P ubuntu-latest=catthehacker/ubuntu:act-22.04 \
      --var MYDEVIL_HOST="$gw" --var MYDEVIL_PORT="$SSH_PORT" --var MYDEVIL_LOGIN=$LOGIN \
      --var MYDEVIL_DOMAIN=$DOMAIN --var SITE_URL="http://$gw:$HTTP_PORT" \
      --secret MYDEVIL_SSH_KEY="$(cat "$WORK/key")" \
      --secret MYDEVIL_KNOWN_HOSTS="$(cat "$WORK/known_hosts_act")" \
      --env GITHUB_SHA="$(git rev-parse HEAD)"
  else
    node scripts/build.mjs >/dev/null
    BUILD_COMMIT=e2e DEPLOY_HOST=127.0.0.1 DEPLOY_PORT="$SSH_PORT" DEPLOY_LOGIN=$LOGIN DEPLOY_DOMAIN=$DOMAIN \
      DEPLOY_KEY_FILE="$WORK/key" DEPLOY_KNOWN_HOSTS="$WORK/known_hosts" DEPLOY_PURGE_CACHE=1 \
      bash scripts/deploy.sh
  fi
}

echo "== first deploy"
run_deploy "${1:-}"
DOCROOT="/usr/home/$LOGIN/domains/$DOMAIN/public_html"
ssh_sim "test -f $DOCROOT/index.html && test -f $DOCROOT/en/index.html && test -f $DOCROOT/assets/js/menu-data.js" && pass "files in $DOCROOT"
ssh_sim "test -f $DOCROOT/.well-known/acme-challenge/token" && pass ".well-known kept" || fail ".well-known deleted"
curl -fsS "http://127.0.0.1:$HTTP_PORT/" | grep -q "Český Film" && pass "HTTP serves the site" || fail "HTTP"
curl -fsS "http://127.0.0.1:$HTTP_PORT/assets/js/menu-data.js" | grep -q "WYGENEROWANE" && pass "generated menu published" || fail "menu"
ssh_sim "grep -q 'www options $DOMAIN cache purge' ~/devil.log" && pass "cache purge called" || fail "cache purge not called"

echo "== second deploy after a content change (simulated CMS commit)"
cp content/cesky-film.json "$WORK/content.bak"
node -e 'const f="content/cesky-film.json",fs=require("fs");const d=JSON.parse(fs.readFileSync(f));d.menus.food.categories[0].items[0].name="E2E zmiana z panelu";fs.writeFileSync(f,JSON.stringify(d,null,2)+"\n")'
ssh_sim "echo stale > $DOCROOT/old-file.html"
run_deploy "${1:-}" ; cp "$WORK/content.bak" content/cesky-film.json
curl -fsS "http://127.0.0.1:$HTTP_PORT/assets/js/menu-data.js" | grep -q "E2E zmiana z panelu" && pass "content change visible over HTTP" || fail "change not visible"
ssh_sim "test ! -e $DOCROOT/old-file.html" && pass "removed files deleted" || fail "stale file left"
ssh_sim "ls /usr/home/$LOGIN/domains/$DOMAIN/deploy-backups | grep -q ." && pass "previous version backed up" || fail "no backup"
ssh_sim "find /usr/home/$LOGIN/domains/$DOMAIN/deploy-backups -name menu-data.js | grep -q ." && pass "backup contains replaced files"
echo "ALL CHECKS PASSED"
