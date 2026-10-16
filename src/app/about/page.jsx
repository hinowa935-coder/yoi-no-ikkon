import DiscoveryShell from '../components/DiscoveryShell.jsx';
import { aboutTitle, aboutDescription, aboutSections, aboutClosing } from './content.js';

export const metadata = {
  title: { absolute: `${aboutTitle} | 宵の一献` },
  description: aboutDescription,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <DiscoveryShell>
    <article className="about-page" aria-labelledby="about-title">
      <h1 id="about-title">{aboutTitle}</h1>
      {aboutSections.map((section, index) => <section key={section.heading} aria-labelledby={`about-section-${index}`}>
        <h2 id={`about-section-${index}`}>{section.heading}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>)}
      <div className="about-closing">{aboutClosing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  </DiscoveryShell>;
}
