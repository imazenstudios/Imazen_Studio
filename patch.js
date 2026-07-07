const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

const oldCode = \                                              <button 
                                                key={num}
                                                onClick={() => {
                                                  const newCapacities = { ...(settings.weekdayCapacities || { '0':3,'1':3,'2':3,'3':3,'4':3,'5':3,'6':3 }), [dayIndex]: num };
                                                  setSettings({ ...settings, weekdayCapacities: newCapacities });
                                                  axios.put(\\\\/settings/blocked-weekdays\\\, { weekdayCapacities: newCapacities });
                                                  // If the selected slotDate is this weekday, update slotData
                                                  if (new Date(slotDate).getDay() === dayIndex) {
                                                    axios.put(\\\\/bookings/slots/capacity\\\, { date: slotDate, capacity: num }).then(() => {
                                                      fetchSlotsForAdmin(slotDate);
                                                    });
                                                  }
                                                }}
                                                className={\\\w-8 h-8 rounded flex items-center justify-center text-xs font-oswald transition-colors border \\\\}
                                              >
                                                {num}
                                              </button>\;

const newCode = \                                              <button 
                                                key={num}
                                                onClick={async () => {
                                                  const newCapacities = { ...(settings.weekdayCapacities || { '0':3,'1':3,'2':3,'3':3,'4':3,'5':3,'6':3 }), [dayIndex]: num };
                                                  setSettings({ ...settings, weekdayCapacities: newCapacities });
                                                  try {
                                                    await axios.put(\\\\/settings/blocked-weekdays\\\, { weekdayCapacities: newCapacities });
                                                    if (new Date(slotDate).getUTCDay() === dayIndex) {
                                                      fetchSlotsForAdmin(slotDate);
                                                    }
                                                  } catch(e) { console.error(e); }
                                                }}
                                                className={\\\w-8 h-8 rounded flex items-center justify-center text-xs font-oswald transition-colors border \\\\}
                                              >
                                                {num}
                                              </button>\;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content);
  console.log("PATCH SUCCESS");
} else {
  console.log("OLD CODE NOT FOUND");
}
