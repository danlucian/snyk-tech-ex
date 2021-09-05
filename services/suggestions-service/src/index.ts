import server from "./server";
import { port } from "./config/environment";

(async () => {
  try {
    await server.listen(port, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
