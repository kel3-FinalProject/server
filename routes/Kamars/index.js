const KamarController = require("../../controller/kamarController");
const router = require("express").Router();
const authentication = require("../../middlewares/authentication");
const isAdmin = require("../../middlewares/isAdmin");

router.post("/", authentication, isAdmin, KamarController.addKamar);
router.get("/", KamarController.getKamar);
router.get("/:id", KamarController.getKamarById);
router.put("/:id", authentication, isAdmin, KamarController.updateKamar);
router.delete("/:id", authentication, isAdmin, KamarController.deleteKamar);

module.exports = router;