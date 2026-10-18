import { LoginPageFrame } from '@/components/admin/LoginPageFrame';
import { ResearchDashboard } from '@/components/admin/research/ResearchDashboard';
import { Layout } from '@/components/layout/Layout';

export const dynamic = 'force-dynamic';

export default function ResearchPage() {
  return (
    <Layout>
      <LoginPageFrame>
        <ResearchDashboard />
      </LoginPageFrame>
    </Layout>
  );
}
