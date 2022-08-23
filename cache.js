const Cache = require('file-system-cache').default
const path = require("path");

const cache = Cache({
    basePath: path.resolve(__dirname,  ".cache")
});

module.exports = cache;
