const express = require('express');
const router = express.Router();
const User = require('../model/user'); // pastikan model ini sesuai dengan migration
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // folder penyimpanan
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nama file unik
  }
}); // atau diskStorage
const upload = multer({ storage: storage });
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - pendidikan_terakhir
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         sekolah:
 *           type: string
 *         alamat:
 *           type: string
 *         petugas_lapangan:
 *           type: integer
 *         pendidikan_terakhir:
 *           type: string
 *         jurusan:
 *           type: string
 *         TTL:
 *           type: string
 *         domisili:
 *           type: string
 *         unit:
 *           type: integer
 *         foto:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post('/', upload.single('foto'),async (req, res) => {
  try {
    console.log(req.file);
    req.body.foto = req.file ? req.file.path.replace(/\\/g, '/') : null; // Simpan path file jika ada
    
    // console.log(req.file.path);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.json({ message: 'Data berhasil disimpan!', data: user,status: "Success" });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user.', error: error.message ,status: "Error" });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

 // Jika password disimpan dalam hash, gunakan ini

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log(req.body);
  try {
    // Temukan user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Jika password disimpan dalam bentuk hash, bandingkan dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password); // Ganti dengan bcrypt.compare jika pakai hashing

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Success login
    res.status(200).json({ message: 'Login successful', user,status: "Success" });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
