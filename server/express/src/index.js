const express = require('express');
const app = express();
const { swaggerUi, swaggerSpec } = require('./swagger');
const db = require("./database");
const syncUsersFromFirebase = require('./syncFirebase');

const cors = require('cors');

const allowedOrigins = ['http://localhost', 'http://localhost:3000', 'http://localhost:80', 'http://localhost:81'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Sincronizar usuarios desde Firebase.
(async () => {
    syncUsersFromFirebase();
})();

db.any('SELECT * FROM users')
    .then(function(data) {
        console.log(data)
    })
    .catch(function(error) {
        console.log(error);
    });


// Middleware para parsear JSON
app.use(express.json());

// Middleware para la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación
const authenticationRoutes = require('./auth/auth.routes');
app.use('/auth', authenticationRoutes);

// Rutas de grupos (creación y añadir integrantes)
const groupsRoutes = require('./groups/groups.routes');
app.use('/groups', groupsRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Levantar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
    console.log('Documentación disponible en http://localhost:3000/api-docs');
});