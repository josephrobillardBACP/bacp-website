import { Link } from 'react-router-dom';
import questions from '@/content/partnership-questions.json';

export default function PartnershipQuestions() {
  return (
    <section className="border-t border-navy/10 bg-light-gray px-4 py-20 sm:px-6 md:py-28 lg:px-8" aria-labelledby="partnership-questions-title">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steely-blue">Choosing a practice partner</p>
        <h2 id="partnership-questions-title" className="mt-5 max-w-3xl font-serif text-3xl leading-tight text-navy sm:text-4xl">Find the right partner for your concierge medicine practice.</h2>
        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {questions.map((item) => (
            <div key={item.question}>
              <h3 className="font-serif text-xl leading-snug text-navy">{item.question}</h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/80">{item.answer}</p>
              <Link to={item.href} className="mt-4 inline-block text-sm font-semibold text-steely-blue underline underline-offset-4 hover:text-navy">{item.label}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
