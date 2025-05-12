const express = require('express');
const { ensureAuthenticated } = require('../auth/authMiddleware');
const { ensureGroupMembership } = require('../groups/groupMembershipMiddleware');
const mapController = require('./mapController');

const router = express.Router();

router.use(ensureAuthenticated);
router.use('/:groupId/*', ensureGroupMembership);

/**
 * @openapi
 * /groups/{groupId}/map:
 *   post:
 *     summary: Add a map location to the group
 *     security:
 *       - bearerAuth: []
 *     description: Allows a group member to add an interesting point location to the shared group map.
 *     tags:
 *       - Map
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
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the interesting point
 *               location:
 *                 type: array
 *                 description: Geographic coordinates of the location
 *                 items:
 *                   type: number
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [40.712776, -74.005974]
 *     responses:
 *       200:
 *         description: Location successfully added to the map
 *       400:
 *         description: Missing or invalid parameters (title and location are required)
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:groupId/map', mapController.addMapLocation);

/**
 * @openapi
 * /groups/{groupId}/map:
 *   get:
 *     summary: View the group map
 *     security:
 *       - bearerAuth: []
 *     description: Allows a group member to view the shared group map with all active locations.
 *     tags:
 *       - Map
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Map with active locations
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
 *                   location:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Geographic coordinates
 *                   createdBy:
 *                     type: string
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No locations found
 *       500:
 *         description: Server error
 */
router.get('/:groupId/map', mapController.getMapLocations);

/**
 * @openapi
 * /groups/{groupId}/map/{locationId}:
 *   delete:
 *     summary: Delete a map location
 *     security:
 *       - bearerAuth: []
 *     description: Allows a group member to delete a geographic location from the shared group map.
 *     tags:
 *       - Map
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location successfully deleted from the map
 *       401:
 *         description: Authentication failure
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.delete('/:groupId/map/:locationId', mapController.deleteMapLocation);

module.exports = router;
