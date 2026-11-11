#!/bin/bash
set -e
# Host key is generated per container; tests read it with ssh-keyscan, exactly like
# the administrator would for the real server (then compare with pomoc.mydevil.net/Fingerprint/).
[ -f /etc/ssh/ssh_host_ed25519_key ] || ssh-keygen -q -t ed25519 -N '' -f /etc/ssh/ssh_host_ed25519_key
if [ -n "$AUTHORIZED_KEY" ]; then
  printf '%s\n' "$AUTHORIZED_KEY" > "/usr/home/$LOGIN/.ssh/authorized_keys"
  chown "$LOGIN:$LOGIN" "/usr/home/$LOGIN/.ssh/authorized_keys"
  chmod 600 "/usr/home/$LOGIN/.ssh/authorized_keys"
fi
nginx
exec /usr/sbin/sshd -D -e
