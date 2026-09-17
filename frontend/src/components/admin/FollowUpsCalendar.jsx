import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FollowUpsCalendar = ({ leads, inquiries, setActiveTab }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Combine follow-ups
  const allFollowUps = [];
  
  const extractFollowUps = (items, type) => {
    items?.forEach(item => {
      item.followUps?.forEach(fu => {
        if (fu.scheduledDate) {
          allFollowUps.push({
            ...fu,
            parentType: type,
            parentName: item.name,
            parentPhone: item.phone,
            parentId: item._id,
            dateObj: new Date(fu.scheduledDate)
          });
        }
      });
    });
  };
  
  extractFollowUps(leads, 'leads');
  extractFollowUps(inquiries, 'inquiries');
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    const today = new Date();
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-[#0a0a0a]/50 border border-white/5 opacity-50"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      const dayFollowUps = allFollowUps.filter(f => 
        f.dateObj.getDate() === d && 
        f.dateObj.getMonth() === month && 
        f.dateObj.getFullYear() === year
      );

      days.push(
        <div key={d} className={`min-h-[100px] border border-white/5 p-2 transition-colors ${isToday ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-[#111] hover:bg-[#1a1a1a]'}`}>
          <div className={`text-xs font-bold mb-2 ${isToday ? 'text-emerald-400' : 'text-white/50'}`}>
            {d}
          </div>
          <div className="space-y-1">
            {dayFollowUps.map((fu, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveTab(fu.parentType)}
                className={`text-[10px] p-1.5 rounded cursor-pointer truncate transition-colors ${
                  fu.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 
                  'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                }`}
                title={`${fu.parentName} - ${fu.note}`}
              >
                <div className="font-bold uppercase tracking-wider">{fu.parentType === 'leads' ? 'L' : 'I'}: {fu.parentName}</div>
                <div className="truncate opacity-75">{fu.note}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#111] p-4 rounded-xl border border-white/10">
        <h3 className="text-lg font-oswald uppercase tracking-widest text-white">Follow-ups Calendar</h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="text-white/50 hover:text-white px-3 py-1 bg-white/5 rounded border border-white/10">← Prev</button>
          <span className="text-white font-medium uppercase tracking-widest min-w-[150px] text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="text-white/50 hover:text-white px-3 py-1 bg-white/5 rounded border border-white/10">Next →</button>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/10 bg-black/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-xs uppercase tracking-widest text-white/40 font-bold border-r border-white/5 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderDays()}
        </div>
      </div>
      
      <div className="flex gap-4 text-xs uppercase tracking-widest">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/50"></span> Pending</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></span> Completed</div>
        <div className="flex items-center gap-2 ml-4"><span className="text-white/50">L = Lead, I = Inquiry</span></div>
      </div>
    </div>
  );
};

export default FollowUpsCalendar;
