import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Page from '@/components/Page';
import JournalSeo from '@/components/JournalSeo';
import JournalNav from '@/components/JournalNav';
import NotFound from '@/pages/NotFound';
import { formatJournalDate, getPublishedArticles, readingMinutes } from '@/lib/journal';
import './Journal.css';

export default function JournalArticlePage() {
  const { slug } = useParams();
  const article = getPublishedArticles().find((item) => item.slug === slug);
  if (!article) return <NotFound />;
  return (
    <Page title={article.title}>
      <JournalSeo title={article.title} description={article.description} path={'/blog/' + article.slug} article={article} />
      <div className="journal-container"><JournalNav /></div>
      <article className="journal-article">
        <header className="journal-article__header">
          <Link className="journal-back" to="/blog"><ArrowLeft size={16} aria-hidden="true" />Back to the journal</Link>
          <div className="journal-eyebrow">{article.category} <span> / </span> {article.format}</div>
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
              <a href="#sources">Sources</a>
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
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.sourceIds && (
                  <div className="journal-source-note">Sources: {section.sourceIds.map((id, index) => {
                    const source = article.sources.find((item) => item.id === id);
                    return source && <span key={id}>{index > 0 && '; '}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></span>;
                  })}</div>
                )}
                {section.link && <Link className="journal-inline-link" to={section.link.href}>{section.link.label}<ArrowRight size={16} aria-hidden="true" /></Link>}
              </section>
            ))}
            <section id="common-questions" className="journal-section">
              <h2>Common questions</h2>
              {article.faqs.map((faq) => <div className="journal-faq" key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}
            </section>
            <section id="sources" className="journal-section journal-sources">
              <h2>Sources &amp; editorial note</h2>
              <ol>{article.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><span> · Checked {formatJournalDate(source.checkedOn)}</span></li>)}</ol>
              {article.aiAssisted && <p>This article was prepared with AI assistance and links to the sources used. It discusses practice models and operations; individual membership terms and professional obligations vary.</p>}
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
