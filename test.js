var fs = require('fs')
const download = require('download');
const axios = require('axios');
var mergeJSON = require("merge-json") ;
var db_sql = require('./database/db_sql');
var main_folder = "maps/"

db_sql.updateSampling();
//getCompanies();










function runPlot1() {

    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/plots/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
        },
        data: {
            land_id: "81069bd8-91ab-4cf5-bb4f-6259e688aa08",
            where: "PepsiCo"
        },
    }).then(function (response) {
        var data = response.data;
        console.log(data);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

}


function mapLists1() {
    try {
        axios.request({
            method: 'POST',
            url: 'https://app.e-stratos.eu/api/v1/maps/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
            },
            data: {
                plot_id: "0449aeca-2cef-42d3-8f2d-fd82258ea63c",
                where: "PepsiCo",
                start_date: '2019-07-8',
                end_date: '2019-07-14',
            },
        }).then(function (response) {
            // handle success
            var data = response.data;
            console.log(data);

        }).catch(function (error) {
            // handle error
            console.log(error);
        })
            .finally(function () {
                // always executed
            });
    }catch(e){
        console.log(e);
    }

}



function getCompanies() {
    if (!fs.existsSync(main_folder)){
        fs.mkdirSync(main_folder);
    }
    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/lands/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
        },
        data: {
            user: '307',
            where: 'PepsiCo'
        },
    }).then(function (response) {
        var data = response.data;
        console.log(data);
        data = data.data;
        for (var i=0;data.length;i++){
            runPlot(data[i].land_name,data[i].land_id);
        }
        console.log(response);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
}


function runPlot(company,land_id) {
    if (!fs.existsSync(main_folder+company)){
        fs.mkdirSync(main_folder+company);
    }
    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/plots/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
        },
        data: {
            land_id: land_id,
            where: company
        },
    }).then(function (response) {
        var data = response.data;
        console.log(data);
        data = data.data;
        for (var i=0;data.length;i++){
           mapLists(data[i].plot_id,main_folder+company,company);
        }
        console.log(response);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

}
function downloadFile(fileName,url) {


    download(url, fileName).then(() => {
        console.log('done!=>'+url+"=>"+fileName);
    }).catch(function (error) {
        downloadFile(fileName,url);
    });;

}
function mapLists(plotid,folderName,company) {
    try {
        axios.request({
            method: 'POST',
            url: 'https://app.e-stratos.eu/api/v1/maps/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
            },
            data: {
                plot_id: plotid,
                where: company,
                start_date: '2019-07-8',
                end_date: '2019-07-14',
            },
        }).then(function (response) {
            // handle success
            var rs = response.data;
            var reslt = rs.data;
            console.log(rs.data.length);
            for (var i = 0; i < reslt.length; i++) {
                var dir = folderName+"/" + reslt[i].date;
                console.log(dir+"/"+reslt[i].url);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    downloadFile(dir, reslt[i].url);
                }else{
                    downloadFile(dir, reslt[i].url);
                }
                if(i==reslt.length){
                    console.log("complete all files");
                }
            }

        }).catch(function (error) {
            // handle error
            console.log(error);
        })
            .finally(function () {
                // always executed
            });
    }catch(e){
        console.log(e);
    }

}
function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

function  readAndMergeFiles(filename) {
    var arr1= [];
    var old = "";
     arr1.push(filename);
    let first = fs.readFileSync(arr1[0]);
    first1 = JSON.parse(first);
    old = first1.features;
     for(var i=1;i<arr1.length;i++){
        let data1 = fs.readFileSync(arr1[i]);

        data = JSON.parse(data1);
      //  console.log(data);
        old = old.push(data.features);
    }
   var jsonContent = JSON.stringify(old);
    //console.log("Session: %j", jsonContent);
   fs.writeFile('maps/love.json', jsonContent, 'utf8', function (err,data) {
    });
 }

function getFileLists(dir) {

    fs.readdirSync(dir).forEach(file => {
      //  console.log(file);
     //readAndMergeFiles(dir+"/"+file);
    });
}
function readFiles() {
    direcoorylists = getDirectories("maps");
   // for(var i=0;i<1;i++){
    console.log("maps/"+direcoorylists[0]);
        getFileLists("maps/"+direcoorylists[0]);
    //}
}