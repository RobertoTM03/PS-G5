const express = require('express');
const endpointDePrueba = require('./calendarController');
const router = express.Router();

/**
 * @openapi
 * /groups/{groupId}/activities:
 *   post:
 *     summary: Añadir una actividad al calendario del grupo
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un integrante del grupo añadir una actividad con fecha de inicio y fin.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - fechaInicio
 *               - fechaFin
 *             properties:
 *               titulo:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Actividad añadida exitosamente
 */
router.post('/:groupId/activities', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   get:
 *     summary: Obtener detalles de una actividad del calendario
 *     security:
 *       - bearerAuth: []
 *     description: Devuelve los detalles de una actividad, incluyendo la lista de participantes.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66304650b012fd001e53d7cb"
 *     responses:
 *       200:
 *         description: Detalles de la actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 fechaInicio:
 *                   type: string
 *                   format: date-time
 *                 fechaFin:
 *                   type: string
 *                   format: date-time
 *                 participantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       email:
 *                         type: string
 *       404:
 *         description: Actividad no encontrada
 */
router.get('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   put:
 *     summary: Editar una actividad del calendario
 *     security:
 *       - bearerAuth: []
 *     description: Permite modificar los detalles de una actividad existente del grupo.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66304650b012fd001e53d7cb"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Reunión de revisión"
 *               descripcion:
 *                 type: string
 *                 example: "Cambio de objetivos para la semana"
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-28T14:00:00Z"
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-28T15:00:00Z"
 *               ubicacion:
 *                 type: string
 *                 example: "Sala 3 o Google Meet"
 *     responses:
 *       200:
 *         description: Actividad actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   delete:
 *     summary: Eliminar una actividad del calendario del grupo
 *     security:
 *       - bearerAuth: []
 *     description: Elimina una actividad específica del calendario del grupo.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actividad eliminada correctamente
 *       404:
 *         description: Actividad no encontrada
 */
router.delete('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/join:
 *   post:
 *     summary: Unirse a una actividad del calendario
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un integrante del grupo unirse a una actividad para participar en ella.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66304650b012fd001e53d7cb"
 *     responses:
 *       200:
 *         description: Usuario añadido como participante del evento
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: Solicitud inválida
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:groupId/activities/:activityId/join', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/participants:
 *   delete:
 *     summary: Eliminar un participante de una actividad
 *     security:
 *       - bearerAuth: []
 *     description: Permite eliminar a un participante específico de una actividad mediante su ID, enviado en el cuerpo.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *             properties:
 *               participantId:
 *                 type: string
 *                 example: "66304865b012fd001e53d7e9"
 *     responses:
 *       200:
 *         description: Participante eliminado correctamente
 *       404:
 *         description: Participante o actividad no encontrada
 *       400:
 *         description: ID inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:groupId/activities/:activityId/participants', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/leave:
 *   post:
 *     summary: Salirse de una actividad
 *     security:
 *       - bearerAuth: []
 *     description: Permite que un usuario se elimine a sí mismo como participante de una actividad del grupo.
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66304650b012fd001e53d7cb"
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente de la actividad
 *       403:
 *         description: El usuario no está registrado como participante
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:groupId/activities/:activityId/leave', endpointDePrueba);

module.exports = router;
