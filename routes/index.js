const router = require("express").Router();

const userRouter = require("./Users/index");
const kamarRouter = require("./Kamars/index");

router.use('/kamar', kamarRouter);
router.use(userRouter);

module.exports = router;