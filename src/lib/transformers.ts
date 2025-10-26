
import { ArchitectsSelect } from '@/app/api/architects/selects';
import { DetailsSelect } from '@/app/api/details/selects';
import { DetailsTypesSelect } from '@/app/api/detailTypes/selects';
import { EventsSelect } from '@/app/api/events/selects';
import { EventTypesSelect } from '@/app/api/eventTypes/selects';
import { ExternalLinksSelect } from '@/app/api/externalLinks/selects';
import { LocationsSelect } from '@/app/api/locations/selects';
import { PlatformsSelect } from '@/app/api/platforms/selects';
import { ResourcesSelect } from '@/app/api/resources/selects';
import { ResourceTypesSelect } from '@/app/api/resourceTypes/selects';
import { SettlementsSelect, SettlementTypesSelect } from '@/app/api/settlements/selects';
import { TagsSelect } from '@/app/api/tags/selects';
import type {
  Architect,
  Detail,
  DetailType,
  Event,
  EventType,
  ExternalLink,
  Location,
  Platform,
  Resource,
  ResourceType,
  Settlement,
  SettlementType,
  Tag,
} from '@/lib/types';
import { parsePrismaJson } from '@/utils/parsePrismaJson';
import { Polygon } from 'geojson';

export const transformers = {
  settlement: (settlement: SettlementsSelect): Settlement => {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      tags: settlement.tags.map((settlementsOnTag) =>
        transformers.tag(settlementsOnTag.tag)
      ),
      location:
        'location' in settlement && settlement.location
          ? transformers.location(settlement.location)
          : null,
    };
  },
  architect: (architect: ArchitectsSelect, role?: string | null): Architect => {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      urls: architect.urls.map(transformers.externalLink),
      role: role ?? '',
    };
  },
  tag: (tag: TagsSelect): Tag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
    };
  },
  settlementType: (settlementType: SettlementTypesSelect): SettlementType => {
    return {
      id: settlementType.id,
      name: settlementType.name,
      slug: settlementType.slug,
      description: settlementType.description ?? '',
      resources: settlementType.resources.map(transformers.resource),
      details: settlementType.details.map(transformers.detail),
    };
  },
  platform: (platform: PlatformsSelect): Platform => {
    return {
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      description: platform.description ?? '',
      url: platform.url ?? '',
      urlIdentifier: platform.url ?? '',
    };
  },
  externalLink: (externalLink: ExternalLinksSelect): ExternalLink => {
    return {
      id: externalLink.id,
      name: externalLink.name ?? '',
      description: externalLink.description ?? '',
      url: externalLink.url ?? '',
      platform: externalLink.platform
        ? transformers.platform(externalLink.platform)
        : undefined,
    };
  },
  location: (location: LocationsSelect): Location => {
    return {
      id: location.id,
      name: location.name ?? '',
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
      state: location.state ?? '',
      lat: location.lat,
      lng: location.lng,
      geo: parsePrismaJson<Polygon | undefined>(location.geo),
    };
  },
  resource: (resource: ResourcesSelect): Resource => {
    return {
      id: resource.id,
      name: resource.name,
      url: resource.url,
      source: resource.source ?? '',
      license: resource.license ?? '',
      copyright: resource.copyright ?? '',
      resourceType: transformers.resourceType(resource.resourceType),
      description: resource.description ?? '',
    };
  },
  resourceType: (resourceType: ResourceTypesSelect): ResourceType => {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  },
  detail: (detail: DetailsSelect): Detail => {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description ?? '',
      annotation: detail.annotation ?? '',
      source: detail.source ?? '',
      detailDate: detail.detailDate?.toDateString() ?? '',
      detailType: transformers.detailType(detail.detailType),
    };
  },
  detailType: (detailType: DetailsTypesSelect): DetailType => {
    return {
      id: detailType.id,
      name: detailType.name,
      description: detailType.description ?? '',
    };
  },
  event: (event: EventsSelect): Event => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      source: event.source ?? '',
      eventDate: event.eventDate?.toDateString() ?? '',
      eventType: transformers.eventType(event.eventType),
    };
  },
  eventType: (eventType: EventTypesSelect): EventType => {
    return {
      id: eventType.id,
      name: eventType.name,
      description: eventType.description ?? '',
    };
  },
};
