# Utilise une image Node légère
FROM node:22

# Crée le répertoire de travail
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install -g @angular/cli && npm install

# Copie tout le reste du projet
COPY . .

# Fix permissions sur le cache Angular
RUN mkdir -p /usr/src/app/.angular/cache && \
    chown -R node:node /usr/src/app/.angular

# Expose le port Angular
EXPOSE 4200

# Commande pour démarrer Angular en mode dev accessible depuis l’extérieur
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
