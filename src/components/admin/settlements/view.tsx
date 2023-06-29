import type { Architect, Detail, Event, Settlement } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: Settlement }) {
  return (
    <>
      <div>
        <div>
          <h1>{settlement.title}</h1>
          <p>{settlement.description}</p>
        </div>
        <div>
          <h2>Events</h2>
          <div>
            {settlement.events?.map((event: Event) => (
              <div key={event.id}>
                <h3>
                  {event.name}
                </h3>
                <p>
                  {event.description}
                </p>
                <div>
                  {event.type.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Details</h2>
          <div>
            {settlement.details?.map((detail: Detail) => (
              <div key={detail.id}>
                <h3>
                  {detail.name}
                </h3>
                <div>
                  {detail.detailType.name}: {detail.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Architects</h2>
          <div>
            {settlement.architects?.map((architect: Architect) => (
              <div key={architect.id}>
                {architect.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}