const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./app');
const { mulaiScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================================`);
  console.log(`  MahaSehat Server berjalan pada http://localhost:${PORT}`);
  console.log(`  Healthcheck API : http://localhost:${PORT}/api/health`);
  console.log(`=========================================================`);
  mulaiScheduler();
});

