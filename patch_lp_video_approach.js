const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 1. Fix Video URL
content = content.replace(
  /<video src="\/images\/intro\.mp4" controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" \/>/,
  `{pageData?.displayVideoUrl ? (
              <video src={pageData.displayVideoUrl} controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" />
            ) : (
              <video src="/images/intro.mp4" controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" />
            )}`
);

// 2. Fix Our Approach section
const approachBlock = `
      <section className="py-12 px-6 lg:px-12 max-w-5xl mx-auto flex flex-col text-center">
        <h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-[0.1em] mb-4 text-white">
          Our Approach
        </h2>
        <p className="font-sans font-light text-white/60 leading-[2] tracking-wide text-sm md:text-base mb-12">
          Capturing the purest moments with utmost care and creativity.
        </p>

        {pageData?.approachSections && pageData.approachSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {pageData.approachSections.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-black/50 border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all">
                <div className="text-3xl font-oswald text-emerald-400 mb-4">0{i + 1}</div>
                <h3 className="text-xl font-oswald uppercase tracking-widest mb-3">{item.heading}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
`;

content = content.replace(
  /<section className="py-12 px-6 lg:px-12 max-w-5xl mx-auto flex flex-col text-center">\s*<h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-\[0\.1em\] mb-4 text-white">\s*Our Approach\s*<\/h2>\s*<p className="font-sans font-light text-white\/60 leading-\[2\] tracking-wide text-sm md:text-base">\s*Capturing the purest moments with utmost care and creativity\.\s*<\/p>\s*<\/section>/,
  approachBlock
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Fixed Video and Approach sections');
