const express = require("express");
const router = express.Router();
const AbsenKeluar = require("../model/absen_keluar");
const AbsenMasuk = require("../model/absen_masuk");
const Progress = require("../model/progress");
const User = require("../model/user"); // Pastikan model user sesuai
const multer = require("multer");
const path = require("path");
const { startOfDay, endOfDay } = require("date-fns");
const { Op } = require("sequelize");
// Multer setup
const storageProgress = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "absen");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "absen");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const uploadProgress = multer({ storage: storageProgress });

router.post(
  "/progress",
  uploadProgress.fields([
    { name: "progress_1", maxCount: 1 },
    { name: "progress_50", maxCount: 1 },
    { name: "progress_100", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { idUser } = req.body;
      const user = await User.findOne({ where: { id: idUser } });
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());
      const files = req.files;
      var progress;
      var data = {
        idUser: user.id,
      };
      if (files["progress_1"]) {
        data.progress_1 = files["progress_1"][0].path.replace(/\\/g, "/");
      }
      if (files["progress_50"]) {
        data.progress_50 = files["progress_50"][0].path.replace(/\\/g, "/");
      }
      if (files["progress_100"]) {
        data.progress_100 = files["progress_100"][0].path.replace(/\\/g, "/");
      }
      if (!user) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }
      var existing = await Progress.findOne({
        where: {
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
          idUser: user.id,
        },
      });
      console.log("Existing Progress:", existing);
      if (existing != null) {
      progress=  await existing.update(data);
      } else {
        progress=await Progress.create(data);
      }
      res.json({
        message: "Data Progress berhasil disimpan",
        data: progress,
        status: "Success",
      });
    } catch (error) {
      console.error("Gagal menyimpan absen keluar:", error);
      res.status(500).json({
        message: "Gagal menyimpan absen keluar",
        error: error.message,
        status: "Error",
      });
    }
  }
);
/**
 * @swagger
 * /cekabsen:
 *   get:
 *     summary: Cek absen masuk dan keluar untuk user tertentu pada hari ini
 *     tags: [AbsenMasuk, AbsenKeluar]
 *     parameters:
 *       - in: query
 *         name: idUser
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user untuk mengecek absen
 *     responses:
 *       200:
 *         description: Data absen berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     masuk:
 *                       type: array
 *                       items:
 *                         type: object
 *                     keluar:
 *                       type: array
 *                       items:
 *                         type: object
 *                 status:
 *                   type: string
 *       401:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal mengambil data absen
 */
router.get("/cekabsen", async (req, res) => {
  try {
    const { idUser } = req.query;
    const user = await User.findOne({ where: { id: idUser } });

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }
    var masuk = await AbsenMasuk.findAll({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
        idUser: user.id,
      },
    });
    var keluar = await AbsenKeluar.findAll({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
        idUser: user.id,
      },
    });
    var progress = await Progress.findOne({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
        idUser: user.id,
      },
    });
    console.log("Progress:", progress);
    const data = progress!=null?[progress.progress_1,progress.progress_100,progress.progress_50 ]:[];
    const clean = progress!=null?data.filter(item => item !== null):[];
    res.json({
      message: "Data absen berhasil diambil",
      data: { masuk: masuk[0], keluar: keluar[keluar.length-1], progress: clean.length > 0 ? clean.length : null },
      status: "Success",
    });
  } catch (error) {
    console.error("Gagal mengambil data absen:", error);
    res.status(500).json({
      message: "Gagal mengambil data absen",
      error: error.message,
      status: "Error",
    });
  }
});
/**
 * @swagger
 * tags:
 *   - name: AbsenKeluar
 *     description: API untuk mencatat absen keluar
 *   - name: AbsenMasuk
 *     description: API untuk mencatat absen masuk
 */

/**
 * @swagger
 * /absenkeluar:
 *   post:
 *     summary: Absen keluar dengan lokasi dan foto
 *     tags: [AbsenKeluar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *               - latitude
 *               - created
 *             properties:
 *               idUser:
 *                 type: integer
 *               latitude:
 *                 type: string
 *               longtitude:
 *                 type: string
 *               created:
 *                 type: string
 *                 format: date-time
 *               lokasi_absen:
 *                 type: string
 *               type_absen:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Absen keluar berhasil disimpan
 *       401:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal menyimpan absen keluar
 */
router.post("/absenkeluar", upload.single("foto"), async (req, res) => {
  try {
    const { latitude, longtitude, created, idUser } = req.body;
    const user = await User.findOne({ where: { id: idUser } });

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }
    const distance = calculateDistance(
      officeLatitude,
      officeLongitude,
      parseFloat(latitude),
      parseFloat(longtitude)
    );
    if (distance < RADIUS) {
      lokasi_absen = "Kantor Wiyung";
      type_absen = "Kantor";
    } else {
      lokasi_absen = "DINAS LUAR KANTOR";
      type_absen = "LAPANGAN";
    }
    const absen = await AbsenKeluar.upsert({
      latitude,
      longtitude,
      created,
      lokasi_absen,
      type_absen,
      foto: req.file ? req.file.path.replace(/\\/g, "/") : null,
      idUser: user.id,
    });

    res.json({
      message: "Absen keluar berhasil disimpan",
      data: absen,
      status: "Success",
    });
  } catch (error) {
    console.error("Gagal menyimpan absen keluar:", error);
    res.status(500).json({
      message: "Gagal menyimpan absen keluar",
      error: error.message,
      status: "Error",
    });
  }
});

/**
 * @swagger
 * /absenmasuk:
 *   post:
 *     summary: Absen masuk dengan lokasi dan foto
 *     tags: [AbsenMasuk]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *               - latitude
 *               - created
 *             properties:
 *               idUser:
 *                 type: integer
 *               latitude:
 *                 type: string
 *               longtitude:
 *                 type: string
 *               created:
 *                 type: string
 *                 format: date-time
 *               lokasi_absen:
 *                 type: string
 *               type_absen:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Absen masuk berhasil disimpan
 *       401:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal menyimpan absen masuk
 */
router.post("/absenmasuk", upload.single("foto"), async (req, res) => {
  try {
    const { latitude, longtitude, created, idUser } = req.body;
    const user = await User.findOne({ where: { id: idUser } });

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }
    // Earth's radius in meters
    const distance = calculateDistance(
      officeLatitude,
      officeLongitude,
      parseFloat(latitude),
      parseFloat(longtitude)
    );
    if (distance < RADIUS) {
      lokasi_absen = "Kantor Wiyung";
      type_absen = "Kantor";
    } else {
      lokasi_absen = "DINA LUAR KANTOR";
      type_absen = "LAPANGAN";
    }
    const absen = await AbsenMasuk.create({
      latitude,
      longtitude,
      created,
      lokasi_absen,
      type_absen,
      foto: req.file ? req.file.path.replace(/\\/g, "/") : null,
      idUser: user.id,
    });

    res.json({
      message: "Absen masuk berhasil disimpan",
      data: absen,
      status: "Success",
    });
  } catch (error) {
    console.error("Gagal menyimpan absen masuk:", error);
    res.status(500).json({
      message: "Gagal menyimpan absen masuk",
      error: error.message,
      status: "Error",
    });
  }
});

const EARTH_RADIUS = 6371000; // Earth's radius in meters
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}
const RADIUS = 1000;
const officeLatitude = -7.3123073;
const officeLongitude = 112.6889405;

module.exports = router;
