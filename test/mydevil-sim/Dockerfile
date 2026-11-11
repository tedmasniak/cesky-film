# Local stand-in for a MyDevil account, for testing deployment only.
# Reproduces what the MyDevil documentation states and what we observed:
#   - OpenSSH on port 22, key login for the account user;
#   - home directory /usr/home/LOGIN, websites in ~/domains/DOMAIN/public_html;
#   - bash as login shell;
#   - a "devil" command (stub: logs calls, supports "www options DOMAIN cache purge");
#   - NGINX serving public_html.
# It does NOT reproduce FreeBSD, their transparent cache, .htaccess module, quotas or 2FA.
FROM debian:bookworm-slim
ARG LOGIN=ceskyfilm
ARG DOMAIN=ceskyfilm.pl
RUN apt-get update -qq \
 && apt-get install -y -qq --no-install-recommends openssh-server rsync nginx bash ca-certificates \
 && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /usr/home /run/sshd \
 && useradd --create-home --home-dir /usr/home/${LOGIN} --shell /bin/bash ${LOGIN} \
 && usermod -p '*' ${LOGIN} \
 && mkdir -p /usr/home/${LOGIN}/domains/${DOMAIN}/public_html /usr/home/${LOGIN}/domains/${DOMAIN}/logs /usr/home/${LOGIN}/.ssh \
 && printf '<!doctype html><title>Default</title><p>Strona w trakcie konfiguracji.</p>\n' > /usr/home/${LOGIN}/domains/${DOMAIN}/public_html/index.html \
 && mkdir -p /usr/home/${LOGIN}/domains/${DOMAIN}/public_html/.well-known/acme-challenge \
 && echo keep > /usr/home/${LOGIN}/domains/${DOMAIN}/public_html/.well-known/acme-challenge/token \
 && chown -R ${LOGIN}:${LOGIN} /usr/home/${LOGIN} && chmod 700 /usr/home/${LOGIN}/.ssh && chmod 711 /usr/home/${LOGIN}
COPY devil /usr/local/bin/devil
COPY sshd_config /etc/ssh/sshd_config
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /usr/local/bin/devil /entrypoint.sh \
 && printf 'server {\n  listen 80 default_server;\n  root /usr/home/%s/domains/%s/public_html;\n  index index.html;\n  location / { try_files $uri $uri/ =404; }\n}\n' "${LOGIN}" "${DOMAIN}" > /etc/nginx/sites-available/default
ENV LOGIN=${LOGIN} DOMAIN=${DOMAIN}
EXPOSE 22 80
ENTRYPOINT ["/entrypoint.sh"]
