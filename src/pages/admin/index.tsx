
import { List, ListItem } from '@material-tailwind/react';
import Link from 'next/link';

import Layout from '@/components/layout/Layout';

export interface EventType {
  id: string;
  name: string;
}
export interface Event {
  id: string;
  name: string;
  description: string;
  typeId: string;
  // type: EventType;
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
}
export interface SettlementType {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
  details: Detail[];
}
export interface Settlement {
  id: string;
  title: string;
  description: string;
  events: Event[];
  location: Location;
  resources: Resource[];
  details: Detail[];
  types: SettlementType[];
  architects: Architect[];
  tags: Tag[];
}

export default function Admin() {
  return (
    <Layout>
      <div className="relative flex w-full max-w-[24rem]">
        <List>
          <ListItem>
            <Link href="/admin/architects">
              Manage Architects
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/admin/settlements">
              Manage Settlements
            </Link>
          </ListItem>
        </List>
      </div>
    </Layout>
  );
}
