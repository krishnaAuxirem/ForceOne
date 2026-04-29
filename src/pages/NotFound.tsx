import { Link } from 'react-router-dom';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-teal px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#E64833]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-[#E64833]" />
        </div>
        <h1 className="text-8xl font-bold text-white font-display mb-3">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Location Not Found</h2>
        <p className="text-[#90AEAD] mb-8 leading-relaxed">
          It seems this field location doesn't exist on our map. Let's get you back on route.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-white font-semibold transition-all">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
