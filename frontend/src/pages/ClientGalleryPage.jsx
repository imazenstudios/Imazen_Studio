import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Builds Google Drive thumbnail URL with customizable size
const getDriveThumbnail = (driveId, size = 'w600') =>
  `https://drive.google.com/thumbnail?id=${driveId}&sz=${size}`;

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

  // Lightbox Modal state: { galleryId: string, index: number } | null
  const [lightbox, setLightbox] = useState(null);

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

  const toggleImage = useCallback((galleryId, driveId) => {
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
  }, [submitted]);

  const handleSubmit = async (galleryId) => {
    const selectedDriveIds = Array.from(selections[galleryId] || []);
    if (selectedDriveIds.length === 0) {
      alert('Please select at least one photo before submitting.');
      return;
    }
    const confirmSubmit = window.confirm(
      `You have selected ${selectedDriveIds.length} photos. Once submitted, selections cannot be changed. Proceed?`
    );
    if (!confirmSubmit) return;

    setSubmitting(prev => ({ ...prev, [galleryId]: true }));
    try {
      await axios.put(`${API}/client-gallery/${galleryId}/submit`, { selectedDriveIds });
      setSubmitted(prev => ({ ...prev, [galleryId]: true }));
      setGalleries(prev => prev.map(g => g._id === galleryId ? { ...g, status: 'Submitted' } : g));
      if (lightbox && lightbox.galleryId === galleryId) {
        setLightbox(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(prev => ({ ...prev, [galleryId]: false }));
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;

    const currentGallery = galleries.find(g => g._id === lightbox.galleryId);
    if (!currentGallery) return;

    const images = currentGallery.images;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      } else if (e.key === 'ArrowRight') {
        setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % images.length } : null);
      } else if (e.key === 'ArrowLeft') {
        setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + images.length) % images.length } : null);
      } else if (e.key === ' ') {
        e.preventDefault();
        const currentImg = images[lightbox.index];
        if (currentImg) {
          toggleImage(lightbox.galleryId, currentImg.driveId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, galleries, toggleImage]);

  // Find active image for lightbox
  const activeGallery = lightbox ? galleries.find(g => g._id === lightbox.galleryId) : null;
  const activeImage = (activeGallery && lightbox) ? activeGallery.images[lightbox.index] : null;
  const isImageSelected = (activeGallery && activeImage)
    ? (selections[activeGallery._id] || new Set()).has(activeImage.driveId)
    : false;

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
            Client Photo Gallery
          </h1>
          <p className="text-gray-400 text-sm tracking-wider max-w-lg mx-auto">
            Enter your email to view your photos, open any photo to inspect in full resolution, and choose your selections.
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
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Gallery Collection</p>
                  <h2 className="text-2xl md:text-3xl font-oswald font-bold uppercase tracking-widest text-white">
                    {gallery.eventName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{gallery.clientName}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isSubmitted ? (
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <span>✓</span> Selections Submitted ({selectedCount} photos)
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 tracking-wider">
                        <strong className="text-white font-semibold">{selectedCount}</strong> of {gallery.images.length} selected
                      </span>
                      <button
                        onClick={() => handleSubmit(gallery._id)}
                        disabled={isSubmittingThis || selectedCount === 0}
                        className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                      >
                        {isSubmittingThis ? 'Submitting...' : `Submit Selection (${selectedCount})`}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isSubmitted && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 text-center">
                  <p className="text-emerald-400 text-sm tracking-wider">
                    ✓ Your selection of {selectedCount} images has been submitted to the studio!
                  </p>
                </div>
              )}

              {/* Instructions badge */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4 px-1">
                <span>💡 Click any photo to view full size. Click the checkmark to select.</span>
                <span>Total: {gallery.images.length} Photos</span>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gallery.images.map((img, idx) => {
                  const isSelected = gallerySelections.has(img.driveId);
                  return (
                    <div
                      key={img.driveId}
                      className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 bg-neutral-900 select-none ${
                        isSelected
                          ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400'
                          : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      {/* Clickable Image Thumbnail to open Lightbox */}
                      <div
                        onClick={() => setLightbox({ galleryId: gallery._id, index: idx })}
                        className="w-full h-full cursor-zoom-in"
                        title="Click to view full size"
                      >
                        <img
                          src={getDriveThumbnail(img.driveId, 'w600')}
                          alt={img.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={e => {
                            const proxyUrl = `${API}/client-gallery/image/${img.driveId}`;
                            if (e.target.src !== proxyUrl) {
                              e.target.src = proxyUrl;
                            } else {
                              e.target.style.display = 'none';
                              if (e.target.parentElement) e.target.parentElement.style.background = '#18181b';
                            }
                          }}
                        />
                      </div>

                      {/* Overlay gradient on hover */}
                      <div
                        onClick={() => setLightbox({ galleryId: gallery._id, index: idx })}
                        className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
                          isSelected ? 'bg-emerald-950/20' : 'bg-black/20 group-hover:bg-black/40'
                        }`}
                      />

                      {/* Checkbox Button (Top Right) */}
                      {!isSubmitted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleImage(gallery._id, img.driveId);
                          }}
                          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                            isSelected
                              ? 'bg-emerald-500 text-black scale-105 ring-2 ring-white/50'
                              : 'bg-black/60 text-white/60 hover:bg-black/90 hover:text-white border border-white/20'
                          }`}
                          title={isSelected ? 'Deselect photo' : 'Select photo'}
                        >
                          {isSelected ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-white/50" />
                          )}
                        </button>
                      )}

                      {/* Submitted checkmark indicator */}
                      {isSubmitted && isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-emerald-500 text-black rounded-full flex items-center justify-center z-20 shadow-md">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      {/* Image Name Tooltip & Expand Hint (Bottom) */}
                      <div
                        onClick={() => setLightbox({ galleryId: gallery._id, index: idx })}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2.5 py-2 cursor-pointer flex items-center justify-between"
                      >
                        <p className="text-[10px] text-white/90 truncate font-mono">{img.name}</p>
                        <span className="text-[9px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0">
                          🔍 Open
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {gallery.images.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-12">No images found in this gallery folder.</p>
              )}

              {/* Bottom Submit Bar */}
              {!isSubmitted && gallery.images.length > 8 && (
                <div className="mt-8 flex items-center justify-center gap-4 border-t border-white/10 pt-6">
                  <span className="text-sm text-gray-400">
                    <strong className="text-white">{selectedCount}</strong> photos selected
                  </span>
                  <button
                    onClick={() => handleSubmit(gallery._id)}
                    disabled={isSubmittingThis || selectedCount === 0}
                    className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
                  >
                    {isSubmittingThis ? 'Submitting...' : `Submit My Selections (${selectedCount})`}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* LIGHTBOX MODAL */}
        {lightbox && activeGallery && activeImage && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-fade-in select-none">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  {lightbox.index + 1} / {activeGallery.images.length}
                </span>
                <span className="text-xs text-white/80 font-mono hidden sm:inline max-w-xs truncate">
                  {activeImage.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Select / Deselect Button in Lightbox */}
                {!submitted[activeGallery._id] && (
                  <button
                    onClick={() => toggleImage(activeGallery._id, activeImage.driveId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                      isImageSelected
                        ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {isImageSelected ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/60" />
                        <span>Select Photo</span>
                      </>
                    )}
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setLightbox(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all text-xl px-3"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Image Viewer Area */}
            <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
              {/* Previous Image Button */}
              <button
                onClick={() => setLightbox(prev => ({
                  ...prev,
                  index: (prev.index - 1 + activeGallery.images.length) % activeGallery.images.length
                }))}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all shadow-xl"
                title="Previous Photo (Left Arrow)"
              >
                ◀
              </button>

              {/* Full-res Photo */}
              <div className="max-w-full max-h-[82vh] flex items-center justify-center">
                <img
                  src={getDriveThumbnail(activeImage.driveId, 'w1920')}
                  alt={activeImage.name}
                  className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl transition-all duration-150"
                  onError={e => {
                    const proxyUrl = `${API}/client-gallery/image/${activeImage.driveId}`;
                    if (e.target.src !== proxyUrl) {
                      e.target.src = proxyUrl;
                    }
                  }}
                />
              </div>

              {/* Next Image Button */}
              <button
                onClick={() => setLightbox(prev => ({
                  ...prev,
                  index: (prev.index + 1) % activeGallery.images.length
                }))}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center transition-all shadow-xl"
                title="Next Photo (Right Arrow)"
              >
                ▶
              </button>
            </div>

            {/* Bottom Info & Shortcuts Bar */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-[11px] text-gray-400">
              <span className="font-mono text-white/70 truncate">{activeImage.name}</span>
              <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500">
                <span>Navigate: <strong>← →</strong></span>
                <span>Select: <strong>Space</strong></span>
                <span>Close: <strong>Esc</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Imazen Studios · All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;
