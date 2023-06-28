import { Detail, Event, Settlement } from '@/pages/admin';

export function Settlement(settlement: Settlement) {
  return (
    <>
      <div>
        <div>
          <div>ID</div>
          <div>{settlement.id}</div>
        </div>
        <div>
          <div>Title</div>
          <div>{settlement.title}</div>
        </div>
        <div>
          <div>Description</div>
          <div>{settlement.description}</div>
        </div>
        <div>
          <div>Events</div>
          <div>
            {settlement.events.map((event: Event) => (
              <>
                <div>
                  <div>
                    Event Name
                  </div>
                  <div>
                    {event.name}
                  </div>
                </div>
                <div>
                  <div>
                    Event Description
                  </div>
                  <div>
                    {event.description}
                  </div>
                </div>
                <div>
                  <div>
                    Event Type
                  </div>
                  <div>
                    {event.type.name}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <div>
          <div>Details</div>
          <div>
            {settlement.details.map((detail: Detail) => (
              <>
                <div>
                  <div>
                    Detail Name
                  </div>
                  <div>
                    {detail.name}
                  </div>
                </div>
                <div>
                  <div>
                    Detail Description
                  </div>
                  <div>
                    {detail.description}
                  </div>
                </div>
                <div>
                  <div>
                    Detail Type
                  </div>
                  <div>
                    {detail.type.name}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <div>
          <div>ID</div>
          <div>{settlement.id}</div>
        </div>
      </div>
    </>
  );
}