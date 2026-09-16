import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Builds Google Drive thumbnail URL from a driveId
const getDriveThumbnail = (driveId) =>
  `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;

const ClientGalleryPage = () => {
  const [email, setEmail] = useState('');
  const [galleries, setGalleries] = useState([]);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // Per-gallery selection state: { [galleryId]: Set<driveId> }
  const [selections, setSelections] = useState({});
  // Per-gallery submission state
  const [submitted, setSubmitted] = useState({});
  const [submitting, setSubmitting] = useState({});

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyError('');
    setIsVerifying(true);
    try {
      const res = await axios.post(`${API}/client-gallery/verify`, { email });
      setGalleries(res.data);
      // Initialize selections from existing isSelected flags
      const initial = {};
      res.data.forEach(g => {
        initial[g._id] = new Set(g.images.filter(i => i.isSelected).map(i => i.driveId));
      });
      setSelections(initial);
      // Mark already-submitted galleries
      const sub = {};
      res.data.forEach(g => { if (g.status === 'Submitted') sub[g._id] = true; });
      setSubmitted(sub);
      setVerified(true);
    } catch (err) {
      setVerifyError(err.response?.data?.error || 'No galleries found for this email.');
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleImage = (galleryId, driveId) => {
    if (submitted[galleryId]) return; // Can't change after submission
    setSelections(prev => {
      const next = new Set(prev[galleryId] || []);
      if (next.has(driveId)) {
        next.delete(driveId);
      } else {
        next.add(driveId);
      }
      return { ...prev, [galleryId]: next };
    });
  };

  const handleSubmit = async (galleryId) => {
    const selectedDriveIds = Array.from(selections[galleryId] || []);
    setSubmitting(prev => ({ ...prev, [galleryId]: true }));
    try {
      await axios.put(`${API}/client-gallery/${galleryId}/submit`, { selectedDriveIds });
      setSubmitted(prev => ({ ...prev, [galleryId]: true }));
      // Update gallery status in local state
      setGalleries(prev => prev.map(g => g._id === galleryId ? { ...g, status: 'Submitted' } : g));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(prev => ({ ...prev, [galleryId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 px-4 py-16 md:py-24 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img src="/images/logo.png" alt="Imazen Studios" className="h-10 mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase tracking-widest text-white mb-3">
            Your Photo Gallery
          </h1>
          <p className="text-gray-400 text-sm tracking-wider max-w-lg mx-auto">
            Enter your email address to access your exclusive gallery and select your favourite images.
          </p>
        </div>

        {/* Email Verification */}
        {!verified && (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleVerify} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Your Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all mb-4"
              />
              {verifyError && (
                <p className="text-red-400 text-xs mb-4 tracking-wider">{verifyError}</p>
              )}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Access My Gallery →'}
              </button>
            </form>
          </div>
        )}

        {/* Galleries */}
        {verified && galleries.map(gallery => {
          const gallerySelections = selections[gallery._id] || new Set();
          const isSubmitted = submitted[gallery._id];
          const isSubmittingThis = submitting[gallery._id];
          const selectedCount = gallerySelections.size;

          return (
            <div key={gallery._id} className="mb-16">
              {/* Gallery Header */}
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Gallery</p>
                  <h2 className="text-2xl md:text-3xl font-oswald font-bold uppercase tracking-widest text-white">
                    {gallery.eventName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{gallery.clientName}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isSubmitted ? (
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs uppercase tracking-widest font-bold">
                      ✓ Submitted
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 tracking-wider">
                        {selectedCount} selected
                      </span>
                      <button
                        onClick={() => handleSubmit(gallery._id)}
                        disabled={isSubmittingThis || selectedCount === 0}
                        className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmittingThis ? 'Submitting...' : `Submit Selection (${selectedCount})`}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isSubmitted && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6 text-center">
                  <p className="text-emerald-400 text-sm tracking-wider">Your selection has been submitted! We'll be in touch shortly.</p>
                </div>
              )}

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gallery.images.map((img) => {
                  const isSelected = gallerySelections.has(img.driveId);
                  return (
                    <button
                      key={img.driveId}
                      onClick={() => toggleImage(gallery._id, img.driveId)}
                      disabled={isSubmitted}
                      className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 focus:outline-none ${
                        isSelected
                          ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]'
                          : 'border-transparent hover:border-white/40'
                      } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <img
                        src={getDriveThumbnail(img.driveId)}
                        alt={img.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#111'; }}
                      />
                      {/* Selection overlay */}
                      <div className={`absolute inset-0 transition-all duration-200 ${isSelected ? 'bg-white/10' : 'bg-black/20 group-hover:bg-black/10'}`} />
                      {/* Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {/* Image name tooltip */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-white/80 truncate">{img.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {gallery.images.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-12">No images available in this gallery.</p>
              )}

              {/* Submit button (bottom) for large galleries */}
              {!isSubmitted && gallery.images.length > 10 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <span className="text-sm text-gray-400">{selectedCount} images selected</span>
                  <button
                    onClick={() => handleSubmit(gallery._id)}
                    disabled={isSubmittingThis || selectedCount === 0}
                    className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmittingThis ? 'Submitting...' : `Submit My Selection (${selectedCount})`}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Imazen Studios · All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;
