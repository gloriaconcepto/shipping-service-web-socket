const events = require("events");
const eventEmitter = new events.EventEmitter();

getAllShips = (req, res, next) => {
    try {
        //emit via web sockets to app
        const callBackData={
            res:res,
            next:next
        }
        eventEmitter.emit("getShips",callBackData);
        
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
addNewShip = (req, res, next) => {
    try {
        //emit via web sockets to app
        if (req.body) {
            // const newShipData = req.body;
            const callBackData={
                data:req.body,
                res:res,
                next:next
            }
            eventEmitter.emit("addShips", callBackData);

           
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

deleteShipById = (req, res, next) => {
    try {
        //emit via web sockets to app
        if (req.params) {
            const dataId = req.params.id;
            const callBackData={
                dataId:Number(dataId),
                res:res,
                next:next
            }
            if (Number(dataId)) {
                eventEmitter.emit("removeShips",callBackData );

             
            } else {
                res.status(500).json({
                    message: "Ship removed not successfully.",
                });
            }
        } else {
            res.status(400).json({
                message: "Ship data not found.",
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
module.exports = {
    eventEmitter: eventEmitter,
    getAllShips: getAllShips,
    addNewShip: addNewShip,
    deleteShipById: deleteShipById,
};
