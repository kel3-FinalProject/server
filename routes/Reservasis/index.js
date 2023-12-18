const router = require("express").Router();
const ReservasiController = require("../../controller/reservasiController");
const authentication = require("../../middlewares/authentication");
const isUserOwnReservasi = require("../../middlewares/authorization");
const isAdmin = require("../../middlewares/isAdmin");

router.post("/", authentication, ReservasiController.createReservasi);
router.put("/:id", authentication, isUserOwnReservasi, ReservasiController.bayarReservasi);
router.get("/", authentication, ReservasiController.getReservasi);
router.get("/:id", authentication, isUserOwnReservasi, ReservasiController.getReservasiById);
router.put("/:id/update-status", authentication, isAdmin, ReservasiController.updateReservasiStatus);
router.delete("/:id", authentication, isAdmin, ReservasiController.deleteReservasi);

module.exports = router;
