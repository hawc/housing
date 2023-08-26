import { Prisma } from '@prisma/client';

import { addSettlementOnArchitect, addSettlementOnTag, createArchitect, createDetail, createEvent, createLocation, createResource, createSettlement, createTag, deleteArchitect, deleteSettlement, deleteTag, findArchitect, findArchitects, findDetail, findDetails, findDetailTypes, findEvent, findEvents, findEventTypes, findResource, findResources, findResourceTypes, findSettlement, findSettlements, findTags, flushCache, updateArchitect, updateDetail, updateEvent, updateLocation, updateResource, updateSettlement, updateTag } from '@/lib/db';

import { Architect, BaseArchitect, BaseDetail, BaseEvent, BaseLocation, BaseResource, BaseSettlement, BaseSettlementOnArchitect, BaseSettlementOnTag, BaseTag, Detail, DetailType, Event, EventType, Resource, ResourceType, Tag } from '@/app/admin/page';
import { baseTransformers, transformers } from '@/app/api/db/transformers';

export const resolvers = {
  clearCache: async (): Promise<boolean> => {
    return await flushCache();
  },
  addTag: async (payload: Prisma.TagsCreateArgs): Promise<Tag> => {
    return transformers.tag(await createTag(payload));
  },
  deleteArchitect: async (payload: Prisma.ArchitectsDeleteArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await deleteArchitect(payload));
  },
  deleteTag: async (payload: Prisma.TagsDeleteArgs): Promise<Tag> => {
    return transformers.tag(await deleteTag(payload));
  },
  deleteSettlement: async (payload: Prisma.SettlementsDeleteArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await deleteSettlement(payload));
  },
  getSettlement: async (payload: Prisma.SettlementsFindUniqueArgs): Promise<BaseSettlement | null> => {
    const settlement = await findSettlement(payload);
    if (!settlement) return null;
    return baseTransformers.settlement(settlement);
  },
  addSettlement: async (payload: Prisma.SettlementsCreateArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await createSettlement(payload));
  },
  updateSettlement: async (payload: Prisma.SettlementsUpdateArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await updateSettlement(payload));
  },
  getSettlements: async (): Promise<BaseSettlement[]> => {
    const settlements = await findSettlements();
    return settlements.map(baseTransformers.settlement);
  },
  addSettlementOnTag: async (payload: { data: Prisma.SettlementsOnTagsUncheckedCreateInput }): Promise<BaseSettlementOnTag> => {
    return baseTransformers.settlementOnTag(await addSettlementOnTag(payload));
  },
  addLocation: async (payload: Prisma.LocationsCreateArgs): Promise<BaseLocation> => {
    return baseTransformers.location(await createLocation(payload));
  },
  updateLocation: async (payload: Prisma.LocationsUpdateArgs): Promise<BaseLocation> => {
    return baseTransformers.location(await updateLocation(payload));
  },
  addArchitect: async (payload: Prisma.ArchitectsCreateArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await createArchitect(payload));
  },
  addSettlementOnArchitect: async (payload: { data: Prisma.SettlementsOnArchitectsUncheckedCreateInput }): Promise<BaseSettlementOnArchitect> => {
    return baseTransformers.settlementOnArchitect(await addSettlementOnArchitect(payload));
  },
  getArchitects: async (payload?: Prisma.ArchitectsFindManyArgs): Promise<BaseArchitect[]> => {
    const architects = await (payload ? findArchitects(payload) : findArchitects());
    return architects.map(baseTransformers.architect);
  },
  getArchitect: async (payload: Prisma.ArchitectsFindUniqueArgs): Promise<Architect | null> => {
    const architect = await findArchitect(payload);
    if (!architect) return null;
    return baseTransformers.architect(architect);
  },
  updateArchitect: async (payload: Prisma.ArchitectsUpdateArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await updateArchitect(payload));
  },
  updateTag: async (payload: Prisma.TagsUpdateArgs): Promise<BaseTag> => {
    return baseTransformers.tag(await updateTag(payload));
  },
  addEvent: async (payload: { data: Prisma.EventsUncheckedCreateInput }): Promise<Event> => {
    return baseTransformers.event(await createEvent(payload));
  },
  updateEvent: async (payload: Prisma.EventsUpdateArgs): Promise<BaseEvent> => {
    return baseTransformers.event(await updateEvent(payload));
  },
  getEvent: async (payload: Prisma.EventsFindUniqueArgs): Promise<BaseEvent> => {
    const event = await findEvent(payload);
    if (!event) throw new Error('Event not found');
    return baseTransformers.event(event);
  },
  getEvents: async (payload: Prisma.EventsFindManyArgs): Promise<BaseEvent[]> => {
    const events = await findEvents(payload);
    return events.map(baseTransformers.event);
  },
  addResource: async (payload: { data: Prisma.ResourcesUncheckedCreateInput }): Promise<Resource> => {
    return baseTransformers.resource(await createResource(payload));
  },
  updateResource: async (payload: Prisma.ResourcesUpdateArgs): Promise<BaseResource> => {
    return baseTransformers.resource(await updateResource(payload));
  },
  getResource: async (payload: Prisma.ResourcesFindUniqueArgs): Promise<BaseResource> => {
    const resource = await findResource(payload);
    if (!resource) throw new Error('Resource not found');
    return baseTransformers.resource(resource);
  },
  getResources: async (payload: Prisma.ResourcesFindManyArgs): Promise<BaseResource[]> => {
    const resources = await findResources(payload);
    return resources.map(baseTransformers.resource);
  },
  getResourceTypes: async (payload?: Prisma.ResourceTypesFindManyArgs): Promise<ResourceType[]> => {
    const resourceTypes = await (payload ? findResourceTypes(payload) : findResourceTypes());
    return resourceTypes.map(transformers.resourceType);
  },
  addDetail: async (payload: { data: Prisma.DetailsUncheckedCreateInput }): Promise<Detail> => {
    return baseTransformers.detail(await createDetail(payload));
  },
  updateDetail: async (payload: Prisma.DetailsUpdateArgs): Promise<BaseDetail> => {
    return baseTransformers.detail(await updateDetail(payload));
  },
  getDetail: async (payload: Prisma.DetailsFindUniqueArgs): Promise<BaseDetail> => {
    const detail = await findDetail(payload);
    if (!detail) throw new Error('Detail not found');
    return baseTransformers.detail(detail);
  },
  getDetails: async (payload: Prisma.DetailsFindManyArgs): Promise<BaseDetail[]> => {
    const details = await findDetails(payload);
    return details.map(baseTransformers.detail);
  },
  getTags: async (): Promise<Tag[]> => {
    const tags = await findTags();
    return tags.map(baseTransformers.tag);
  },
  getEventTypes: async (): Promise<EventType[]> => {
    const eventTypes = await findEventTypes();
    return eventTypes.map(baseTransformers.eventType);
  },
  getDetailTypes: async (): Promise<DetailType[]> => {
    const detailTypes = await findDetailTypes();
    return detailTypes.map(baseTransformers.detailType);
  }
}