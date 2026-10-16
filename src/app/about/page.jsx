import DiscoveryShell from '../components/DiscoveryShell.jsx';
import Link from 'next/link';
import {Moon, Wheat, CookingPot, MapPin, Soup, ChevronDown, ArrowRight} from 'lucide-react';
import {OchokoIcon} from '../components/InterfaceIcons.jsx';
import {aboutTitle, aboutDescription, aboutIntroduction, aboutPaths, aboutMaker, aboutInterests, aboutInterestsNote, aboutDetails, aboutClosing} from './content.js';

export const metadata = {
  title: { absolute: `${aboutTitle} | 宵の一献` },
  description: aboutDescription,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const pathIcons = {mood:Moon, food:CookingPot, sake:OchokoIcon};
  const interestIcons = {sake:OchokoIcon, rice:Wheat, food:CookingPot, place:MapPin, vessel:Soup};
  return <DiscoveryShell>
    <article className="about-page" aria-labelledby="about-title">
      <h1 id="about-title">{aboutTitle}</h1>
      <section className="about-prose about-introduction" aria-labelledby="about-concept">
        <h2 id="about-concept">{aboutIntroduction.heading}</h2>
        {aboutIntroduction.paragraphs.map(p=><p key={p}>{p}</p>)}
        <p className="about-emphasis">{aboutIntroduction.emphasis}</p>
      </section>
      <section className="about-ways" aria-labelledby="about-ways-title">
        <h2 id="about-ways-title">宵の一献とは</h2>
        <ul className="about-paths">{aboutPaths.map(path=>{const Icon=pathIcons[path.id];return <li key={path.id}><span className="about-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span><div><h3>{path.heading}</h3><p>{path.text}</p></div></li>;})}</ul>
      </section>
      <section className="about-prose about-maker" aria-labelledby="about-maker-title">
        <h2 id="about-maker-title">{aboutMaker.heading}</h2>
        {aboutMaker.paragraphs.map(p=><p key={p}>{p}</p>)}
      </section>
      <section className="about-horizons" aria-labelledby="about-interests-title">
        <h2 id="about-interests-title">宵の一献が見ていきたいもの</h2>
        <ul className="about-interests">{aboutInterests.map(interest=>{const Icon=interestIcons[interest.id];return <li key={interest.id}><span className="about-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span><h3>{interest.heading}</h3><p>{interest.text}</p></li>;})}</ul>
        <p className="about-prose about-interest-note">{aboutInterestsNote}</p>
      </section>
      <div className="about-prose about-details">{aboutDetails.map(detail=><details key={detail.id} className="about-detail" id={`about-${detail.id}`}>
        <summary><span className="about-detail-label"><span className="about-detail-title">{detail.heading}</span><span className="about-detail-summary">{detail.summary}</span></span><ChevronDown className="about-detail-chevron" size={20} strokeWidth={1.5} aria-hidden="true" /></summary>
        <div className="about-detail-body">{detail.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
      </details>)}</div>
      <div className="about-prose about-closing"><h2><span>{aboutClosing[0]}</span><span>{aboutClosing[1]}</span></h2><p>{aboutClosing[2]}</p><Link className="text-link" href="/">トップページへ <ArrowRight size={16} aria-hidden="true" /></Link></div>
    </article>
  </DiscoveryShell>;
}
