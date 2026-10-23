import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Page from '@/components/Page';
import JournalSeo from '@/components/JournalSeo';
import { newsItems } from '@/content/blueangel';
import NotFound from './NotFound';

export default function NewsStoryPage() {
  const { storyId } = useParams();
  const story = newsItems.find((item) => item.id === storyId);
  if (!story) return <NotFound />;
  return (
    <Page title={story.title}>
      <JournalSeo title={story.title} description={story.paragraphs[0]} path={'/blog/' + story.id} />
      <section className="bg-white px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <article className="mx-auto max-w-3xl" aria-labelledby="news-story-title">
          <Link to="/blog" className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-steely-blue hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Blog
          </Link>
          <header className="border-b border-navy/10 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steely-blue">{story.category} · {story.date}</p>
            <h1 id="news-story-title" className="mt-5 font-serif text-3xl leading-tight text-navy sm:text-4xl md:text-5xl">{story.title}</h1>
          </header>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/80">
            {story.paragraphs.map((paragraph, index) => (
              <p key={paragraph}>{index === 0 && <><strong className="font-semibold text-navy">{story.location}</strong> — </>}{paragraph}</p>
            ))}
          </div>
        </article>
      </section>
    </Page>
  );
}
