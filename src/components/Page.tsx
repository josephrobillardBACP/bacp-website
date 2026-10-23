import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';
import SiteSeo from '@/components/SiteSeo';
import { corePageSeo } from '@/lib/siteSeo';

type PageProps = {
  /** Appended to the site name in the browser tab. */
  title: string;
  children: ReactNode;
};

/** Header + main + footer chrome shared by every interior page. */
function Page({ title, children }: PageProps) {
  const { pathname } = useLocation();
  const seo = corePageSeo(pathname);
  useEffect(() => {
    if (!seo) document.title = `${title} | Blue Angel Clinical Partners`;
  }, [title, seo]);

  return (
    <>
      {seo && <SiteSeo page={seo} />}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Page;
