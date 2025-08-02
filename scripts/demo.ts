import demoHtml from "./demo.html";

Bun.serve({
  port: 8000,
  routes: {
    "/": demoHtml,
  },
});
console.log("Listening on port 8000");
