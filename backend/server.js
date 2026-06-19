const app = require("./src/app");
const { env } = require("./src/config/env");

const server = app.listen(env.PORT, () => {
  console.log(`LetsType backend listening on port ${env.PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down LetsType backend.`);

  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
