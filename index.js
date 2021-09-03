const HID = require('node-hid');
const nrf24 = require("nrf24");
// const Gpio = require('onoff').Gpio;

// var LED = new Gpio(15, 'out');

// function blinkLED() { //function to start blinking
//   if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
//     LED.writeSync(1); //set pin state to 1 (turn LED on)
//   } else {
//     LED.writeSync(0); //set pin state to 0 (turn LED off)
//   }
// }

// function endBlink() { //function to stop blinking
//   clearInterval(blinkInterval); // Stop blink intervals
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
// }






const steeringWheelHIDPath = '/dev/hidraw0';
const CE_PIN = 25;
const CS_PIN = 0;

const device = new HID.HID(steeringWheelHIDPath);
const rf24 = new nrf24.nRF24(CE_PIN, CS_PIN);

rf24.begin();

rf24.config({
  DataRate: nrf24.RF24_250KBPS,
//   AutoAck: false
}, true);
rf24.useWritePipe("0xE8E8F0F0E1"); // Select the pipe address to write with Autocks

device.on("data", data => {
    sendData([data[0], data[4]]);
})

function sendData(data) {
    // rf24.stopWrite();
    // Async write with callback
    rf24.write(Buffer.from(data));
    // blinkLED();
}

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {

    // endBlink();
    // Finally to assure that object is destroyed
    // and memory freed destroy must be called.
    rf24.destroy();
    
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

rf24.destroy(); // After this call the GC will reclaim the object if needed.
// The object will become unusable at this point.


// {
//   vendorId: 1133,
//   productId: 49678,
//   path: '/dev/hidraw0',
//   serialNumber: '',
//   manufacturer: 'Logitech',
//   product: 'WingMan Formula GP',
//   release: 160,
//   interface: 0,
//   usagePage: 1,
//   usage: 4
// }

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
