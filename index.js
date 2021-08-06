var HID = require('node-hid')
var devices = HID.devices()

// console.log(devices);

var deviceInfo = devices.find( function(d) {
    var joystick = d.release===160
    return joystick;
})

if( deviceInfo ) {
    var device = new HID.HID( deviceInfo.path );
    device.on("data", function(data) {
        console.log(data)
        mapping(data)
    })
  }

function mapping(data)
{
    if(data[12] > 128 && data[13] < 128)
    {
        console.log("Turn Right " + data[12])
    }else if(data[12] < 128 && data[13] > 128)
    {
        console.log("Turn Left " + data[12])
    }

    if(data[14] < 128 && data[15] > 128)
    {
        console.log("NGEGAS " + data[14])
    }
    if(data[14] > 128 && data[15] < 128){
        console.log("NGEREM " + data[14])
    }
}