
# Einleitung
React native Demo für die Erfassung und Speicherung von Zitaten. Die Zitate werden in Firebase - Firestone Datenbank gespeichert. 

# Installationsanleitung

1. Anlage der Datei js/Firebase.js mit der persönlichen Firebase konfiguration, gem. dem nachstehenden Beispiel:

```
import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

export default class Firebase {
    static db;

    static init() {
        firebase.initializeApp(firebaseConfig);
        Firebase.db = firebase.firestore();
    }
}
```