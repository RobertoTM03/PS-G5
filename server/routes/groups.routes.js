const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /groups:
 *   post:
 *     summary: Crear un nuevo grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario registrado crear un grupo añadiendo título y descripción opcional. El grupo quedará asociado al usuario creador (owner).
 *     tags:
 *       - Grupos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - ownerId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del grupo (obligatorio, 1 a 64 caracteres)
 *                 minLength: 1
 *                 maxLength: 64
 *                 example: Viaje a la montaña
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional del grupo
 *                 example: Grupo para planear la salida de fin de semana
 *               ownerId:
 *                 type: string
 *                 description: ID del usuario que crea el grupo (owner)
 *                 example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: string
 *                   example: "64ac9b7b5f8e2c001fc45def"
 *       400:
 *         description: Error de validación por título u ownerId faltante o inválido
 */

router.post('/', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: 'Token faltante' });
    }

    const token = authHeader.split(' ')[1]; // Nos quedamos solo con el token, quitando "Bearer "

    res.status(200).json({ msg: 'Token recibido', token });
});



/**
 * @openapi
 * /groups/{groupId}/members:
 *   post:
 *     summary: Añadir integrante a un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite al administrador de un grupo añadir un usuario registrado como integrante del grupo.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID del grupo al que se añadirá el integrante
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario a añadir al grupo
 *                 example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       200:
 *         description: Usuario añadido exitosamente al grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario fue añadido al grupo exitosamente."
 *       400:
 *         description: El usuario ya es integrante del grupo
 *       404:
 *         description: Usuario no registrado o grupo no encontrado
 */
router.post('/:groupId/members', (req, res) => {});

/**
 * @openapi
 * /groups/{groupId}/members/{userId}:
 *   delete:
 *     summary: Eliminar integrante de un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite al administrador de un grupo eliminar a un usuario de la lista de miembros.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID del grupo del cual se eliminará al integrante
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario a eliminar del grupo
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario fue eliminado del grupo exitosamente."
 *       400:
 *         description: No se puede eliminar al administrador o el usuario no está en el grupo
 *       404:
 *         description: El grupo o el usuario no existen
 */

router.delete('/:groupId/members/:userId', (req, res) => {});

/**
 * @openapi
 * /groups/{groupId}:
 *   delete:
 *     summary: Eliminar un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite al administrador eliminar un grupo completo junto con todos sus integrantes.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID del grupo que se desea eliminar
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: Grupo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El grupo fue eliminado exitosamente."
 *       403:
 *         description: Solo el administrador del grupo puede eliminarlo
 *       404:
 *         description: Grupo no encontrado
 */

router.delete('/:groupId', (req, res) => {});


/**
 * @openapi
 * /groups/{groupId}/leave:
 *   delete:
 *     summary: Salir de un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario salir de un grupo en el que está como integrante. El administrador no puede salir del grupo.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID del grupo del que se desea salir
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que desea salir del grupo
 *                 example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       200:
 *         description: Usuario salió del grupo exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Has salido del grupo exitosamente."
 *       400:
 *         description: No se puede salir del grupo si eres el propietario
 *       404:
 *         description: El grupo o el usuario no fueron encontrados
 */

router.delete('/:groupId/leave', (req, res) => {});
  
/**
 * @openapi
 * /groups/{groupId}:
 *   get:
 *     summary: Ver detalles del grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario ver el título, la descripción y la lista de integrantes de un grupo.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID del grupo cuyos detalles se desean ver
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: Detalles del grupo cargados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titulo:
 *                   type: string
 *                   example: "Viaje a la montaña"
 *                 descripcion:
 *                   type: string
 *                   example: "Grupo para planear la salida de fin de semana"
 *                 integrantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "64ac9b7b5f8e2c001fc45abc"
 *                       nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *       404:
 *         description: No se pudieron cargar los detalles del grupo
 */

router.get('/:groupId', (req, res) => {});
  
/**
 * @openapi
 * /groups/user/{userId}:
 *   get:
 *     summary: Ver lista de grupos del usuario
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario ver todos los grupos que ha creado o en los que está como integrante.
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario para obtener su lista de grupos
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       200:
 *         description: Lista de grupos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   groupId:
 *                     type: string
 *                     example: "64ac9b7b5f8e2c001fc45def"
 *                   titulo:
 *                     type: string
 *                     example: "Viaje a la montaña"
 *                   descripcion:
 *                     type: string
 *                     example: "Grupo para planear la salida de fin de semana"
 *       404:
 *         description: No se encontraron grupos asociados al usuario
 */

router.get('/user/:userId', (req, res) => {});

module.exports = router;