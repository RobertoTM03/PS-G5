const admin = require('./firebase');  // Firebase Admin
const db = require('./database');

async function syncUsersFromFirebase() {
    try {
        let nextPageToken;

        do {
            // Listar los primeros 1000 usuario y obtener token para la siguiente página.
            const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

            for (const firebaseUser of listUsersResult.users) {
                const { uid, email, displayName } = firebaseUser;

                // Verifica si el usuario ya existe en PostgreSQL
                const userExists = await db.oneOrNone('SELECT id FROM users WHERE firebase_uid = $1', [uid]);

                if (!userExists) {
                    await db.none(
                        'INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3)',
                        [displayName || 'Sin Nombre', email || 'no-email@firebase.com', uid]
                    );
                }
            }

            nextPageToken = listUsersResult.pageToken;
        } while (nextPageToken);

        console.log('Sincronización desde Firebase completada.');
    } catch (error) {
        console.error('Error sincronizando usuarios:', error);
    }
}

module.exports = syncUsersFromFirebase;