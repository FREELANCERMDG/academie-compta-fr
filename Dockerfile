# Image de déploiement de la plateforme e-learning (Node natif, sans dépendance)
FROM node:24-slim
WORKDIR /app
# Contenu de la formation (servi sur /formation) + application
COPY site ./site
COPY platform ./platform
# Leçons sources (.md) lues au runtime pour les aperçus de modules (/apercu, module gratuit)
COPY modules ./modules
# Dépendance runtime (génération des QR codes 2FA)
RUN cd platform && npm install --omit=dev --no-audit --no-fund
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
WORKDIR /app/platform
# data.db est créé au démarrage. En production, monter un volume persistant sur /app/platform.
CMD ["node", "server.mjs"]
