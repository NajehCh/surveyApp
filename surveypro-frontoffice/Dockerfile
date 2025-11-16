# Utilise une image Node légère
FROM node:22-alpine

# Crée le répertoire de travail
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances et Angular CLI
RUN npm install -g @angular/cli && npm install

# Copie tout le reste du projet
COPY . .

# Expose le port Angular
EXPOSE 4209

# Commande pour démarrer Angular en mode dev accessible depuis l’extérieur sur le port 4209
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4209"]
