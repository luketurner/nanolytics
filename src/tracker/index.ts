const id = window.crypto.randomUUID();
const baseUrl = "http://localhost:3000";

navigator.sendBeacon(
  new URL("/record", baseUrl),
  JSON.stringify({
    id,
    url: location.pathname,
    start_time: Date.now(),
    end_time: null,
    referrer: document.referrer,
  })
);

let sent = false;
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && !sent) {
    navigator.sendBeacon(
      new URL("/finish", baseUrl),
      JSON.stringify({
        id,
        end_time: Date.now(),
      })
    );
    sent = true;
  }
});
