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
const html_to_pdf = require('html-pdf-node');
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
      req.body.idUser= user.id;
      data = req.body;
      console.log("Data Progress:", data);
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

router.get('/export', async (req, res) => {
  
 let options = { format: 'A4' };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

let file = { content: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lapkin PPA A. BAYU PRATAMA</title>
  <style>
    .a {
      max-width: 100%;
      max-height: 10px;
      height: auto;
      display: block;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 18px;
      margin-bottom: 5px;
    }
    .header p {
      margin: 5px 0;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f2f2f2;
    }
    .section-title {
      font-weight: bold;
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>FOTO DOKUMENTASI KEGIATAN PEMELIHARAAN RUTIN</h1>
    <p>SKPD TPOP DINAS PU SUMBER DAYA AIR PROVINSI JAWA TIMUR</p>
    <p>DAERAH IRIGASI SIMAN (BAKU 23.060 Ha)</p>
    <p>TAHUN ANGGARAN 2025</p>
  </div>
  <table>
    <tr>
      <td width="20%">METODE KERJA</td>
      <td width="30%">: INDIVIDU</td>
      <td width="20%">NAMA PETUGAS</td>
      <td width="30%">: A. BAYU PRATAMA</td>
    </tr>
    <tr>
      <td>JABATAN</td>
      <td>: PETUGAS PINTU AIR</td>
      <td>PPK</td>
      <td>: UPT PSDA WS BRANTAS DI KEDIRI</td>
    </tr>
    <tr>
      <td>URGENSI</td>
      <td colspan="3">: Membantu Juru mengatur debit air</td>
    </tr>
    <tr>
      <td>TANGGAL KEGIATAN</td>
      <td colspan="3">: Jumat, 11-April-2025</td>
    </tr>
  </table>
  <table>
    <tr>
      <th width="5%">No</th>
      <th width="45%">URAIAN KEGIATAN</th>
      <th width="50%">DOKUMENTASI</th>
    </tr>
    <tr>
      <td class="section-title">I</td>
      <td class="section-title">SALURAN DAN BANGUNAN</td>
      <td class="section-title">FOTO KONDISI 0%</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Nama Saluran : Induk Serinjing</td>
      <td rowspan="3">
        <a href="https://dummyimage.com/600x400/000/fff" target="_blank">
          <img src="https://i0.wp.com/eos.org/wp-content/uploads/2024/01/Chen-Featured-Image-Licenced-AdobeStock_438541438.png?fit=1200%2C675&ssl=1"
            alt="Klik untuk melihat lebih besar" style="width: 100%; height: 250px; object-fit: cover;" />
        </a>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Nama Bangunan : Bd. Tawang</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Kejuron : Singgahan</td>
    </tr>
    <tr>
      <td class="section-title">II</td>
      <td class="section-title">LOKASI</td>
      <td class="section-title">FOTO KONDISI 50%</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Desa : Gedangsewu</td>
      <td rowspan="4">
        <a href="https://dummyimage.com/600x400/000/fff" target="_blank">
          <img src="https://cdn.britannica.com/05/140305-050-1464D5EB/Grand-Coulee-Dam-Columbia-River-Washington.jpg"
            alt="Klik untuk melihat lebih besar" style="width: 100%; height: 250px; object-fit: cover;" />
        </a>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Kecamatan : Pare</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Kabupaten/Kota : Kabupaten Kediri</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Titik Koordinat : -7.77180, 112.18511</td>
    </tr>
    <br>
    <tr>
      <td class="section-title">III</td>
      <td class="section-title">OUTPUT KEGIATAN</td>
      <td class="section-title">FOTO KONDISI 100%</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Luas Area Kegiatan : 0 m2</td>
      <td rowspan="8">
        <a href="https://dummyimage.com/600x400/000/fff" target="_blank">
          <img src="https://images.nationalgeographic.org/image/upload/v1638892067/EducationHub/photos/aerial-view-of-the-hoover-dam.jpg"
            alt="Klik untuk melihat lebih besar" style="width: 100%; height: 300px; object-fit: cover;" />
        </a>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Panjang Saluran : 0 m'</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Menutup Bocoran : 0 bh</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Angkat Sedimen : 0 m3</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Pembersihan Sampah : 0 kg</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Pelumasan Pintu Air : 0 bh</td>
    </tr>
    <tr>
      <td>7</td>
      <td>Pengecatan Pintu Air : 0 bh</td>
    </tr>
    <tr>
      <td>8</td>
      <td>Angkat/potong pohon : 0 btrng</td>
    </tr>
    <tr>
      <td class="section-title">IV</td>
      <td colspan="2" class="section-title">MAP</td>
    </tr>
    <tr>
      <td>1</td>
      <td colspan="2">
       <a href="https://dummyimage.com/600x400/000/fff" target="_blank">
          <img src="https://v.wpimg.pl/ZTZkNzI0dTU7CThJZkt4IHhRbBMgEnZ2L0l0WGYBaGxqE2EcIFw_Jj8bIVQuQi8kOxw-VDlcdTUqAmEMeB8-PSkbIhswHz85OA4qVSxSaGJjXyhPZAk4Mm9GekJ-U3c1Y1p2V34JOTFsD3lIfQY7Y3gW"
            alt="Klik untuk melihat lebih besar" style="width: 100%; height: 300px; object-fit: cover;" />
       </a>
      </td>
    </tr>
  </table>
</body>
</html>
`};
   try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    // Set headers untuk mendownload
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="laporan.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Gagal generate PDF:', err);
    res.status(500).send('Terjadi kesalahan saat membuat PDF');
  }
});
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
