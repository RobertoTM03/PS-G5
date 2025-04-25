const express = require('express');
const endpointDePrueba = require('./calendarController');
const router = express.Router();

/**
 * @openapi
 * /groups/{groupId}/activities:
 *   post:
 *     summary: Add activities to Calendar
 *     security:
 *       - bearerAuth: []
 *     description: Allows a group member to add an activity with a start and end date.
 *     tags:
 *       - Activities
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
 *               - tittle
 *               - startDate
 *               - endDate
 *             properties:
 *               tittle:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Activity correctly added
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       500:
 *         description: Error not defined
 */
router.post('/:groupId/activities', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   get:
 *     summary: Get details of a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Returns the details of an activity, including the list of participants.
 *     tags:
 *       - Activities
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
 *         description: Activity details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 tittle:
 *                   type: string
 *                 description:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Error not defined
 */
router.get('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   put:
 *     summary: Edit a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows you to modify the details of an existing group activity.
 *     tags:
 *       - Activities
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
 *               tittle:
 *                 type: string
 *                 example: "Review meeting"
 *               description:
 *                 type: string
 *                 example: "Change of objectives for the week"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-28T14:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-28T15:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Room 3 or Google Meet"
 *     responses:
 *       200:
 *         description: Activity correctly updated
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Error not defined
 */
router.put('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   delete:
 *     summary: Delete an activity from the group calendar
 *     security:
 *       - bearerAuth: []
 *     description: Removes a specific activity from the group's calendar.
 *     tags:
 *       - Activities
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
 *         description: Activity successfully deleted
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Error not defined
 */
router.delete('/:groupId/activities/:activityId', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/join:
 *   post:
 *     summary: Join a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows a group member to join an activity to participate in it.
 *     tags:
 *       - Activities
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
 *         description: User added as event participant
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid application
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       500:
 *         description: Error not defined
 */
router.post('/:groupId/activities/:activityId/join', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/participants:
 *   delete:
 *     summary: Remove a participant from an activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows you to remove a specific participant from an activity using his or her ID, sent in the body.
 *     tags:
 *       - Activities
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
 *         description: Participant successfully eliminated
 *       404:
 *         description: Participant or activity not found
 *       400:
 *         description: Invalid or missing ID
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       500:
 *         description: Error not defined
 */
router.delete('/:groupId/activities/:activityId/participants', endpointDePrueba);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/leave:
 *   post:
 *     summary: Exiting an activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows a user to remove himself/herself as a participant in a group activity.
 *     tags:
 *       - Activities
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
 *         description: User successfully removed from the activity
 *       401:
 *         description: Authentication failure with user token
 *       403:
 *         description: The user does not have permission to perform the operation
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Error not defined
 */
router.post('/:groupId/activities/:activityId/leave', endpointDePrueba);

module.exports = router;
