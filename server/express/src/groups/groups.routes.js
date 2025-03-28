const express = require('express');
const router = express.Router();
const { createGroup, addGroupMember, removeGroupMember, removeGroup, getGroupDetails, leaveGroup, getMyGroups} = require('./groupsController');

/**
 * @openapi
 * /groups/mine:
 *   get:
 *     summary: Ver lista de mis grupos
 *     security:
 *       - bearerAuth: []
 *     description: Permite al usuario autenticado ver todos los grupos que ha creado o en los que está como integrante.
 *     tags:
 *       - Grupos
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
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       500:
 *         description: Error no definido
 */
router.get('/mine', getMyGroups);

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
 *         description: Error de validación por título faltante o inválido
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       500:
 *         description: Error no definido
 */
router.post('/', createGroup);

/**
 * @openapi
 * /groups/{groupId}/members:
 *   post:
 *     summary: Añadir integrante a un grupo por email
 *     security:
 *       - bearerAuth: []
 *     description: Permite al administrador de un grupo añadir un usuario registrado como integrante, utilizando su email.
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario a añadir al grupo
 *                 example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Usuario añadido exitosamente al grupo
 *       400:
 *         description: El usuario ya es integrante del grupo o el email no es válido
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       403:
 *         description: EL usuario no tiene permiso para realizar la operación
 *       404:
 *         description: Usuario no registrado o grupo no encontrado
 *       500:
 *         description: Error no definido
 */
router.post('/:groupId/members', addGroupMember);

/**
 * @openapi
 * /groups/{groupId}/members:
 *   delete:
 *     summary: Eliminar integrante de un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite al administrador de un grupo eliminar a un usuario de la lista de miembros enviando el userId en el body.
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
 *                 description: ID del usuario (userId) que se eliminará del grupo
 *                 example: "64ac9b7b5f8e2c001fc45abc"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente del grupo
 *       400:
 *         description: No se puede eliminar al administrador o el usuario no está en el grupo
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       403:
 *         description: EL usuario no tiene permiso para realizar la operación
 *       404:
 *         description: El grupo o el usuario no existen
 *       500:
 *         description: Error no definido
 */
router.delete('/:groupId/members', removeGroupMember);

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
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       403:
 *         description: EL usuario no tiene permiso para realizar la operación
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error no definido
 */

router.delete('/:groupId', removeGroup);


/**
 * @openapi
 * /groups/{groupId}/leave:
 *   delete:
 *     summary: Salir de un grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite al usuario autenticado salir de un grupo en el que está como integrante. El administrador no puede salir del grupo.
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
 *     responses:
 *       200:
 *         description: Usuario salió del grupo exitosamente
 *       400:
 *         description: No se puede salir del grupo si eres el propietario
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       404:
 *         description: El grupo no fue encontrado o el usuario no es miembro del grupo
 *       500:
 *         description: Error no definido
 */
router.delete('/:groupId/leave', leaveGroup);

/**
 * @openapi
 * /groups/{groupId}:
 *   get:
 *     summary: Ver detalles del grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario ver el título, la descripción y la lista de integrantes de un grupo, incluyendo el email de cada integrante.
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
 *                 isOwner:
 *                   type: boolean
 *                   example: true
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
 *                       email:
 *                         type: string
 *                         example: "juan.perez@example.com"
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       403:
 *         description: EL usuario no tiene permiso para realizar la operación
 *       404:
 *         description: No se pudieron cargar los detalles del grupo
 *       500:
 *         description: Error no definido
 */
router.get('/:groupId', getGroupDetails);

module.exports = router;