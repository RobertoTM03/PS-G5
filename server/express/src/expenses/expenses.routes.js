const express = require('express');

const { ensureAuthenticated} = require('../auth/authMiddleware');
const {ensureGroupMembership} = require('../groups/groupMembershipMiddleware');
const expenseController = require("./expensesController");

const router = express.Router();
router.use(ensureAuthenticated);
router.use('/:groupId/*', ensureGroupMembership);

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
 *         description: Success, returns a list of expenses. Each expense will have a title, an amount and, optionally, a contributor and a list of tags. If the expense doesn't have a contributor, it means it hasn't been covered yet and it accepts adding a contributor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: 
 *                     - title
 *                     - amount
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "53asc9b7b5fasduq1fc45abc"
 *                   title:
 *                     type: string
 *                     example: "Plane tickets"
 *                   amount:
 *                     type: number
 *                     format: float
 *                     description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                     example: 270.00
 *                   author:
 *                     type: object
 *                     properties:
 *                         id:
 *                             type: string
 *                             description: ID of the User that created the expense
 *                             example: "64ac9b7b5f8e2c001fc45abc"
 *                         name:
 *                             type: string
 *                             description: Name of the expense author
 *                             example: "John Doe"
 *                   contributor:
 *                     type: object
 *                     properties:
 *                         id:
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
router.get('/:groupId/expenses', expenseController.getExpenses);


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
 *                         - title
 *                         - amount
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Plane tickets"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                         example: 270.00
 *                       contributor:
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
 *                   - title
 *                   - amount
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "53asc9b7b5fasduq1fc45abc"
 *                 title:
 *                   type: string
 *                   example: "Plane tickets"
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                   example: 270.00
 *                 author:
 *                   type: object
 *                   properties:
 *                       userId:
 *                           type: string
 *                           description: ID of the User that created the expense
 *                           example: "64ac9b7b5f8e2c001fc45abc"
 *                       name:
 *                           type: string
 *                           description: Name of the expense author
 *                           example: "John Doe"
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
router.post('/:groupId/expenses', expenseController.createExpense);

/**
 * @openapi
 * /groups/{groupId}/expenses/{expenseId}:
 *   post:
 *     summary: Edit expense
 *     security:
 *       - bearerAuth: []
 *     description: Edits an expense from a given Group expense list
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: expenseId
 *         required: true
 *         description: ID of the Expense to edit
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Plane tickets"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                         example: 270.00
 *                       contributor:
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
 *         description: The expense was successfully modified. The resulting expense is sent alongside the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: 
 *                   - title
 *                   - amount
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "53asc9b7b5fasduq1fc45abc"
 *                 title:
 *                   type: string
 *                   example: "Plane tickets"
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                   example: 270.00
 *                 author:
 *                   type: object
 *                   properties:
 *                       id:
 *                           type: string
 *                           description: ID of the User that created the expense
 *                           example: "64ac9b7b5f8e2c001fc45abc"
 *                       name:
 *                           type: string
 *                           description: Name of the expense author
 *                           example: "John Doe" 
 *                 contributor:
 *                   type: object
 *                   properties:
 *                       id:
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
 *         description: Group or Expense not found
 *       500:
 *         description: Something went wrong on our side
 */
router.post('/:groupId/expenses/:expenseId', expenseController.updateExpense);

/**
 * @openapi
 * /groups/{groupId}/expenses/{expenseId}:
 *   delete:
 *     summary: Delete expense
 *     security:
 *       - bearerAuth: []
 *     description: Deletes an expense from a given Group expense list. Must be Group Owner to do so.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: expenseId
 *         required: true
 *         description: ID of the Expense to edit
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: The expense was deleted successfully.
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group or Expense not found
 *       500:
 *         description: Something went wrong on our side
 */
router.delete('/:groupId/expenses/:expenseId', expenseController.deleteExpense);

/**
 * @openapi
 * /groups/{groupId}/expenses/{expenseId}/contribute:
 *   post:
 *     summary: Contribute to a Expense
 *     security:
 *       - bearerAuth: []
 *     description: Adds the logged user as an uncovered Expense contributor.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: expenseId
 *         required: true
 *         description: ID of the Expense to edit
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: Contribution success.
 *       401:
 *         description: Expense already has a contributor
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group or Expense not found
 *       500:
 *         description: Something went wrong on our side
 */
router.post('/:groupId/expenses/:expenseId/contribute', expenseController.addContribution);

/**
 * @openapi
 * /groups/{groupId}/expenses/{expenseId}/remove-contribution:
 *   post:
 *     summary: Remove contribution
 *     security:
 *       - bearerAuth: []
 *     description: Removes the logged User status as a contributor of a Expense.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: ID of the Group
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *       - in: path
 *         name: expenseId
 *         required: true
 *         description: ID of the Expense to edit
 *         schema:
 *           type: string
 *           example: "64ac9b7b5f8e2c001fc45def"
 *     responses:
 *       200:
 *         description: Contribution removed successfully
 *       401:
 *         description: Expense doesn't have a contributor yet
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group or Expense not found
 *       500:
 *         description: Something went wrong on our side
 */
router.post('/:groupId/expenses/:expenseId/remove-contribution', expenseController.removeContribution);

module.exports = router;