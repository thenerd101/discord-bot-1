const express = require('express');
const server = express();
 
server.all('/', (req, res) => {
  res.send(`OK`)
})
 
function keepAlive() {
  server.listen(3000, () => {
    const now = new Date();
    const human = now.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // e.g. "January 1, 1970"
    const ms = now.getTime(); // milliseconds since Jan 1, 1970
    console.log(`Server is Ready!! ${human} (${ms} ms)`);
  });
}
 
module.exports = keepAlive;