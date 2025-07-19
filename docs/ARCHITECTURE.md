# Requirements

- Serves a JS script (bundled+minified) that tracks user actions on the page and sends HTTP requests back to nanolytics server.
  - Maybe this should use websockets / HTTP2?
  - Start with using [navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- Serve a tracking image as an alternative to the JS for noscript users
- Store analytics data in a SQLite database

# Tools

- Bun server -- `Bun.serve()` w/bundling and minification