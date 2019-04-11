var express = require('express')
var multer = require('multer');
var db_helper = require('./database/db_handler');
var bodyParser = require('body-parser')
//  setting Uploading Storage
var upload = multer({storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './uploads');},
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now()+ '-'+ file.originalname)}})
}).single('avatar');

var app = express();
app.use(express.static("uploads"))
app.use(express.json())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.post('/', function (req,res) {
    console.log(req.body.name)
    res.send(req.param('name', null));
});

var server = app.listen(3000,function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Server is running  on Http://%s:%s',host,port);
});
app.post('/api/login',function (req,res) {
    console.log(req.body.email+req.body.password);
    db_helper.loginUser(req.body.email,req.body.password,res);
});
app.post('/api/fieldnotebook',function (req,res) {
  //  console.log(req.body.email+req.body.password);
    db_helper.saveFieldNodeBook(req,res);
});
app.post('/api/disease', upload, function (req,res,next) {
    var originalFileName = req.file.filename
   // console.log(req.body.name)
    db_helper.getDiseaseList(req.param('userId', null),
        req.param('disease_type', null),
        req.param('details', null),
        originalFileName,res)
    console.log(originalFileName)
});