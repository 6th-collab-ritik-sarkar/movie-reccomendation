import { Info, Mail, Award, Compass, Heart, Film } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 px-4 sm:px-12 pb-20 animate-fade-in max-w-4xl mx-auto min-h-[90vh] flex flex-col justify-between">
      <div>
        {/* Header Hero Section */}
        <header className="text-center mb-12 relative overflow-hidden p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-netflix-red/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-netflix-red/20 rounded-2xl flex items-center justify-center text-netflix-red mx-auto mb-4 border border-netflix-red/30">
            <Film className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Smart<span className="text-netflix-red">Flick</span> AI
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Welcome to the ultimate movie discovery experience. Powered by advanced artificial intelligence to match your cinema search with your emotional state.
          </p>
        </header>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700/80 transition-all group">
            <div className="w-10 h-10 bg-netflix-red/10 rounded-lg flex items-center justify-center text-netflix-red mb-4 border border-netflix-red/20 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">AI Mood Recommendation</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Describe how you feel or what you are looking for, and our custom AI recommendation engine parses your sentiments to find the perfect cinematic matches from OMDb.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700/80 transition-all group">
            <div className="w-10 h-10 bg-netflix-red/10 rounded-lg flex items-center justify-center text-netflix-red mb-4 border border-netflix-red/20 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Interactive Lists & Reviews</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Maintain a personalized watchlist, keep track of your watched trailers history, and write reviews to share your cinematic perspectives.
            </p>
          </div>
        </section>

        {/* Development Credits */}
        <section className="p-8 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center mb-16">
          <Award className="w-8 h-8 text-netflix-red mx-auto mb-3" />
          <h3 className="text-white font-black text-xl mb-2">Creator & Development</h3>
          <p className="text-zinc-300 mb-1">
            Developed with excellence by <span className="font-bold text-white">Ritik Singh</span>
          </p>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Year of Development: 2026</p>
        </section>
      </div>

      {/* Action Footer Button */}
      <footer className="text-center">
        <h4 className="text-white font-bold text-lg mb-3">Have feedback or suggestions?</h4>
        <p className="text-zinc-500 text-sm mb-6">Reach out directly to the developer for feature requests or collaboration.</p>
        <a 
          href="mailto:Ritik75543@gmail.com" 
          className="inline-flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-red-900/20 transform hover:-translate-y-0.5 transition-all text-lg"
        >
          <Mail className="w-5 h-5" /> Chat via Email
        </a>
      </footer>
    </div>
  );
};

export default About;
