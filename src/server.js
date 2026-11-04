// Titik masuk server ITBELI.
const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(`ITBELI berjalan di http://localhost:${config.port}`);
});
