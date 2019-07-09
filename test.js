var fs = require('fs')
const download = require('download');
const axios = require('axios');

runPlot();

function runPlot() {
    // readAndMergeFiles("maps/2019-05-28/19.CS.IND.DG.HR.IND26H1CABEZAS-Map20190528.geojson");

    if (!fs.existsSync("maps")){
        fs.mkdirSync("maps");
    }

    axios.request({
        method: 'POST',
        url: 'https://app.e-stratos.eu/api/v1/plots/',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Token 0c9b131753a86b354d6e96293c5c3e7366d80f64',
        },
        data: {
            land_id: '81069bd8-91ab-4cf5-bb4f-6259e688aa08',
            where: 'PepsiCo'
        },
    }).then(function (response) {
        var data = response.data;
        data = data.data;
        for (var i=0;data.length;i++){
            mapLists(data[i].plot_id);
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

    download(url,fileName).then(data => {
        fs.writeFileSync(fileName, data);
        console.log(url);
    }).catch(function (error) {
        downloadFile(fileName,url);
    });;

}
function mapLists(plotid) {
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
                where: 'PepsiCo',
            },
        }).then(function (response) {
            // handle success
            var rs = response.data;
            var reslt = rs.data;
            console.log(rs.data.length);

            for (var i = 0; i < reslt.length; i++) {
                var dir = "maps/" + reslt[i].date;
                console.log(reslt[i].url);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    downloadFile(dir, reslt[i].url);
                }
                downloadFile(dir, reslt[i].url);
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

function readAndMergeFiles(filename) {

    let data1 = fs.readFileSync(filename);
    console.log(JSON.parse(data1));
    /* let data = JSON.parse(JSON.stringify(data1));
     // var result=+mergeJSON.merge(data.feature, obj2);
     console.log(data);*/
}

function getFileLists(dir) {
    fs.readdirSync(dir).forEach(file => {
        console.log(file);
        readAndMergeFiles(dir+"/"+"19.CS.ECA.NS.VR.PIVOT8-Map20190330.geojson");
    });
}