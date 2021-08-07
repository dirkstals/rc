var HID = require('node-hid')
var devices = HID.devices()

console.log(devices);

var deviceInfo = devices.find( function(d) {
    var joystick = d.release===160
    return joystick;
})

if( deviceInfo ) {
    var device = new HID.HID( deviceInfo.path );
    device.on("data", mapping)
  }

function mapping(data)
{
    if (data[0] > 128) {
        console.log("Turn Right " + data[0]);
    } else if (data[0] < 128) {
        console.log("Turn Left " + data[0]);
    }

    if (data[4] > 0) { // gaat van 0 naar 255
        console.log("NGEGAS " + data[2])
    } 

    // standby = 128 0 128 255 0
    // gas volledig onder = 128 0 128 0 255

    // 83 83 83

    // NO BRAKE ?

    // data[0] = steering wheel
    // data[1] = buttons
    // data[2] = 128 > 64 > 128 (gevoelig)
    // data[3] = gas 255 -> 0 (gevoelig)
    // data[4] =  gas 0 -> 255 bij data[3] 128 (ruwe gas)

    // button BL = 4
    // button BR = 8
    // button UL = 16
    // button UR = 32
    // button DL = 64
    // button DR = 128

}