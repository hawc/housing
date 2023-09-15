import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListTags } from '@/components/admin/tags/List';
import Layout from '@/components/layout/Layout';

// import { BaseTag } from '@/app/admin/page';

async function getTags() {
  // const response = await fetch(`${process.env.BASE_URL ?? ''}/api/tags/get/all`, { method: 'GET' });
  // const tags: BaseTag[] = await response.json();
  const tags = [];

  return tags;
}

export default async function Tags() {
  const tags = await getTags();

  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ListTags tagsInput={tags} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
