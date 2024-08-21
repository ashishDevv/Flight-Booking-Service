const express = require('express');

const v1Routes = require('./v1/index')

const router = express.Router();

router.use("/v1", v1Routes)

//router.use("/v2", v2Routes)
//router.use("/v3", v3Routes)    In this way we redirect routes to different versions from here

module.exports = router;