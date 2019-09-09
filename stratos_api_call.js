var fs = require('fs')
const download = require('download');
const axios = require('axios');
var mergeJSON = require("merge-json") ;
var main_folder = "maps/"
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
        token ="Token "  +data.token;
        console.log();
        getCompanies(token,user_id);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}



/**
    Main  Entry  Point   for  run api
**/

function getCompanies(token,user_id) {
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
        data.forEach(async (item)=>{
            runPlot(item.land_name,item.land_id,token);
        });
        console.log(response);
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

//    Run Plot api

function runPlot(company,land_id,token) {
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
        data.forEach(async (item)=>{
            await mapLists(item.plot_id,main_folder+company,company,token);
        });
        
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
    });

}
// get maps list and call download function and  download maps file 
function mapLists(plotid,folderName,company,token) {
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
            

        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }catch(e){
        console.log(e);
    }

}
