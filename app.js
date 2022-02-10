const WebSocket = require("ws");
const express = require("express");
const bodyParser = require("body-parser");

const eventEmitter = require("./Controller/ship-service-controller");


const app = express();
const server = require("http").createServer(app);
const utilities = require("./utilities/helperFunctions");
require("dotenv").config();
const shipRoutes = require("./Routes/ship-service-routes");
const url = require("./Routes/routes");

//check if local or production port to use
const port = process.env.PROD_PORT || process.env.LOCAL_PORT;

const webSocketServer = new WebSocket.Server({ port: 8082 });


webSocketServer.on("connection", (ws) => {
    ws.send("Ship server client side connected");

    // listen the events

    //get all ships details
    eventEmitter.eventEmitter.on("getShips", (callBackData) => {
        console.log("am sending all the data");
        const { res, next } = callBackData;
        utilities.dataReader("./Models/test-ship.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                if (!err.message) {
                    err.message = "Cant read the Json file";
                    next(err);
                }
            }
            console.log("File data:", jsonString);
            try {
                res.status(200).json({
                    message: "All ship send successfully.",
                    data: JSON.parse(jsonString),
                });
                ws.send(jsonString);
            } catch (error) {
                console.log("Fail to parse", error);
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            }
        });
    });
    // add a new ship
    eventEmitter.eventEmitter.on("addShips", (callBackData) => {
        const { data, res, next } = callBackData;

        //get data from the json path and then add the data
        dataReader("./Models/test-ship.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);

                if (!err.message) {
                    err.message = "Cant read the Json file";
                    next(err);
                }
            }

            try {
                let modifiedData = JSON.parse(jsonString);
                let isDataIdPresent = false;
                modifiedData &&
                    modifiedData.shipment.map((value) => {
                        if (data.shipment[0].id === value.id) {
                            isDataIdPresent = true;
                        }
                    });
                if (isDataIdPresent) {
                    res.status(500).json({
                        message: "Ship with that id already added.",
                    });
                    ws.send("Ship with that id already added.");
                } else {
                    modifiedData.shipment.push(data && data.shipment[0]);
                    utilities.dataWriter(modifiedData, "./Models/test-ship.json", (err) => {
                        if (err) {
                            console.log("Error writing file", err);
                            if (!err.message) {
                                err.message = "Error writing file";
                                next(err);
                            }
                        }
                    });

                    res.status(200).json({
                        message: "Ship Details added successfully",
                    });
                    ws.send("Ship Details added successfully");
                }
            } catch (error) {
                console.log("Fail to read the file", error);
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            }
        });
    });

    //remove from file
    eventEmitter.eventEmitter.on("removeShips", (callBackData) => {
        const { dataId, res, next } = callBackData;

        //get data from the json path and then add the data
        dataReader("./Models/test-ship.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                if (!err.message) {
                    err.message = "Cant read the Json file";
                    next(err);
                }
            }

            try {
                let modifiedData = JSON.parse(jsonString);
                let isRemove = false;
                modifiedData &&
                    modifiedData.shipment.map((value, index) => {
                        if (value.id === dataId) {
                            console.log("id", value.id);
                            console.log("index", index);
                            modifiedData.shipment.splice(index, 1);
                            isRemove = true;
                        }
                    });
                if (isRemove) {
                    utilities.dataWriter(modifiedData, "./Models/test-ship.json", (err) => {
                        if (err) {
                            console.log("Error writing file", err);
                            if (!err.message) {
                                err.message = "Error writing file";
                                next(err);
                            }
                        }
                    });

                    res.status(200).json({
                        message: "Ship removed successfully.",
                    });
                    ws.send(`Ship with id ${dataId} remove successfully from database`);
                    console.log("Successfully remove data file");
                } else {
                    console.log("not remove");
                    let err = {
                        message: `Ship with id ${dataId} not found from the database`,
                    };
                    next(err);
                }
            } catch (error) {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            }
        });
    });

    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.error("Some Error occurred");
    };
});

app.use(bodyParser.json()); // application/json

//allowing from any url origin just for testing purpose
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
//listening to calls
app.use(url.baseUrl, shipRoutes);

//generic error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.listen(port, () => {
    console.log(`starting at port ${port}`);
});
