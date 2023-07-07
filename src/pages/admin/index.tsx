
import { List, ListItem } from '@material-tailwind/react';
import Link from 'next/link';

import Layout from '@/components/layout/Layout';

export interface EventType {
  id: string;
  name: string;
  description: string;
}
export interface Event {
  id: string;
  name: string;
  description: string;
  type: EventType;
  eventDate: string;
}
export interface Location {
  id: string;
  name: string;
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
  type: EventType;
  eventDate: string;
}
export interface BaseTag {
  id: string;
  name: string;
  description: string;
  settlements: Settlement[];
}
export interface BaseArchitect {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  settlements: Settlement[];
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
      <div className="py-4">
        <h1>Manage Data</h1>
        <div className="relative flex w-full max-w-[24rem]">
          <List>
            <ListItem>
              <Link href="/admin/architects">
                Architects
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/admin/settlements">
                Settlements
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/admin/tags">
                Tags
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/admin/resources">
                Resources
              </Link>
            </ListItem>
          </List>
        </div>
      </div>
    </Layout>
  );
}
