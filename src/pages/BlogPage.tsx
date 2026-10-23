import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Page from '@/components/Page';
import JournalSeo from '@/components/JournalSeo';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { newsItems } from '@/content/blueangel';
import blogDesk from '@/assets/blog-desk.webp';
import blogDeskSm from '@/assets/blog-desk-sm.webp';

function BlogPage() {

  return (
    <Page title="Blue Angel News & Press">
      <JournalSeo title="Blue Angel News & Press" description="Announcements, partnership updates and news from Blue Angel Clinical Partners." path="/blog" />
      {/* The journal sits low in the painting, so the crop is biased downward */}
      <PageHero
        eyebrow="Blog"
        title="Latest news."
        lede="Announcements from Blue Angel and perspective on what is actually changing in the market for physician-owned practices."
        image={blogDesk}
        imageMobile={blogDeskSm}
        imageAlt="Watercolour of a writing desk by a window at dawn — an open journal, a pen and reading glasses, with the bay, Bay Bridge and San Francisco skyline beyond"
        imagePosition="object-bottom"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steely-blue">
              News and press
            </span>
          </Reveal>

          <div className="mt-10 border-t border-navy/10">
            {newsItems.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <article className="border-b border-navy/10">
                  <Link to={'/blog/' + item.id} className="group grid items-start gap-4 py-10 transition-colors duration-200 hover:bg-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy md:grid-cols-[14rem_1fr] md:gap-10 md:px-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-steely-blue">
                      <span className="block">{item.category}</span>
                      <span className="mt-2 block text-foreground/55">{item.date}</span>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl leading-snug text-navy transition-colors group-hover:text-steely-blue sm:text-3xl">{item.title}</h2>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-steely-blue group-hover:text-navy">Read full story <ArrowRight className="h-4 w-4" aria-hidden /></span>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}

export default BlogPage;
