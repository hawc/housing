import { ArchitectsInclude, ArchitectsSelect, DetailsInclude, DetailsSelect, DetailsTypesSelect, DetailTypesInclude, EventsInclude, EventsSelect, EventTypesInclude, EventTypesSelect, LocationsInclude, LocationsSelect, ResourcesInclude, ResourcesSelect, ResourceTypesInclude, ResourceTypesSelect, SettlementsInclude, SettlementsOnArchitectsInclude, SettlementsOnTagsInclude, SettlementsSelect, SettlementTypesSelect, TagsInclude, TagsSelect } from '@/lib/db';

import { Architect, BaseArchitect, BaseDetail, BaseDetailType, BaseEvent, BaseEventType, BaseLocation, BaseResource, BaseResourceType, BaseSettlement, BaseSettlementOnArchitect, BaseSettlementOnTag, BaseTag, Detail, DetailType, Event, EventType, Location, Resource, ResourceType, Settlement, SettlementType, Tag } from '@/app/admin/page';

export const baseTransformers = {
  location: (location: LocationsInclude): BaseLocation => {
    return {
      id: location.id,
      name: location.name ?? '',
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
      lat: location.lat,
      lng: location.lng,
      settlement: transformers.settlement(location.settlement),
    };
  },
  settlementOnTag: (settlementOnTag: SettlementsOnTagsInclude): BaseSettlementOnTag => {
    return {
      tag: transformers.tag(settlementOnTag.tag),
      settlement: transformers.settlement(settlementOnTag.settlement),
    };
  },
  settlementOnArchitect: (settlementOnArchitect: SettlementsOnArchitectsInclude): BaseSettlementOnArchitect => {
    return {
      architect: transformers.architect(settlementOnArchitect.architect),
      settlement: transformers.settlement(settlementOnArchitect.settlement),
    };
  },
  settlement: (settlement: SettlementsInclude): BaseSettlement => {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      details: settlement.details.map(transformers.detail),
      types: settlement.settlementTypes.map(settlementsOnSettlementType => transformers.settlementType(settlementsOnSettlementType.settlementType)),
      architects: settlement.architects.map((settlementsOnArchitect) => transformers.architect(settlementsOnArchitect.architect)),
      resources: settlement.resources.map(transformers.resource),
      tags: settlement.tags.map(tagRelation => transformers.tag(tagRelation.tag)),
      events: settlement.events.map(transformers.event),
      location: settlement.location ? transformers.location(settlement.location) : null,
    };
  },
  architect: (architect: ArchitectsInclude): BaseArchitect => {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      url: architect.url ?? '',
      settlements: architect.settlements.map((settlementsOnArchitect) => transformers.settlement(settlementsOnArchitect.settlement)),
    };
  },
  tag: (tag: TagsInclude): BaseTag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
      settlements: tag.settlements.map((settlementsOnTag) => transformers.settlement(settlementsOnTag.settlement)),
    };
  },
  eventType: (eventType: EventTypesInclude): BaseEventType => {
    return {
      id: eventType.id,
      name: eventType.name,
      description: eventType.description ?? '',
    };
  },
  event: (event: EventsInclude): BaseEvent => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      source: event.source ?? '',
      eventDate: event.eventDate?.toDateString() ?? '',
      eventType: transformers.eventType(event.eventType)
    };
  },
  detailType: (detailType: DetailTypesInclude): BaseDetailType => {
    return {
      id: detailType.id,
      name: detailType.name,
      description: detailType.description ?? '',
    };
  },
  detail: (detail: DetailsInclude): BaseDetail => {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description ?? '',
      annotation: detail.annotation ?? '',
      source: detail.source ?? '',
      detailDate: detail.detailDate?.toDateString() ?? '',
      detailType: transformers.detailType(detail.detailType)
    };
  },
  resourceType: (resourceType: ResourceTypesInclude): BaseResourceType => {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  },
  resource: (resource: ResourcesInclude): BaseResource => {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description ?? '',
      source: resource.source ?? '',
      url: resource.url,
      license: resource.license ?? '',
      copyright: resource.copyright ?? '',
      resourceType: transformers.resourceType(resource.resourceType)
    };
  },
};

export const transformers = {
  settlement: (settlement: SettlementsSelect): Settlement => {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      tags: settlement.tags.map(settlementsOnTag => transformers.tag(settlementsOnTag.tag)),
    };
  },
  architect: (architect: ArchitectsSelect): Architect => {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      url: architect.url ?? '',
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
  location: (location: LocationsSelect): Location => {
    return {
      id: location.id,
      name: location.name ?? '',
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
      lat: location.lat,
      lng: location.lng,
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
      eventType: transformers.eventType(event.eventType)
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
