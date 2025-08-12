import { BuildingIcon, CircleDotDashedIcon, HomeIcon } from 'lucide-react';

interface EventIconProps {
  type: string;
}

function EventIcon({ type }: EventIconProps) {
  switch (type) {
    case 'Planung':
      return <CircleDotDashedIcon className='h-4 w-4' />;
    case 'Fertigstellung':
      return <BuildingIcon className='h-4 w-4' />;
    default:
      return <HomeIcon className='h-4 w-4' />;
  }
}

interface TimelineIconProps {
  type: string;
}

export function TimelineIcon({ type }: TimelineIconProps) {
  return (
    <span className='w-max relative z-[2] flex-shrink-0 rounded-full overflow-hidden bg-bg text-grey-light p-2 self-start'>
      <EventIcon type={type} />
    </span>
  );
}
