var fs = require('fs')
const download = require('download');
const axios = require('axios');
var mergeJSON = require("merge-json") ;
var main_folder = "maps/"
var token  = "";
var user_id  = "";
var start_date = "2019-07-22";
var end_date = "2019-07-28";
//db_sql.updateSampling()
loginApi(); 





//  Login api 
function loginApi() {

    if (!fs.existsSync(main_folder)){
        fs.mkdirSync(main_folder);
    }
    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/login/',
        headers:{
            'Content-Type': 'application/json',
        },
        data: {
            username: 'pablo.aibar@smartrural.net',
            password: 'A9BBSZMB',
        },
    }).then(function (response) {
        var data = response.data;
        user_id = data.user;
        console.log(token);
        token ="Token "  +data.token;
    //   console.log(token);
        getCompanies();
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}



/**
    Main  Entry  Point   for  run api
**/

function getCompanies() {
    if (!fs.existsSync(main_folder)){
        fs.mkdirSync(main_folder);
    }
    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/lands/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        data: {
            user: user_id,
//            where: 'PepsiCo'
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
        });
}

//    Run Plot api

function runPlot(company,land_id) {
    if (!fs.existsSync(main_folder+company)){
        fs.mkdirSync(main_folder+company);
    }
    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/plots/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': token,
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
        });

}

// Downlaod file  according to company 
function downloadFile(fileName,url) {


    download(url, fileName).then(() => {
        console.log('done!=>'+url+"=>"+fileName);
    }).catch(function (error) {
        downloadFile(fileName,url);
    });;

}
// get maps list and call download function and  download maps file 
function mapLists(plotid,folderName,company) {
    try {
        axios.request({
            method: 'POST',
            url: 'https://app.e-stratos.eu/api/v1/maps/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            data: {
                plot_id: plotid,
                where: company,
                start_date: start_date,
                end_date: end_date,
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
        });
    }catch(e){
        console.log(e);
    }

}
