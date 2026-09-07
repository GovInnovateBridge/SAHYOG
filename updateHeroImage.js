const fs = require('fs');

let content = fs.readFileSync('Frontend/src/pages/PublicDashboard.tsx', 'utf8');

const startIndex = content.indexOf('{/* SECTION 1: HERO');
const endIndex = content.indexOf('{/* ?? SECTION 2: THE VISION');

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find section boundaries');
  process.exit(1);
}

const newHero = `
      {/* SECTION 1: HERO */}
      <section ref={heroRef} className="relative w-full bg-[#FAFBFD] overflow-hidden group">
        <img 
          src="/hero-mockup.png" 
          alt="Sahyog Smart Innovation Platform - Bridging the Gap Between Government Needs & Startup Innovation" 
          className="w-full h-auto object-cover md:object-contain min-h-[400px]"
        />
        
        {/* Invisible Clickable Zones over the baked-in image buttons */}
        <div className="absolute top-[57.5%] left-[26%] w-[14%] h-[7.5%] opacity-0 hover:opacity-20 bg-white rounded-lg transition-opacity">
          <Link to="/active-challenges" className="block w-full h-full cursor-pointer" title="Explore Challenges" />
        </div>
        <div className="absolute top-[57.5%] left-[41%] w-[11.5%] h-[7.5%] opacity-0 hover:opacity-20 bg-white rounded-lg transition-opacity">
          <Link to="/login" className="block w-full h-full cursor-pointer" title="Portal Login" />
        </div>
      </section>

`;

const newContent = content.substring(0, startIndex) + newHero + content.substring(endIndex);
fs.writeFileSync('Frontend/src/pages/PublicDashboard.tsx', newContent, 'utf8');
console.log('Successfully updated Hero section to use the mockup image exactly');
