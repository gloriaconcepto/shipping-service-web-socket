const fileStream = require("fs");

dataWriter = (data, filePath, callBack) => {
    const jsonString = JSON.stringify(data, null, 2);
    fileStream.writeFile(filePath, jsonString, (err) => {
        if (err) {
            return callBack && callBack(err);
        }
    });
};

dataReader=(filePath, fileMode, callBack)=> {
    fileStream.readFile(filePath, fileMode, (err, data) => {
        if (err) {
            return callBack && callBack(err);
        }
        if (data) {
            return callBack && callBack(null, data);
        }
    });
}

module.exports = {
    dataWriter: dataWriter,
    dataReader:dataReader,
};
