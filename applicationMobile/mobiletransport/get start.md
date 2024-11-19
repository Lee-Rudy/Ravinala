ref link : https://demos.creative-tim.com/argon-react-native/docs/#/install

npm install -g expo-cli
npm install --force
npm install axios --force
expo start

application to apk :

Si tu n’as pas de compte Expo, crée-en un ici.
Ensuite, connecte-toi dans le terminal :

cmd : eas login


eas build:configure

Cela va créer un fichier eas.json dans ton projet avec des configurations de build par défaut.

lancer la création de l'apk : eas build -p android --profile production
(Sélectionne "apk" comme format de build (EAS te le demandera si ce n’est pas déjà configuré).)

Télécharge ton APK :

Une fois la build terminée (cela peut prendre quelques minutes), Expo te donnera un lien pour télécharger l’APK directement depuis leur site.

bdd============================
water melon DB 
ou
sqlite

water melon : npm install @nozbe/watermelondb @nozbe/with-observables --force

sqlite : npm install react-native-sqlite-storage --legacy-peer-deps
npm audit fix --force
