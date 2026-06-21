const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

const newSections = `

                        {/* LOGO UPLOAD */}
                        <div className="border-t border-white/5 pt-6 mt-6 mb-6">
                           <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase mb-4">Header Logo</h3>
                           <DragDropImageUploader currentImage={editingLandingPage.logoUrl || ''} onUploadSuccess={(url) => setEditingLandingPage({...editingLandingPage, logoUrl: url})} />
                        </div>

                        {/* SERVICE CARDS (WHAT WE DO BEST) */}
                        <div className="border-t border-white/5 pt-6 mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase">What We Do Best (Service Cards)</h3>
                            <button type="button" onClick={() => {
                              const newCards = [...(editingLandingPage.serviceCards || []), { category: '', title: '', description: '', images: [] }];
                              setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                            }} className="text-xs uppercase bg-white/10 px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">+ Add Card</button>
                          </div>
                          <div className="mb-4">
                              <label className="block text-xs uppercase text-gray-400 mb-2">Section Heading</label>
                              <input type="text" className={glassInput} value={editingLandingPage.serviceCardsHeading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, serviceCardsHeading: e.target.value})} placeholder="e.g. What We Do Best" />
                          </div>
                          
                          <div className="space-y-6">
                            {(editingLandingPage.serviceCards || []).map((card, idx) => (
                              <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-4 relative">
                                <button type="button" onClick={() => {
                                  const newCards = [...editingLandingPage.serviceCards];
                                  newCards.splice(idx, 1);
                                  setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                }} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xs uppercase">Remove</button>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[9px] text-gray-500 mb-1 uppercase">Category Label</label>
                                    <input type="text" className={glassInput + ' py-2 text-xs'} value={card.category || ''} onChange={e => {
                                      const newCards = [...editingLandingPage.serviceCards];
                                      newCards[idx].category = e.target.value;
                                      setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                    }} placeholder="e.g. 5-15 Days" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-gray-500 mb-1 uppercase">Title</label>
                                    <input type="text" className={glassInput + ' py-2 text-xs'} value={card.title || ''} onChange={e => {
                                      const newCards = [...editingLandingPage.serviceCards];
                                      newCards[idx].title = e.target.value;
                                      setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                    }} placeholder="e.g. Newborn Shoots" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[9px] text-gray-500 mb-1 uppercase">Description</label>
                                  <textarea className={glassInput + ' py-2 text-xs'} value={card.description || ''} onChange={e => {
                                    const newCards = [...editingLandingPage.serviceCards];
                                    newCards[idx].description = e.target.value;
                                    setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                  }} />
                                </div>
                                
                                <div>
                                  <label className="block text-[9px] text-gray-500 mb-1 uppercase">Card Background Images</label>
                                  <DragDropImageUploader currentImage={''} multiple={true} disableCompression={true} onUploadSuccess={(urls) => {
                                    const newCards = [...editingLandingPage.serviceCards];
                                    newCards[idx].images = [...(newCards[idx].images || []), ...urls];
                                    setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                  }} />
                                  <div className="grid grid-cols-3 gap-2 mt-2">
                                    {(card.images || []).map((img, i) => (
                                      <div key={i} className="relative group">
                                        <img src={img} className="w-full h-16 object-cover rounded" />
                                        <button type="button" onClick={() => {
                                          const newCards = [...editingLandingPage.serviceCards];
                                          newCards[idx].images.splice(i, 1);
                                          setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                        }} className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex justify-center items-center opacity-0 group-hover:opacity-100">×</button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COMFORT SECTIONS */}
                        <div className="border-t border-white/5 pt-6 mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase">Pure Comfort for Mother & Baby</h3>
                            <button type="button" onClick={() => {
                              const newItems = [...(editingLandingPage.comfortItems || []), { title: '', desc: '' }];
                              setEditingLandingPage({...editingLandingPage, comfortItems: newItems});
                            }} className="text-xs uppercase bg-white/10 px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">+ Add Item</button>
                          </div>
                          <div className="mb-4">
                              <label className="block text-xs uppercase text-gray-400 mb-2">Section Heading</label>
                              <input type="text" className={glassInput} value={editingLandingPage.comfortHeading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, comfortHeading: e.target.value})} placeholder="e.g. Pure Comfort for Mother & Baby" />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {(editingLandingPage.comfortItems || []).map((item, idx) => (
                              <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3 relative">
                                <button type="button" onClick={() => {
                                  const newItems = [...editingLandingPage.comfortItems];
                                  newItems.splice(idx, 1);
                                  setEditingLandingPage({...editingLandingPage, comfortItems: newItems});
                                }} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xs uppercase">Remove</button>
                                <div>
                                  <label className="block text-[9px] text-gray-500 mb-1 uppercase">Title</label>
                                  <input type="text" className={glassInput + ' py-2 text-xs'} value={item.title || ''} onChange={e => {
                                    const newItems = [...editingLandingPage.comfortItems];
                                    newItems[idx].title = e.target.value;
                                    setEditingLandingPage({...editingLandingPage, comfortItems: newItems});
                                  }} />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-gray-500 mb-1 uppercase">Description</label>
                                  <textarea className={glassInput + ' py-2 text-xs'} value={item.desc || ''} onChange={e => {
                                    const newItems = [...editingLandingPage.comfortItems];
                                    newItems[idx].desc = e.target.value;
                                    setEditingLandingPage({...editingLandingPage, comfortItems: newItems});
                                  }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

`;

content = content.replace(
  /\{\/\* GLOBAL HERO SETTINGS \*\/\}/,
  newSections + '{/* GLOBAL HERO SETTINGS */}'
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Patched AdminDashboard.jsx');
