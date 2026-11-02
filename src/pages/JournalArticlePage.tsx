import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Page from '@/components/Page';
import JournalSeo from '@/components/JournalSeo';
import NotFound from '@/pages/NotFound';
import { formatJournalDate, getPublishedArticles, readingMinutes } from '@/lib/journal';
import './Journal.css';

export default function JournalArticlePage({ articleSlug }: { articleSlug?: string }) {
  const { slug } = useParams();
  const article = getPublishedArticles().find((item) => item.slug === (articleSlug ?? slug));
  if (!article) return <NotFound />;
  const renderText = (text: string): ReactNode => {
    const parts: ReactNode[] = [];
    let cursor = 0;
    while (cursor < text.length) {
      const next = (article.inlineLinks ?? [])
        .map((link) => ({ ...link, index: text.indexOf(link.label, cursor) }))
        .filter((link) => link.index >= cursor)
        .sort((a, b) => a.index - b.index)[0];
      if (!next) { parts.push(text.slice(cursor)); break; }
      parts.push(text.slice(cursor, next.index));
      parts.push(<a key={next.index} href={next.href} className="journal-text-link" target="_blank" rel="noopener noreferrer">{next.label}</a>);
      cursor = next.index + next.label.length;
    }
    return parts;
  };
  return (
    <Page title={article.title}>
      <JournalSeo title={article.title} description={article.description} path={'/blog/' + article.slug} article={article} />
      <article className="journal-article">
        <header className="journal-article__header">
          <Link className="journal-back" to="/blog"><ArrowLeft size={16} aria-hidden="true" />Back to Blog</Link>
          <div className="journal-eyebrow">{article.category} <span> / </span> {article.format === 'Feature' ? 'Newsletter' : article.format}</div>
          <h1>{article.title}</h1>
          <p className="hero-text journal-article__dek">{article.excerpt}</p>
          <div className="journal-meta">
            <span>By {article.author}</span>
            <time dateTime={article.publishedAt}>{formatJournalDate(article.publishedAt)}</time>
            <span>{readingMinutes(article)} min read</span>
          </div>
        </header>
        <div className="journal-article__layout">
          <aside className="journal-toc">
            <span className="journal-eyebrow">In this article</span>
            <nav aria-label="Article contents">
              {article.sections.map((section) => <a key={section.id} href={'#' + section.id}>{section.title}</a>)}
              <a href="#common-questions">Common questions</a>
            </nav>
          </aside>
          <div className="journal-article__body">
            <p className="journal-intro">{article.intro}</p>
            <aside className="journal-takeaways" aria-label="At a glance">
              <h2>At a glance</h2>
              <ul>{article.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="journal-section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{renderText(paragraph)}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.link && <Link className="journal-inline-link" to={section.link.href}>{section.link.label}<ArrowRight size={16} aria-hidden="true" /></Link>}
              </section>
            ))}
            <section id="common-questions" className="journal-section">
              <h2>Common questions</h2>
              {article.faqs.map((faq) => <div className="journal-faq" key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}
            </section>
            <section className="journal-next">
              <span className="journal-eyebrow">Continue the conversation</span>
              <h2>A practice built around what matters to you.</h2>
              <p>Explore support, plan a transition, or find your next practice.</p>
              <div className="journal-related">{article.relatedLinks.map((link) => <Link key={link.href} to={link.href}>{link.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div>
            </section>
          </div>
        </div>
      </article>
    </Page>
  );
}
