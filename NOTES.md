# TODO

- [ ] Add geolocation based on IP address (need 3rd party service?)
- [ ] Test with multiple tabs, try to break the record script
- [ ] Add dashboard
- [ ] Test CORS headers / separate domains
- [x] Figure out how to get Referer info for noscript.gif route (Not possible)
- [ ] Ensure IP address check works in Fly, do we need to read the Fly IP header instead?
- [ ] Are there cases where we need to listen for beforeunload or is visibilitychange enough?
- [ ] Create Dockerfile for Fly deployment
- [ ] Maybe create separate package.json for frontend so we can use `bun --filter '*' dev`?
- [ ] Install Prisma (Or Drizzle or kysely)?
- [x] Stop importing randomUUID on the client, use crypto.randomUUID instead

# What we want in the dashboard

Select window to analyze

Aggregate tables based on either unique visitors or page views

- Table of pages, with # of hits per path, # of uniques, avg. time spent. Include "total" as well.
- Table of hostnames
- Table of referrers?
- Table of countries if we can
- Table of browsers
- Table of devices
- Table of operating systems

Major metrics (include diff with previous window):

- Total # visitors
- Total # page views
- Bounce rate (?)
