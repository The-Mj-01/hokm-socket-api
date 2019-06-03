const express = require('express');
const app = express();
const http = require("http");
const port = require("../glob_var").app.ports.files;
const bodyParser = require("body-parser");
const path = require("path")


const siteRouter = require('./siteRouter');

app.use(bodyParser.json());
app.use('/files', express.static(path.join(__dirname , 'files')));

module.exports = () => {
    const httpServer = http.createServer(app);
    siteRouter(app);
    httpServer.listen(port,()=>{
        console.log('httpServer RUNNING');
    });
};

