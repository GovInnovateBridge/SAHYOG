const fs = require('fs');

let content = fs.readFileSync('Frontend/src/pages/PublicDashboard.tsx', 'utf8');

const startIndex = content.indexOf('{/* SECTION 1: HERO');
const endTextIndex = content.indexOf('SECTION 2: THE VISION');

if (startIndex === -1 || endTextIndex === -1) {
  console.log('Could not find section boundaries', startIndex, endTextIndex);
  process.exit(1);
}

const actualEndIndex = content.lastIndexOf('{/*', endTextIndex);

const newHero = `
      {/* SECTION 1: HERO */}
      <section ref={heroRef} className="relative w-full bg-[#FAFBFD] overflow-hidden group">
        <img 
          src="/hero-mockup.png" 
          alt="Sahyog Smart Innovation Platform - Bridging the Gap Between Government Needs & Startup Innovation" 
          className="w-full h-auto object-cover md:object-contain min-h-[400px]"
        />
        
        {/* Invisible Clickable Zones over the baked-in image buttons */}
        <div className="absolute top-[57.5%] left-[26%] w-[14%] h-[7.5%]">
          <Link to="/active-challenges" className="block w-full h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors" title="Explore Challenges" />
        </div>
        <div className="absolute top-[57.5%] left-[41%] w-[11.5%] h-[7.5%]">
          <Link to="/login" className="block w-full h-full cursor-pointer hover:bg-white/10 rounded-lg transition-colors" title="Portal Login" />
        </div>
      </section>

`;

const newContent = content.substring(0, startIndex) + newHero + content.substring(actualEndIndex);
fs.writeFileSync('Frontend/src/pages/PublicDashboard.tsx', newContent, 'utf8');
console.log('Successfully updated Hero section to use the mockup image exactly');
