const express = require('express');
const calendarController = require('./calendarController');
const {ensureAuthenticated} = require('../auth/authMiddleware');
const {ensureGroupMembership} = require('../groups/groupMembershipMiddleware');

const router = express.Router();

router.use(ensureAuthenticated);
router.use('/:groupId/*', ensureGroupMembership);

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
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Activity correctly added
 *       400:
 *         description: Missing params
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:groupId/activities', calendarController.createActivity);

/**
 * @openapi
 * /groups/{groupId}/activities/day/{date}:
 *   get:
 *     summary: Get activities by day
 *     security:
 *       - bearerAuth: []
 *     description: Returns all activities for a specific day.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-30
 *     responses:
 *       200:
 *         description: List of activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   location:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: string
 *       400:
 *         description: Invalid date
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:groupId/activities/day/:date', calendarController.getActivitiesByDay);

/**
 * @openapi
 * /groups/{groupId}/activities/range:
 *   get:
 *     summary: Get activities in a date range
 *     security:
 *       - bearerAuth: []
 *     description: Returns all activities scheduled within a date range.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of activities within the specified date range (closed range)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   location:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: string
 *       400:
 *         description: Invalid range
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No activities found
 *       500:
 *         description: Server error
 */
router.get('/:groupId/activities/range', calendarController.getActivitiesByRange);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   get:
 *     summary: Get details of a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Returns the details of an activity, including participants.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
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
 *                 createdBy:
 *                     type: string
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.get('/:groupId/activities/:activityId', calendarController.getActivityById);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   put:
 *     summary: Edit a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows you to modify an existing group activity.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Activity updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.put('/:groupId/activities/:activityId', calendarController.updateActivity);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}:
 *   delete:
 *     summary: Delete a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a group calendar activity.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity deleted
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.delete('/:groupId/activities/:activityId', calendarController.deleteActivity);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/join:
 *   post:
 *     summary: Join a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows a user to join a calendar activity.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User joined
 *       400:
 *         description: Already joined
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.post('/:groupId/activities/:activityId/join', calendarController.joinActivity);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/leave:
 *   post:
 *     summary: Leave a calendar activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows a user to leave a calendar activity.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User left
 *       400:
 *         description: Not participating
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.post('/:groupId/activities/:activityId/leave', calendarController.leaveActivity);

/**
 * @openapi
 * /groups/{groupId}/activities/{activityId}/participants:
 *   delete:
 *     summary: Remove a participant from an activity
 *     security:
 *       - bearerAuth: []
 *     description: Allows the creator to remove a participant.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
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
 *                 type: integer
 *     responses:
 *       200:
 *         description: Participant removed
 *       400:
 *         description: Invalid participant
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Server error
 */
router.delete('/:groupId/activities/:activityId/participants', calendarController.removeParticipant);

module.exports = router;
