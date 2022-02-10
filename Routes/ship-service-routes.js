const express = require("express");
const shipController = require("../Controller/ship-service-controller");
const apiRoutes = require("./routes");
const router = express.Router();

//GET  /ship/all-ships

router.get(apiRoutes.getAll, shipController.getAllShips);

// POST /ship/create
router.post(apiRoutes.addShipData, shipController.addNewShip);

//DELETE /ship/removeData?id
router.delete(apiRoutes.removeData, shipController.deleteShipById);

module.exports = router;
