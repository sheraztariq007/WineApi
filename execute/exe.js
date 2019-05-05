var db_sql = require('../database/db_sql');
//db_sql.createLocationTable()
var FCM = require('fcm-node');
var serverKey = 'AAAA1Ph1XSQ:APA91bF8QphcXeM9k4zJZiKgPqGgplA_aGnIYKgRD7ICi6lKeHdfsGVJNRkAydwSz5eVcmbjoqY1_bRj9y5QBzKbjjlSaZDn6vlmOK_dQGfh_EUsg0kOvkecN_ydDDN7qxykhZnNwqS_'; //put your server key here
var fcm = new FCM(serverKey);




function sendNotifications(title,message){

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'c6U8I7v2TwA:APA91bEJe86yQskkrCLlNj9xwpUQefWPZVDzDgV7oTRgjt8cbTUyPyDUQ3Mm1mfZfZw6vxfu95x-edJRvDmFs_vMdMn-K1Ju6EPShIz2m5-o5xLzLhABmGEFYOfRytM6KsO0iu37hZDT',
        collapse_key: 'your_collapse_key',

        notification: {
            title: title,
            body: message
        },
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}