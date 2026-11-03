import { useEffect, useRef, useState } from 'react';

type Section = { id: string; title: string };

/** The same section anchors support clicking, scrolling and direct hash links. */
export default function ArticleSectionTracker({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        // Match the anchor offset, including the fixed site navigation.
        const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 112;
        if (element.getBoundingClientRect().top <= offset + 2) current = section.id;
        else break;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    // Recalculate after fonts or images change the article's layout.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    const article = navRef.current?.closest('article');
    if (article) observer?.observe(article);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, [sections]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || getComputedStyle(nav).overflowY !== 'auto') return;
    const active = nav.querySelector<HTMLElement>('[aria-current="location"]');
    if (!active) return;
    const bounds = nav.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.top < bounds.top) nav.scrollTop -= bounds.top - item.top;
    else if (item.bottom > bounds.bottom) nav.scrollTop += item.bottom - bounds.bottom;
  }, [activeId]);

  return (
    <aside className="journal-toc">
      <span className="journal-eyebrow">In this article</span>
      <nav ref={navRef} aria-label="Article contents">
        {sections.map((section) => (
          <a key={section.id} href={'#' + section.id} aria-current={activeId === section.id ? 'location' : undefined}>
            {section.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
