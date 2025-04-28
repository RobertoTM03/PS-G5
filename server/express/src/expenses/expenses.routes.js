const express = require('express');
const router = express.Router();


/**
 * @openapi
 * /groups/{groupId}/expenses:
 *   get:
 *     summary: Get expense list
 *     security:
 *       - bearerAuth: []
 *     description: Allows access to a given group expense list
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group to list expenses
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: Success, returns a list of expenses. Each expense will have a name, an amount and, optionally, a contributor and a list of tags. If the expense doesn't have a contributor, it means it hasn't been covered yet and it accepts adding a contributor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: 
 *                     - name
 *                     - amount
 *                 properties:
 *                   expenseId:
 *                     type: string
 *                     example: "53asc9b7b5fasduq1fc45abc"
 *                   name:
 *                     type: string
 *                     example: "Plane tickets"
 *                   amount:
 *                     type: number
 *                     format: float
 *                     description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                     example: 270.00
 *                   contributor:
 *                     type: object
 *                     properties:
 *                         userId:
 *                             type: string
 *                             description: ID of the User that covered the expense
 *                             example: "64ac9b7b5f8e2c001fc45abc"
 *                         name:
 *                             type: string
 *                             description: Name of the expense contributor
 *                             example: "John Doe"
 *                   tags:
 *                     type: array
 *                     items:
 *                         type: string
 *                         description: Tags associated to the expense
 *                         example: "Trip to Mallorca"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Something went wrong on our side
 */


/**
 * @openapi
 * /groups/{groupId}/expenses:
 *   post:
 *     summary: Create new expense
 *     security:
 *       - bearerAuth: []
 *     description: Adds a new expense to a given Group expense list
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group to add the expense to
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     required: 
 *                         - name
 *                         - amount
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Plane tickets"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                         example: 270.00
 *                       contributorID:
 *                         type: string
 *                         description: ID of the User that covered the expense
 *                         example: "64ac9b7b5f8e2c001fc45abc"
 *                       tags:
 *                         type: array
 *                         items:
 *                             type: string
 *                             description: Tags associated to the expense
 *                             example: "Trip to Mallorca"
 *     responses:
 *       200:
 *         description: The expense was successfully created. The resulting expense is sent alongside the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: 
 *                   - name
 *                   - amount
 *               properties:
 *                 expenseId:
 *                   type: string
 *                   example: "53asc9b7b5fasduq1fc45abc"
 *                 name:
 *                   type: string
 *                   example: "Plane tickets"
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                   example: 270.00
 *                 contributor:
 *                   type: object
 *                   properties:
 *                       userId:
 *                           type: string
 *                           description: ID of the User that covered the expense
 *                           example: "64ac9b7b5f8e2c001fc45abc"
 *                       name:
 *                           type: string
 *                           description: Name of the expense contributor
 *                           example: "John Doe"
 *                 tags:
 *                   type: array
 *                   items:
 *                       type: string
 *                       description: Tags associated to the expense
 *                       example: "Trip to Mallorca"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Something went wrong on our side
 */

module.exports = router;