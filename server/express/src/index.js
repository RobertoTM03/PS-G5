const express = require('express');
const { swaggerUi, swaggerSpec } = require('./swagger');

const syncUsersFromFirebase = require('./shared/syncFirebase');
const errorHandler = require("./errorHandler");


const app = express();
const db = require("./shared/database");
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

try {
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
} catch (err) {
    console.error ("Database connection error");
}



// Middleware para parsear JSON
app.use(express.json());

// Middleware para la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación
const authenticationRoutes = require('./auth/auth.routes');
app.use('/auth', authenticationRoutes);

// Rutas de grupos
const groupsRoutes = require('./groups/groups.routes');
app.use('/groups', groupsRoutes);

// Rutas de gastos
const expenseRoutes = require('./expenses/expenses.routes');
app.use('/groups', expenseRoutes);

// rutas de actividades de un grupo
const calendarRoutes = require('./calendar/calendar.routes');
app.use('/groups', calendarRoutes);

// rutas de actividades de un grupo
const mapRoutes = require('./map/map.routes');
app.use('/groups', mapRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});


app.use(errorHandler)

// Levantar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
    console.log('Documentación disponible en http://localhost:3000/api-docs');
});