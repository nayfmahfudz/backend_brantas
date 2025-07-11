const express = require('express');
const router = express.Router();
const Units = require('../model/unit');

/**
 * @swagger
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - name
 *         - created
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         created:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /units:
 *   post:
 *     summary: Create a new unit
 *     tags: [Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       200:
 *         description: Unit created successfully
 */
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const unit = await Units.create(req.body);
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Units.', status: error.message });
  }
});

/**
 * @swagger
 * /units:
 *   get:
 *     summary: Get all units
 *     tags: [Units]
 *     responses:
 *       200:
 *         description: A list of units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unit'
 */
router.get('/', async (req, res) => {
  try {
    const units = await Units.findAll();
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch units.' });
  }
});

/**
 * @swagger
 * /units/{id}:
 *   get:
 *     summary: Get a unit by ID
 *     tags: [Units]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit found
 *       404:
 *         description: Unit not found
 */
router.get('/:id', async (req, res) => {
  try {
    const unit = await Units.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Unit not found.' });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Units.' });
  }
});

/**
 * @swagger
 * /units/{id}:
 *   put:
 *     summary: Update a unit by ID
 *     tags: [Units]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *       404:
 *         description: Unit not found
 */
router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Units.update(req.body, { where: { id: req.params.id } });
    if (updatedRows === 0) return res.status(404).json({ message: 'Unit not found.' });
    const updatedUnit = await Units.findByPk(req.params.id);
    res.json(updatedUnit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Units.' });
  }
});

/**
 * @swagger
 * /units/{id}:
 *   delete:
 *     summary: Delete a unit by ID
 *     tags: [Units]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 *       404:
 *         description: Unit not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Units.destroy({ where: { id: req.params.id } });
    if (deleted === 0) return res.status(404).json({ message: 'Unit not found.' });
    res.json({ message: 'Unit deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Units.' });
  }
});

module.exports = router;
