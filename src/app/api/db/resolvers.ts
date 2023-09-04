import { Prisma } from '@prisma/client';

import { addSettlementOnArchitect, addSettlementOnTag, createDetail, createEvent, createLocation, createResource, createTag, deleteTag, findDetail, findDetails, findDetailTypes, findEvent, findEvents, findEventTypes, findResource, findResources, findResourceTypes, flushCache, updateDetail, updateEvent, updateLocation, updateResource, updateTag } from '@/lib/db';

import { BaseDetail, BaseEvent, BaseLocation, BaseResource, BaseSettlementOnArchitect, BaseSettlementOnTag, BaseTag, Detail, DetailType, Event, EventType, Resource, ResourceType, Tag } from '@/app/admin/page';
import { baseTransformers, transformers } from '@/app/api/db/transformers';

export const resolvers = {
  clearCache: async (): Promise<boolean> => {
    return await flushCache();
  },
  addTag: async (payload: Prisma.TagsCreateArgs): Promise<Tag> => {
    return transformers.tag(await createTag(payload));
  },
  deleteTag: async (payload: Prisma.TagsDeleteArgs): Promise<Tag> => {
    return transformers.tag(await deleteTag(payload));
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
  addSettlementOnArchitect: async (payload: { data: Prisma.SettlementsOnArchitectsUncheckedCreateInput }): Promise<BaseSettlementOnArchitect> => {
    return baseTransformers.settlementOnArchitect(await addSettlementOnArchitect(payload));
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
  getEventTypes: async (): Promise<EventType[]> => {
    const eventTypes = await findEventTypes();
    return eventTypes.map(baseTransformers.eventType);
  },
  getDetailTypes: async (): Promise<DetailType[]> => {
    const detailTypes = await findDetailTypes();
    return detailTypes.map(baseTransformers.detailType);
  }
}