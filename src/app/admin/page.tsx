import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import Layout from '@/components/layout/Layout';

export interface EventType {
  id: string;
  name: string;
  description: string;
}
export interface BaseEventType {
  id: string;
  name: string;
  description: string;
}
export interface Event {
  id: string;
  name: string;
  description: string;
  source: string;
  eventDate: string;
  eventType: EventType;
}
export interface BaseEvent {
  id: string;
  name: string;
  description: string;
  source: string;
  eventDate: string;
  eventType: EventType;
}
export interface Location {
  id: string;
  name: string;
  address: string;
  district: string;
  zipCode: string;
  city: string;
  lat: number;
  lng: number;
}
export interface BaseLocation {
  id: string;
  name: string;
  address: string;
  district: string;
  zipCode: string;
  city: string;
  lat: number;
  lng: number;
  settlement: Settlement;
}
export interface DetailType {
  id: string;
  name: string;
  description: string;
}
export interface BaseDetailType {
  id: string;
  name: string;
  description: string;
}
export interface Detail {
  id: string;
  name: string;
  description: string;
  annotation: string;
  source: string;
  detailDate: string;
  detailType: DetailType;
}
export interface BaseDetail {
  id: string;
  name: string;
  description: string;
  annotation: string;
  source: string;
  detailDate: string;
  detailType: DetailType;
}
export interface ResourceType {
  id: string;
  name: string;
  description: string;
}
export interface BaseResourceType {
  id: string;
  name: string;
  description: string;
}
export interface Resource {
  id: string;
  name: string;
  description: string;
  source: string;
  license: string;
  copyright: string;
  url: string;
  resourceType: ResourceType;
}
export interface BaseResource {
  id: string;
  name: string;
  description: string;
  source: string;
  license: string;
  copyright: string;
  url: string;
  resourceType: ResourceType;
}
export interface Tag {
  id: string;
  name: string;
  description: string;
}
export interface BaseTag {
  id: string;
  name: string;
  description: string;
  settlements: Settlement[];
}
export interface Platform {
  id: string;
  name: string;
  slug: string;
  description?: string;
  url?: string;
}
export interface ExternalLink {
  id: string;
  name?: string;
  description?: string;
  url: string;
  platform?: Platform;
}
export interface Architect {
  id: string;
  name: string;
  slug: string;
  description: string;
  urls: ExternalLink[];
  role?: string;
}
export interface BaseArchitect {
  id: string;
  name: string;
  slug: string;
  description: string;
  urls: ExternalLink[];
  settlements: Settlement[];
}
export interface SettlementType {
  id: string;
  name: string;
  slug: string;
  description: string;
  resources: Resource[];
  details: Detail[];
}
export interface Settlement {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: Tag[];
  location: Location | null;
}
export interface BaseSettlement {
  id: string;
  name: string;
  slug: string;
  description: string;
  events: Event[];
  location: Location | null;
  resources: Resource[];
  details: Detail[];
  types: SettlementType[];
  architects: Architect[];
  tags: Tag[];
}
export interface BaseSettlementOnTag {
  settlement: Settlement;
  tag: Tag;
}
export interface BaseSettlementOnArchitect {
  settlement: Settlement;
  architect: Architect;
  role: string;
}

export default function Admin() {
  return (
    <Layout>
      <LoginPageFrame>
        <div className="py-4">
          <h1>Manage Data</h1>
          <List>
            <ListItem>
              <Link href="/admin/architekten">
                Architekt*innen
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/admin/siedlungen">
                Siedlungen
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/admin/tags">
                Tags
              </Link>
            </ListItem>
          </List>
        </div>
      </LoginPageFrame>
    </Layout>
  );
}
