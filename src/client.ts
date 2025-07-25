import { getVisitId } from "./shared";

const id = getVisitId();
const baseUrl = "http://localhost:3000";

navigator.sendBeacon(
  new URL("/record", baseUrl),
  JSON.stringify({
    id,
    url: location.href,
    start_time: Date.now(),
    end_time: null,
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
