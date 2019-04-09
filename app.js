var express = require('express')
var multer = require('multer');
var db_helper = require('./database/db_handler');
//  setting Uploading Storage
var upload = multer({storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './uploads');},
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now()+ '-'+ file.originalname)}})
}).single('avatar');
//db_helper.getUserLists();
var app = express();
app.use(express.json())
app.post('/', upload, function (req,res,next) {
    var originalFileName = req.file.filename
    console.log(req.body)
    console.log(originalFileName)
    res.send("hello world");
});
app.post('/api/login',function (req,res) {
    console.log(req.body.email+req.body.password);
    db_helper.loginUser(req.body.email,req.body.password,res);
});
var server = app.listen(3000,function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Server is running  on Http://%s:%s',host,port);
});
