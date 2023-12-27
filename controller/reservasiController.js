const { CronJob } = require("cron");
const { Op } = require("sequelize");
const { Reservasi, Kamar, sequelize } = require("../models");

class Controller {
  static async cronUpdateBayar() {
    const job = new CronJob(
      "0 */2 * * *", // cronTime
      async function () {
        const allReservasis = await Reservasi.findAll({
          where: {
            tanggal_checkin: {
              [Op.lt]: new Date(),
            },
            status: "menunggu pembayaran",
          },
        }); // buat dapet reservasi yang sudah melewati tanggal pembayaran

        console.log(allReservasis.length); // 2
        // updateReservasiStatus // buat update reservasi yang didapat dari atas
        for (const reservasi of allReservasis) {
          reservasi.status = "canceled";

          // Commit transaksi jika berhasil
          await reservasi.save();
        }
      }, // onTick
      null, // onComplete
      true, // start
      "America/Los_Angeles" // timeZone
    );

    return job;
  }

  static async cronUpdateStatus() {
    const job = new CronJob(
      "0 */1 * * *", // cronTime
      async function () {
        const allReservasis = await Reservasi.findAll({
          where: {
            tanggal_checkout: {
              [Op.lt]: new Date(),
            },
            status: "booked",
          },
        }); // buat dapet reservasi yang sudah melewati tanggal pemesanan

        console.log(allReservasis.length); // 2
        // updateReservasiStatus // buat update reservasi yang didapat dari atas
        for (const reservasi of allReservasis) {
          reservasi.status = "done";

          // Commit transaksi jika berhasil
          await reservasi.save();
        }
      }, // onTick
      null, // onComplete
      true, // start
      "America/Los_Angeles" // timeZone
    );

    return job;
  }

  static async getReservasi(req, res) {
    try {
      const userId = req.userId;
      const isAdmin = req.isAdmin;
      // Jika pengguna adalah admin, izinkan akses ke semua reservasi
      if (isAdmin) {
        const allReservasis = await Reservasi.findAll();
        res.status(200).json(allReservasis);
      } else {
        // Jika bukan admin, kembalikan reservasi yang dimiliki pengguna
        const userReservasis = await Reservasi.findAll({ where: { userId } });
        res.status(200).json(userReservasis);
      }
    } catch (error) {
      console.error("Error in getReservasi:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  static async getReservasiById(req, res) {
    try {
      const reservasi = req.reservasi;
      res.status(200).json(reservasi);
    } catch (error) {
      console.error("Error in getElemenById:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  static async createReservasi(req, res) {
    const t = await sequelize.transaction(); // Mulai transaksi
    try {
      const { tanggal_checkin, tanggal_checkout, kamarId } = req.body;
      // Check if the room exists
      const kamar = await Kamar.findByPk(kamarId);
      if (!kamar) {
        await t.rollback();
        return res
          .status(404)
          .json({ error: "Kamar tidak ditemukan. Silahkan pilih kamar lain." });
      }
      // Check if the room is already reserved
      const existingReservasi = await Reservasi.findOne({
        where: {
          kamarId,
          status: ["menunggu pembayaran", "booked"],
        },
      });

      if (existingReservasi) {
        await t.rollback();
        return res.status(400).json({
          error: "Kamar sudah direservasi. Silahkan pilih kamar lain.",
        });
      }
      // Get room price directly from the room object
      const hargaKamar = kamar.harga;
      // Calculate total based on room price and date difference
      const selisihHari = Math.ceil(
        (new Date(tanggal_checkout) - new Date(tanggal_checkin)) /
          (1000 * 60 * 60 * 24)
      );
      const total = selisihHari * hargaKamar;
      // Create reservation within the transaction
      const reservasi = await Reservasi.create(
        {
          userId: req.userId,
          kamarId,
          total,
          status: "menunggu pembayaran",
          tanggal_checkin,
          tanggal_checkout,
        },
        { transaction: t }
      );
      // Commit transaction if everything is successful
      await t.commit();
      res.status(201).json(reservasi);
    } catch (error) {
      console.error("Error in createReservasi:", error);
      // Rollback transaction if an error occurs
      await t.rollback();
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  static async bayarReservasi(req, res) {
    try {
      const reservasi = req.reservasi;
      if (!reservasi) {
        return res.status(404).json({ message: "Reservasi tidak ditemukan" });
      }

      if (reservasi.status !== "menunggu pembayaran") {
        return res.status(400).json({
          message: "Reservasi tidak dapat dibayar. Status sudah berubah.",
        });
      }
      // Perform payment process (e.g., integrate with a payment gateway)
      // Setelah pembayaran berhasil, update status reservasi menjadi "booked"
      reservasi.status = "booked";
      await reservasi.save();
      res
        .status(200)
        .json({ message: "Pembayaran berhasil. Reservasi telah diproses." });
    } catch (error) {
      console.error("Error in bayarReservasi:", error);
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  static async updateReservasiStatus(req, res) {
    const t = await sequelize.transaction(); // Mulai transaksi
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Cari reservasi berdasarkan ID
      const reservasi = await Reservasi.findByPk(id, { transaction: t });

      if (!reservasi) {
        await t.rollback();
        return res.status(404).json({ message: "Reservasi tidak ditemukan" });
      }

      // Pastikan status yang diberikan adalah valid
      if (status !== "done" && status !== "canceled") {
        await t.rollback();
        return res.status(400).json({ message: "Status tidak valid" });
      }

      // Ubah status reservasi sesuai permintaan admin
      reservasi.status = status;

      // Commit transaksi jika berhasil
      await reservasi.save({ transaction: t });
      await t.commit();

      res.status(200).json({
        message: `Status reservasi berhasil diubah menjadi ${status}`,
      });
    } catch (error) {
      console.error("Error in updateReservasiStatus:", error);
      // Rollback transaksi jika terjadi kesalahan
      await t.rollback();
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  static async deleteReservasi(req, res) {
    const t = await sequelize.transaction(); // Mulai transaksi
    try {
      const { id } = req.params;
      // Cari reservasi berdasarkan ID
      const reservasi = await Reservasi.findByPk(id);
      if (!reservasi) {
        return res.status(404).json({ message: "Reservasi tidak ditemukan" });
      }
      // Hapus reservasi dalam transaksi
      await reservasi.destroy({ transaction: t });
      // Commit transaksi jika berhasil
      await t.commit();
      res.status(200).json({ message: "Reservasi berhasil dihapus" });
    } catch (error) {
      console.error("Error in deleteReservasi:", error);
      // Rollback transaksi jika terjadi kesalahan
      await t.rollback();
      res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
}

module.exports = Controller;