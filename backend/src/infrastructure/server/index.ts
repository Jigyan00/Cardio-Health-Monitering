import { createApp } from './app';

const PORT = process.env.PORT || 3001;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 FuelEU Maritime API running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`   Health: http://localhost:${PORT}/health`);
  // eslint-disable-next-line no-console
  console.log(`   Routes: http://localhost:${PORT}/routes`);
});
