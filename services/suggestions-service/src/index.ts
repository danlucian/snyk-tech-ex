import server from "./app";

const start = async () => {
  try {
    await server.listen(3000);

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;

    server.log.info(`🚀 Suggestions node running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
