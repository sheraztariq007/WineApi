var express = require('express')
var multer = require('multer');
var db_helper = require('./database/db_handler');
var db_sql = require('./database/db_sql');
var bodyParser = require('body-parser')
var md5 = require("md5")
var fs = require('fs')
var dateTime = require('node-datetime');
var time = new Date();

//  setting Uploading Storage
var upload = multer({storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './uploads');},
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now()+ '-'+ file.originalname)}})
}).single('avatar');
console.log(md5("123456"))
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
    db_sql.loginUser(req.body.email,req.body.password,res);
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
        originalFileName,
        req.param('location', null),
        req.param('company_id', null),res)
    console.log(originalFileName)
});

app.post('/api/maintaince', upload, function (req,res,next) {
    var originalFileName = req.file.filename
    db_helper.saveMaintaince(req.param('userId', null),
        req.param('maintane_type', null),
        req.param('details', null),
        originalFileName,
        req.param('location', null),
        req.param('company_id', null),res)
    console.log(originalFileName)
});
app.post('/api/sampling' ,function (req,res) {
    db_helper.saveSampling(req,res)
});
app.post('/api/fieldlist' ,function (req,res) {
    db_helper.fieldlist(res)
});
app.post('/api/laborlist' ,function (req,res) {
    db_helper.laborlist(res)
});
app.post('/api/maintenancelist' ,function (req,res) {
    db_helper.maintenancelist(res)
});
app.post('/api/diseaseslist' ,function (req,res) {
    db_helper.diseaseslist(res)
});
app.post('/api/searchuserbyfield' ,function (req,res) {
    db_helper.searchUserByField(req.body.company_id,res)
});
app.post('/api/addnewtasks' ,function (req,res) {
    db_helper.addNewTasks(req,res)
});
app.post('/api/gettasksLists' ,function (req,res) {
    db_helper.getTasksLists(req,res)
});
app.post('/api/taskslists' ,function (req,res) {
    db_helper.getTasksNames(req,res)
});
app.post('/api/myuploadedtasks' ,function (req,res) {
    db_helper.myUploadTasks(req,res)
});
app.post('/api/assign_tasks' ,function (req,res) {
    db_sql.AssignTasks(req.body.user_id,res)
});
app.post('/api/newTasks' ,function (req,res) {
    db_sql.newTasks(req.body.user_id,res)
});
app.post('/api/taskWithFields' ,function (req,res) {
    db_sql.taskWithFields(req.body.task_id,res)
});
/*
*  0 for new status
*  1 for status in inprogres
*  2 for status end
* */
app.post('/api/updatetaskstatus' ,function (req,res) {
    db_sql.updatTaskStatus(req.body.task_id,req.body.user_id,req.body.status,req.body.company_id,res)
});
app.post('/api/deletetasks' ,function (req,res) {
    db_sql.deletetasks(req.body.task_id,
        req.body.manager_id,
        req.body.user_id,res)
});

app.post('/api/getlistofdates' ,function (req,res) {
    db_helper.getListsOfDates(req.body.task_id,res)

});
app.post('/api/checkrunningtasks' ,function (req,res) {
    db_sql.checkRunningTasks(req.body.user_id,res)
});
app.post('/api/savetasklocation' ,function (req,res) {
    db_sql.savegeometrylocation(req);
});
app.post('/api/getuserslocations' ,function (req,res) {
    db_sql.getUsersLocations(req,res);
});
app.post('/api/getsingleuserlocation' ,function (req,res) {
    db_sql.getSingleUserLocation(req,res);
});

app.post('/api/savetoken' ,function (req,res) {
    db_sql.savetoken(req,res);
    //db_sql.sendNotifications('dssds','sdsds',"3",2,req);
});
app.post('/api/detaildiseasebyid' ,function (req,res) {
    db_sql.detailDiseaseById(req,res);
});
app.post('/api/maintaindiseasebyid' ,function (req,res) {
    db_sql.maintainDiseaseById(req,res);
});
app.post('/api/notebookdetailsbyid' ,function (req,res) {
    db_sql.notebookDetailsById(req,res);
});
app.post('/api/samplingdetailbyid' ,function (req,res) {
    db_sql.samplingDetailById(req,res);
});

app.post('/api/savenotifications' ,function (req,res) {
    db_helper.saveNotifications(req,res);
});


app.post('/api/getlatestusers' ,function (req,res) {
    db_sql.getlatestUsers(req,res);
});
app.post('/api/workingnotificationhandle' ,function (req,res) {
    db_sql.workingNotificationHandle(req,res);
});
app.post('/api/taskdetailsbyid' ,function (req,res) {
    db_sql.taskDetailsById(req,res);
});

app.post('/api/getmynotifications' ,function (req,res) {
    db_helper.getMyNotifications(req,res);
});

app.post('/api/updatenotificationstatus' ,function (req,res) {
    db_sql.updateNotificationStatus(req,res);
});

app.get('/api/images/getimages' ,function (req,res) {
    fs.readdir("uploads", function(err, filenames) {

        if (err) {
            console.log(err)
            return;
        }
        else{
            res.send({
               "images" : req.connection.remoteAddress
            });
        }

    });
});

