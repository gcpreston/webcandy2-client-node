const { Socket } = require('phoenix-channels');
const OPC = require('./opc');
const util = require('./util');

const client = new OPC('localhost', 7890);
const socket = new Socket('ws://localhost:4000/socket');

socket.connect();

// Now that you are connected, you can join channels with a topic:
const channel = socket.channel('light', {});
channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) });

channel.on('set_color', (payload) => {
  console.log('setting color to', payload.color);

  for (let pixel = 0; pixel < 512; pixel++) {
    const { r, g, b } = util.HSVtoRGB(payload.color);
    client.setPixel(pixel, r, g, b);
  }
  client.writePixels();
});
