const PORT = 3000;

Bun.serve({
  port: PORT,
  routes: {
    '/client.js': {
      GET: () => {
        return new Response(Bun.file("./dist/client.js"));
      }
    }
  }
})
console.log(`Listening on port ${PORT}`);