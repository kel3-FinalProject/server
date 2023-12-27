const router = require("express").Router();

const userRouter = require("./Users/index");
const kamarRouter = require("./Kamars/index");
const ReservasiRouter = require("./Reservasis/index");

router.use('/kamar', kamarRouter);
router.use('/reservasi', ReservasiRouter );
router.use(userRouter);

module.exports = router;