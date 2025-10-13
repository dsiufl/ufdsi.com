import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      {/* Teardrop transition from Hero to About Us */}
      <div className="relative">
        <svg
          className="w-full h-20 md:h-24 lg:h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="teardropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF3E2" />
              <stop offset="100%" stopColor="#F4E6D1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L0,60 Q600,120 1200,60 L1200,0 Z"
            fill="url(#teardropGradient)"
          />
        </svg>
      </div>

      <section id="features" className="py-16 md:py-20 lg:py-28 bg-gradient-to-b from-background-dark to-background-darker">
        <div className="container">
          <SectionTitle
            title="About Us"
            paragraph="The Data Science & Informatics (DSI) club at the University of Florida, founded in 2015, is dedicated to helping undergraduate students explore the world of data science and artificial intelligence. Our goal is to equip students with the knowledge and connections they need to succeed in these fast-growing fields."
            center
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
