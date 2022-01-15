export {};

// Only initialize server from a backend context
if (typeof window === "undefined") {
  const { server } = require("./server");

  server.listen({ onUnhandledRequest: "warn" });
  console.log("Mock service worker server installed");
  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());
}
