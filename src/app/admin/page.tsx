import { LoginPageFrame } from '@/components/admin/LoginPageFrame';
import { Link } from '@/components/common/Link';
import { List, ListItem } from '@/components/common/List';
import { Layout } from '@/components/layout/Layout';

export default function Admin() {
  return (
    <Layout>
      <LoginPageFrame>
        <div className='py-4'>
          <h1>Manage Data</h1>
          <List>
            <ListItem>
              <Link href='/admin/architekten'>Architekt*innen</Link>
            </ListItem>
            <ListItem>
              <Link href='/admin/siedlungen'>Siedlungen</Link>
            </ListItem>
            <ListItem>
              <Link href='/admin/tags'>Tags</Link>
            </ListItem>
            <ListItem>
              <Link href='/admin/plattformen'>Plattformen</Link>
            </ListItem>
          </List>
        </div>
      </LoginPageFrame>
    </Layout>
  );
}
