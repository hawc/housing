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
export interface DetailType {
  id: string;
  name: string;
  description: string;
}
export interface Detail {
  id: string;
  name: string;
  description: string;
  type: DetailType;
}
export interface ResourceType {
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
  type: ResourceType;
}
export interface Tag {
  id: string;
  name: string;
  description: string;
}
export interface Architect {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
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
}
export interface BaseEvent {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  eventDate: string;
}
export interface BaseTag {
  id: string;
  name: string;
  description: string;
  settlements: Settlement[];
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
export interface BaseArchitect {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  settlements: Settlement[];
}
export interface BaseSettlementOnTag {
  settlement: Settlement;
  tag: Tag;
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

export default function Admin() {
  return (
    <Layout>
      <LoginPageFrame>
        <div className="py-4">
          <h1>Manage Data</h1>
          <List>
            <ListItem>
              <Link href="/admin/architekten">
                Architekten
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
