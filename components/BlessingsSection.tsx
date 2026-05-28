import { Music2, Guitar, Brain, Sun, HandHeart, Heart } from "lucide-react";

const blessings = [
  {
    icon: Music2,
    title: "Your voice",
    text: "May every song you sing carry the weight of heaven and bring healing to those who hear it.",
  },
  {
    icon: Guitar,
    title: "Your gifting",
    text: "The guitar strings under your fingers are an offering. May your music open doors no one can shut.",
  },
  {
    icon: Brain,
    title: "Your mind",
    text: "May wisdom increase in you year by year, and may your growth in knowledge bring God glory.",
  },
  {
    icon: Sun,
    title: "Your future",
    text: "The best of your story is still unwritten. May every dream you carry find its moment in God's perfect time.",
  },
  {
    icon: HandHeart,
    title: "Your faith",
    text: "Your love for God is your greatest strength. May it deepen in this new decade beyond what you can ask or imagine.",
  },
  {
    icon: Heart,
    title: "Your heart",
    text: "You carry warmth for everyone around you. May that same warmth return to you a hundredfold.",
  },
];

export default function BlessingsSection() {
  return (
    <div className="section reveal">
      <span className="section-tag">Spoken over you</span>
      <h2 className="section-title">
        God&rsquo;s favour is upon<br /><em>every area of your life</em>
      </h2>
      <p className="section-body">
        As you step into your twenties, know this — you are not entering a new chapter alone.
        The God who has kept you through every season is the same God who goes before you into this new one.
        His mercies are new this morning, and they are new for you today.
      </p>
      <div className="blessings-grid">
        {blessings.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="blessing-card">
              <span className="blessing-icon"><Icon size={28} /></span>
              <p className="blessing-title">{b.title}</p>
              <p className="blessing-text">{b.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
