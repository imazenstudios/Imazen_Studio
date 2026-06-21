const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/admin/CalendarView.jsx', 'utf8');

// 1. Remove past date block
content = content.replace(/const isPast = dateStr < todayStr;/g, 'const isPast = false; // dateStr < todayStr;');

// 2. Add popup for event card
// Add selectedEvent state
content = content.replace(/const \[isLoading, setIsLoading\] = useState\(false\);/, "const [isLoading, setIsLoading] = useState(false);\n  const [selectedEvent, setSelectedEvent] = useState(null);");

// Modify grid.push to include booking data
content = content.replace(/grid\.push\(\{ type, booked: true, text: b\.shootType \|\| b\.studioName \|\| 'Booked', status: b\.status, isManual: false \}\);/g, "grid.push({ type, booked: true, text: b.shootType || b.studioName || 'Booked', status: b.status, isManual: false, booking: b });");

// Modify the spot div to have onClick and show popup
const oldSpotDiv = `<div 
                    key={idx} 
                    className={\`h-16 flex items-center justify-center rounded border text-center p-1 transition-colors \${
                      spot.booked ? \`\${bgCol} border-transparent text-white shadow-lg\` : 'bg-transparent border-white/20 text-gray-500'
                    }\`}
                  >`;
                  
const newSpotDiv = `<div 
                    key={idx} 
                    onClick={() => spot.booked && !spot.isManual && setSelectedEvent(spot.booking)}
                    className={\`h-16 flex items-center justify-center rounded border text-center p-1 transition-colors \${
                      spot.booked && !spot.isManual ? 'cursor-pointer hover:scale-105 ' : ''
                    }\${
                      spot.booked ? \`\${bgCol} border-transparent text-white shadow-lg\` : 'bg-transparent border-white/20 text-gray-500'
                    }\`}
                  >`;
                  
content = content.replace(oldSpotDiv, newSpotDiv);

// Add the popup modal to the return
const modalJSX = `
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111] border border-white/20 p-6 rounded-2xl w-full max-w-md relative text-white">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
            <h3 className="text-xl font-oswald uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Booking Details</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Name:</span> {selectedEvent.name}</p>
              <p><span className="text-gray-500">Phone:</span> {selectedEvent.phone}</p>
              <p><span className="text-gray-500">Service:</span> {selectedEvent.shootType || selectedEvent.studioName}</p>
              <p><span className="text-gray-500">Package:</span> {selectedEvent.package}</p>
              <p><span className="text-gray-500">Status:</span> <span className="uppercase tracking-widest text-xs border border-white/20 px-2 py-1 rounded ml-2">{selectedEvent.status}</span></p>
            </div>
          </motion.div>
        </div>
      )}
`;

content = content.replace(/<\/div>\s*<div className="flex flex-col md:flex-row gap-6 items-start">/, `${modalJSX}\n      <div className="flex flex-col md:flex-row gap-6 items-start">`);

fs.writeFileSync('frontend/src/components/admin/CalendarView.jsx', content, 'utf8');
console.log('Fixed CalendarView.jsx');
