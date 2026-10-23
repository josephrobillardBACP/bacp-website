import { NavLink } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

export default function JournalNav() {
  return (
    <nav aria-label="Journal navigation" className="journal-nav">
      <NavLink to="/blog" end>Journal</NavLink>
      <a href={import.meta.env.BASE_URL + 'blog#press'}>News &amp; press</a>
      {import.meta.env.DEV && (
        <NavLink to="/blog/content-calendar"><CalendarDays size={16} aria-hidden="true" />Content calendar</NavLink>
      )}
    </nav>
  );
}
