# Latest updates

Each settlement/architect keeps its existing `updatedAt` and a small
`updatedSections` array. Related writes update that parent metadata in the same
transaction: details, history, location, photos, links and architect assignments.
Section labels accumulate during the latest day (Europe/Berlin); the next day's
edit replaces them. There is no activity table, version history or content snapshot.
The public feed still shows each entry once, at its latest update.

Shared architect names update linked settlements; biographies update only the
architect. Relationship removals and moves update the affected owners. Unchanged
saves and hidden owners do not produce public updates. Research only updates the
parent after approval, together with the approved content. Existing private research
audit data stays separate and is never queried for the public feed.

The migration `prisma/migrations/20261018120000_latest_update_sections/migration.sql`
adds the two array columns with empty defaults. It is **prepared, not applied to the
live database**. Apply it through the normal release procedure before deploying
this app and restarting the worker. Existing entries keep generic labels until
their next edit; historical changed sections are not reconstructed.
