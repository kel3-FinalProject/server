const { Reservasi } = require("../models");

async function isUserOwnReservasi(req, res, next) {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    const { id } = req.params;

    if (isAdmin) {
      // Jika admin, izinkan akses ke semua reservasi
      const reservasi = await Reservasi.findByPk(id);
      req.reservasi = reservasi;
      next();
    } else {
      // Jika bukan admin, kembalikan reservasi yang dimiliki pengguna
      const userReservasi = await Reservasi.findOne({ where: { userId, id } });

      if (!userReservasi) {
        return res.status(403).json({ message: 'Anda tidak memiliki izin untuk melakukan tindakan ini.' });
      }

      req.reservasi = userReservasi;
      next();
    }
  } catch (error) {
    console.error('Error in isUserOwnReservasi middleware:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

module.exports = isUserOwnReservasi;
