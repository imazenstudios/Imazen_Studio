import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DragDropImageUploader from '../DragDropImageUploader';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BusinessView = ({ bookings = [], expenses = [], partners = [], teamMembers = [], highlightedBookingId, onAddPartner, onAddExpense, onEditPartner, onEditExpense, onDeletePartner, onDeleteExpense, defaultViewMode = 'overview', hideTabsAndOverview = false }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [viewMode, setViewMode] = useState(defaultViewMode); // 'overview', 'studio_shoots', 'props', 'events'
  const [propsData, setPropsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [rentalItems, setRentalItems] = useState([]);
  const [editingProp, setEditingProp] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [inventoryImageUrl, setInventoryImageUrl] = useState('');
  const [viewShootExpenses, setViewShootExpenses] = useState(null);

  useEffect(() => {
    fetchProps();
    fetchEvents();
    fetchRentalItems();
  }, [defaultViewMode]);

  useEffect(() => {
    setViewMode(defaultViewMode);
  }, [defaultViewMode]);

  useEffect(() => {
    if (highlightedBookingId && viewMode === 'studio_shoots') {
      setTimeout(() => {
        const el = document.getElementById(`business-booking-${highlightedBookingId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightedBookingId, viewMode]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events`);
      setEventsData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRentalItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/rental-items`);
      setRentalItems(res.data);
    } catch (error) {
      console.error("Error fetching rental items:", error);
    }
  };

  const fetchProps = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/props`);
      setPropsData(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
         console.warn("Props endpoint not found. Backend needs restart.");
      }
    }
  };

  const handleSaveProp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const calculatedTotal = (editingProp?.items || []).reduce((sum, item) => sum + item.price, 0);
    const totalAmount = Number(formData.get('totalAmount') || calculatedTotal);
    const paidAmount = Number(formData.get('paidAmount') || 0);
    const pendingAmount = totalAmount - paidAmount;

    const data = {
      customerName: formData.get('customerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      photo: editingProp?.photo || '',
      totalAmount: totalAmount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      items: editingProp?.items || []
    };
    
    try {
      if (editingProp._id) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/props/${editingProp._id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/props`, data);
      }
      setEditingProp(null);
      fetchProps();
    } catch (error) {
      console.error(error);
      alert('Failed to save prop rental: ' + (error.response?.data?.error || error.message || 'Server not reachable. Did you restart the backend?'));
    }
  };

  const handleDeleteProp = async (id) => {
    if(!window.confirm('Delete this prop rental?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/props/${id}`);
      fetchProps();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const totalAmount = Number(formData.get('totalAmount') || 0);
    const paidAmount = Number(formData.get('paidAmount') || 0);
    const pendingAmount = totalAmount - paidAmount;

    const data = {
        name: formData.get('name'),
        clientName: formData.get('clientName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        pendingAmount: pendingAmount,
        discount: Number(formData.get('discount') || 0),
        status: formData.get('status'),
        subEvents: formData.get('subEvents'),
        services: editingEvent?.services || [],
        subEventList: editingEvent?.subEventList || [],
        deliverables: editingEvent?.deliverables || [],
        complimentries: editingEvent?.complimentries || []
    };
    
    try {
      if (editingEvent._id) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events/${editingEvent._id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events`, data);
      }
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to save event: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteEvent = async (id) => {
    if(!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEventField = async (id, field, value) => {
    try {
      const data = { [field]: value };
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events/${id}`, data);
      
      // Update local state without full refetch for snappiness
      setEventsData(prev => prev.map(ev => 
        ev._id === id ? { ...ev, ...data } : ev
      ));
    } catch (error) {
      console.error('Error updating event field:', error);
      alert('Failed to update event field');
    }
  };

  const handleSaveInventoryItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      price: Number(formData.get('price') || 0),
      imageUrl: inventoryImageUrl
    };
    
    try {
      if (editingInventoryItem?._id) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/rental-items/${editingInventoryItem._id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/rental-items`, data);
      }
      setEditingInventoryItem(null);
      setInventoryImageUrl('');
      e.target.reset();
      fetchRentalItems();
    } catch (error) {
      console.error(error);
      alert('Failed to save item');
    }
  };

  const handleDeleteInventoryItem = async (id) => {
    if(!window.confirm('Delete this inventory item?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/rental-items/${id}`);
      fetchProps();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendEventPdf = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events/${id}/send-pdf`);
      alert("PDF Sent successfully!");
    } catch (error) {
      console.error(error);
      alert('Failed to send PDF: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDownloadEventPdf = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/business/events/${id}/download-pdf`, {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const event = eventsData.find(e => e._id === id);
      const phone = event?.phone || 'Event';
      link.setAttribute('download', `ImazenStudios_${phone}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert('Failed to download PDF');
    }
  };

  const filterByDate = (items, dateField = 'date') => {
    return items.filter(item => {
      if (!item[dateField] && !item.createdAt) return true;
      const itemDate = new Date(item[dateField] || item.createdAt);
      itemDate.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (filterType === 'all') return true;

      if (filterType === 'weekly') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return itemDate >= startOfWeek;
      }

      if (filterType === 'monthly') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return itemDate >= startOfMonth;
      }

      if (filterType === 'custom') {
        let start = customStartDate ? new Date(customStartDate) : null;
        let end = customEndDate ? new Date(customEndDate) : null;
        if (start) start.setHours(0,0,0,0);
        if (end) end.setHours(23,59,59,999);
        if (start && end) return itemDate >= start && itemDate <= end;
        if (start) return itemDate >= start;
        if (end) return itemDate <= end;
      }
      return true;
    });
  };

  // Base Data
  const applySearch = (items) => {
    if (!searchQuery) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter(item => 
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (item.customerName && item.customerName.toLowerCase().includes(lowerQuery)) ||
      (item.clientName && item.clientName.toLowerCase().includes(lowerQuery)) ||
      (item.phone && item.phone.includes(searchQuery)) ||
      (item.email && item.email.toLowerCase().includes(lowerQuery))
    );
  };

  const allBookings = applySearch(filterByDate(bookings, 'date').filter(b => b.status !== 'Cancelled'));
  const confirmedBookings = applySearch(filterByDate(bookings.filter(b => b.status === 'Confirmed' || b.status === 'Finished'), 'date'));
  const filteredExpenses = filterByDate(expenses, 'date');
  const filteredProps = applySearch(filterByDate(propsData, 'date'));
  const filteredEvents = applySearch(filterByDate(eventsData, 'date'));

  // Calculations
    const getTotals = () => {
      let shootEarnings = 0;
      let propEarnings = 0;
      let eventEarnings = 0;
      
      let pendingShoots = 0;
      let pendingProps = 0;
      let pendingEvents = 0;
  
      let studioExpenses = 0;
      let shootExpenses = 0;
      let propExpenses = 0;
      let eventExpenses = 0;
  
      if (viewMode === 'overview') {
        // Overall Earnings: All bookings + Props + Events
        allBookings.forEach(b => {
          shootEarnings += (b.totalAmount || 0) - (b.pendingAmount || 0);
          pendingShoots += (b.pendingAmount || 0);
        });
        filteredProps.forEach(p => {
          propEarnings += p.paidAmount || p.totalAmount || 0;
          pendingProps += p.pendingAmount || 0;
        });
        filteredEvents.forEach(e => {
          eventEarnings += e.paidAmount || 0;
          pendingEvents += e.pendingAmount || 0;
        });
        studioExpenses = filteredExpenses.filter(e => e.type === 'Studio').reduce((a, b) => a + b.amount, 0);
        shootExpenses = filteredExpenses.filter(e => e.type === 'Shoot').reduce((a, b) => a + b.amount, 0);
        propExpenses = filteredExpenses.filter(e => e.type === 'Prop').reduce((a, b) => a + b.amount, 0);
        eventExpenses = filteredExpenses.filter(e => e.type === 'Event').reduce((a, b) => a + b.amount, 0);
      } 
      else if (viewMode === 'studio_shoots') {
        // Earnings from studio shoots only
        allBookings.forEach(b => {
          shootEarnings += (b.totalAmount || 0) - (b.pendingAmount || 0);
          pendingShoots += (b.pendingAmount || 0);
        });
        shootExpenses = filteredExpenses.filter(e => e.type === 'Shoot' && allBookings.some(cb => cb._id === e.bookingId)).reduce((a, b) => a + b.amount, 0);
      }
      else if (viewMode === 'props') {
        // Earnings from props only
        filteredProps.forEach(p => {
          propEarnings += p.paidAmount || p.totalAmount || 0;
          pendingProps += p.pendingAmount || 0;
        });
        propExpenses = filteredExpenses.filter(e => e.type === 'Prop').reduce((a, b) => a + b.amount, 0);
      }
      else if (viewMode === 'events') {
        // Earnings from events only
        filteredEvents.forEach(e => {
          eventEarnings += e.paidAmount || 0;
          pendingEvents += e.pendingAmount || 0;
        });
        eventExpenses = filteredExpenses.filter(e => e.type === 'Event').reduce((a, b) => a + b.amount, 0);
      }
  
      const earnings = shootEarnings + propEarnings + eventEarnings;
      const pending = pendingShoots + pendingProps + pendingEvents;
      let totalExpenses = studioExpenses + shootExpenses + propExpenses + eventExpenses;
      
      // If we're not in overview, and looking at specific tabs, their expenses only represent their specific category
      if (viewMode === 'studio_shoots') totalExpenses = shootExpenses;
      if (viewMode === 'props') totalExpenses = propExpenses;
      if (viewMode === 'events') totalExpenses = eventExpenses;
  
      const profit = earnings - totalExpenses;
      
      // Profit per category (approximate for overview breakdown)
      const profitShoots = shootEarnings - shootExpenses;
      const profitProps = propEarnings - propExpenses;
      const profitEvents = eventEarnings - eventExpenses;
  
      return { 
        earnings, shootEarnings, propEarnings, eventEarnings, 
        pending, pendingShoots, pendingProps, pendingEvents,
        studioExpenses, shootExpenses, propExpenses, eventExpenses, totalExpenses, 
        profit, profitShoots, profitProps, profitEvents
      };
  };

  const totals = getTotals();

  const renderPartnerProfits = () => (
    <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm uppercase tracking-widest text-white/70">
            Partner Profits ({viewMode.replace('_', ' ')})
          </h4>

        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {partners.map(p => {
          const shareAmount = totals.profit * (p.sharePercentage / 100);
          return (
            <div key={p._id} className="p-4 border border-white/10 rounded-lg relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{p.name}</h5>
                  <p className="text-xs text-white/50">{p.sharePercentage}% Share</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-emerald-400">₹{shareAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => onEditPartner(p)} className="text-xs text-amber-500">Edit</button>
                <button onClick={() => onDeletePartner(p._id)} className="text-xs text-red-500">Delete</button>
              </div>
            </div>
          )
        })}
        {partners.length === 0 && <p className="text-white/40 text-sm">No partners added yet.</p>}
      </div>
    </div>
  );

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Total Business</p>
        <p className="text-3xl font-light text-emerald-400">₹{totals.earnings.toLocaleString()}</p>
        <p className="text-xs text-white mt-2">
          {viewMode === 'overview' && `Shoots: ₹${totals.shootEarnings} | Rentals: ₹${totals.propEarnings} | Events: ₹${totals.eventEarnings}`}
          {viewMode === 'studio_shoots' && `Shoots: ₹${totals.shootEarnings}`}
          {viewMode === 'props' && `Rentals: ₹${totals.propEarnings}`}
          {viewMode === 'events' && `Events: ₹${totals.eventEarnings}`}
        </p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Pending Amount</p>
        <p className="text-3xl font-light text-amber-500">₹{totals.pending.toLocaleString()}</p>
        <p className="text-xs text-white mt-2">
          {viewMode === 'overview' && `Shoots: ₹${totals.pendingShoots} | Rentals: ₹${totals.pendingProps} | Events: ₹${totals.pendingEvents}`}
          {viewMode === 'studio_shoots' && `Shoots: ₹${totals.pendingShoots}`}
          {viewMode === 'props' && `Rentals: ₹${totals.pendingProps}`}
          {viewMode === 'events' && `Events: ₹${totals.pendingEvents}`}
        </p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Total Expenses</p>
        <p className="text-3xl font-light text-red-400">₹{totals.totalExpenses.toLocaleString()}</p>
        <p className="text-xs text-white mt-2">
          {viewMode === 'overview' && `Studio: ₹${totals.studioExpenses} | Shoot: ₹${totals.shootExpenses} | Events: ₹${totals.eventExpenses}`}
          {viewMode === 'studio_shoots' && `Shoot Expenses: ₹${totals.shootExpenses}`}
          {viewMode === 'props' && `No Expenses tracked`}
          {viewMode === 'events' && `Events: ₹${totals.eventExpenses}`}
        </p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Net Profit</p>
        <p className="text-3xl font-light text-white">₹{totals.profit.toLocaleString()}</p>
        <p className="text-xs text-white mt-2">
          {viewMode === 'overview' && `Shoots: ₹${totals.profitShoots} | Rentals: ₹${totals.profitProps} | Events: ₹${totals.profitEvents}`}
          {viewMode === 'studio_shoots' && `Shoots: ₹${totals.profitShoots}`}
          {viewMode === 'props' && `Rentals: ₹${totals.profitProps}`}
          {viewMode === 'events' && `Events: ₹${totals.profitEvents}`}
        </p>
      </div>

      {/* Pie Chart Section */}
      <div className="col-span-1 md:col-span-4 bg-[#111] p-6 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/3">
           <h4 className="text-sm uppercase tracking-widest text-white/70 mb-2">Financial Breakdown</h4>
           <p className="text-xs text-white/40 mb-6">Visual representation of earnings and expenses for the current view.</p>
           
           <div className="space-y-4">
             {(() => {
               const data = viewMode === 'overview' 
                 ? [
                     { name: 'Shoot Profits', value: Math.max(0, totals.profitShoots), color: '#10b981' },
                     { name: 'Prop Profits', value: Math.max(0, totals.profitProps), color: '#3b82f6' },
                     { name: 'Event Profits', value: Math.max(0, totals.profitEvents), color: '#f59e0b' },
                     { name: 'Expenditure', value: Math.max(0, totals.totalExpenses), color: '#ef4444' }
                   ].filter(d => d.value > 0)
                 : [
                     { name: 'Total Business', value: Math.max(0, totals.earnings), color: '#3b82f6' },
                     { name: 'Pending', value: Math.max(0, totals.pending), color: '#f59e0b' },
                     { name: 'Total Expenses', value: Math.max(0, totals.totalExpenses), color: '#ef4444' },
                     { name: 'Net Profit', value: Math.max(0, totals.profit), color: '#10b981' }
                   ].filter(d => d.value > 0);

               if (data.length === 0 || data.every(d => d.value === 0)) return <p className="text-xs text-white/30 italic">No financial data to display.</p>;
               
               return data.map((d, i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                     <span className="text-white/70">{d.name}</span>
                   </div>
                   <span className="font-mono text-white">₹{d.value.toLocaleString()}</span>
                 </div>
               ));
             })()}
           </div>
        </div>
        <div className="w-full md:w-2/3 h-64">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={
                   viewMode === 'overview' 
                     ? [
                         { name: 'Shoot Profits', value: Math.max(0, totals.profitShoots), color: '#10b981' },
                         { name: 'Prop Profits', value: Math.max(0, totals.profitProps), color: '#3b82f6' },
                         { name: 'Event Profits', value: Math.max(0, totals.profitEvents), color: '#f59e0b' },
                         { name: 'Expenditure', value: Math.max(0, totals.totalExpenses), color: '#ef4444' }
                       ]
                     : [
                         { name: 'Total Business', value: Math.max(0, totals.earnings), color: '#3b82f6' },
                         { name: 'Pending', value: Math.max(0, totals.pending), color: '#f59e0b' },
                         { name: 'Total Expenses', value: Math.max(0, totals.totalExpenses), color: '#ef4444' },
                         { name: 'Net Profit', value: Math.max(0, totals.profit), color: '#10b981' }
                       ]
                 }
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={100}
                 paddingAngle={5}
                 dataKey="value"
               >
                 {(
                   viewMode === 'overview' 
                     ? [
                         { name: 'Shoot Profits', value: Math.max(0, totals.profitShoots), color: '#10b981' },
                         { name: 'Prop Profits', value: Math.max(0, totals.profitProps), color: '#3b82f6' },
                         { name: 'Event Profits', value: Math.max(0, totals.profitEvents), color: '#f59e0b' },
                         { name: 'Expenditure', value: Math.max(0, totals.totalExpenses), color: '#ef4444' }
                       ]
                     : [
                         { name: 'Total Business', value: Math.max(0, totals.earnings), color: '#3b82f6' },
                         { name: 'Pending', value: Math.max(0, totals.pending), color: '#f59e0b' },
                         { name: 'Total Expenses', value: Math.max(0, totals.totalExpenses), color: '#ef4444' },
                         { name: 'Net Profit', value: Math.max(0, totals.profit), color: '#10b981' }
                       ]
                 ).map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                 ))}
               </Pie>
               <Tooltip 
                 formatter={(value) => `₹${value.toLocaleString()}`}
                 contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                 itemStyle={{ color: '#fff' }}
               />
               <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', opacity: 0.7 }} />
             </PieChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Header Tabs */}
      {!hideTabsAndOverview && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
           <div className="flex gap-4">
             <button onClick={() => setViewMode('overview')} className={`text-sm uppercase tracking-widest ${viewMode === 'overview' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Overview</button>
             <button onClick={() => setViewMode('studio_shoots')} className={`text-sm uppercase tracking-widest ${viewMode === 'studio_shoots' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Studio Shoots</button>
             <button onClick={() => setViewMode('props')} className={`text-sm uppercase tracking-widest ${viewMode === 'props' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Props Rentals</button>
             <button onClick={() => setViewMode('events')} className={`text-sm uppercase tracking-widest ${viewMode === 'events' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Events</button>
           </div>
        </div>
      )}

      {/* Shared Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-xl border border-white/5">
        <div className="flex flex-wrap gap-2 items-center">
          {['all', 'weekly', 'monthly', 'custom'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-xs uppercase tracking-widest rounded transition-colors ${filterType === type ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {type === 'all' ? 'All Time' : type === 'weekly' ? 'This Week' : type === 'monthly' ? 'This Month' : 'Date Range'}
            </button>
          ))}
          <input 
            type="text" 
            placeholder="Search name, phone, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-white/50 w-64 ml-2"
          />
        </div>
        {filterType === 'custom' && (
          <div className="flex gap-2 items-center">
            <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" />
            <span className="text-white/30 text-xs">to</span>
            <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" />
          </div>
        )}
      </div>

      {/* Shared Overview Cards */}
      {!hideTabsAndOverview && renderOverviewCards()}

      {/* Tab Content */}
      {viewMode === 'overview' && (
        <div className="space-y-8">
          {renderPartnerProfits()}
          
          {/* Expenses Table */}
          <div className="bg-[#111] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm uppercase tracking-widest text-white/70">Studio Expenditures</h4>
              <button onClick={() => onAddExpense({date: new Date().toISOString().split('T')[0], items: [{description: '', amount: 0}], type: 'Studio'})} className="px-3 py-1 bg-white text-black text-xs uppercase tracking-widest hover:bg-white/90">Add Expense</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="p-4 font-normal">Date</th>
                    <th className="p-4 font-normal">Type</th>
                    <th className="p-4 font-normal">Expense Name</th>
                    <th className="p-4 font-normal">Price</th>
                    <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredExpenses.filter(e => e.type === 'Studio').map(expense => (
                    <tr key={expense._id} className="hover:bg-white/[0.02]">
                      <td className="p-4">{expense.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[11px] uppercase ${
                          expense.type === 'Studio' ? 'bg-blue-500/20 text-blue-400' : 
                          expense.type === 'Shoot' ? 'bg-purple-500/20 text-purple-400' :
                          expense.type === 'Event' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>{expense.type}</span>
                        {expense.bookingId && <span className="ml-2 text-[11px] text-white/40">Linked to Shoot</span>}
                      </td>
                      <td className="p-4">{expense.description}</td>
                      <td className="p-4 text-red-400">₹{expense.amount.toLocaleString()}</td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => onEditExpense(expense)} className="text-amber-500 hover:text-amber-400 text-xs">Edit</button>
                        <button onClick={() => onDeleteExpense(expense._id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredExpenses.filter(e => e.type === 'Studio').length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-white/30">No studio expenses found for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'studio_shoots' && (
        <div className="space-y-8">
          {renderPartnerProfits()}
          
          <div className="bg-[#111] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm uppercase tracking-widest text-white/70">Studio Shoots Details</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="p-4 font-normal">Date / Name</th>
                    <th className="p-4 font-normal">Total Amount</th>
                    <th className="p-4 font-normal">Paid</th>
                    <th className="p-4 font-normal">Pending</th>
                    <th className="p-4 font-normal">Shoot Expenditure</th>
                    <th className="p-4 font-normal">Shoot Profit</th>
                    <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allBookings.map(shoot => {
                    const shootExpenses = expenses.filter(e => e.bookingId === shoot._id);
                    const totalShootExp = shootExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                    const paidAmt = (shoot.totalAmount || 0) - (shoot.pendingAmount || 0);
                    const pendingAmt = shoot.pendingAmount || 0;
                    const shootProfit = (shoot.totalAmount || 0) - paidAmt - totalShootExp;
                    
                    return (
                      <tr key={shoot._id} id={`business-booking-${shoot._id}`} className={`transition-all duration-500 ${highlightedBookingId === shoot._id ? 'bg-emerald-900/30 border-l-4 border-emerald-500' : 'hover:bg-white/[0.02]'}`}>
                        <td className="p-4">
                          <div>{shoot.date}</div>
                          <div className="text-xs text-white/40">{shoot.name} <span className="text-[9px] uppercase ml-2 px-1 py-0.5 rounded bg-white/5">{shoot.status}</span></div>
                        </td>
                        <td className="p-4">₹{shoot.totalAmount?.toLocaleString()}</td>
                        <td className="p-4 text-emerald-400">₹{paidAmt.toLocaleString()}</td>
                        <td className="p-4 text-amber-500">₹{pendingAmt.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-red-400">₹{totalShootExp.toLocaleString()}</span>
                            {shootExpenses.length > 0 && (
                              <button 
                                onClick={() => setViewShootExpenses({ shootName: shoot.name, expenses: shootExpenses })} 
                                className="text-[10px] bg-white/5 hover:bg-white/10 text-white/70 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest"
                              >
                                Detail
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white">₹{shootProfit.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => {
                            onAddExpense({
                              date: shoot.date,
                              items: [{description: `Expense for ${shoot.name}`, amount: 0}],
                              type: 'Shoot',
                              bookingId: shoot._id
                            })
                          }} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">
                            + Expense
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {allBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-white/30">No studio shoots found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'props' && (
        <div className="space-y-8">
          {renderPartnerProfits()}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/70">Prop Rentals Details</h3>
              <div className="flex gap-4">
                <button onClick={() => setIsInventoryModalOpen(true)} className="px-4 py-2 bg-black/40 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  Manage Inventory
                </button>
                <button onClick={() => setEditingProp({ items: [] })} className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                  New Prop Rental
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProps.map(prop => (
                <div key={prop._id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden relative group">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white">{prop.customerName}</h4>
                        <p className="text-xs text-white/50">{prop.email}</p>
                        {prop.phone && <p className="text-xs text-white/50">{prop.phone}</p>}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">Total</span>
                        <span className="text-white font-bold">₹{prop.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Paid</p>
                        <p className="text-sm text-emerald-400">₹{(prop.paidAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Pending</p>
                        <p className="text-sm text-amber-500">₹{(prop.pendingAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Profit</p>
                        <p className="text-sm font-bold text-white">₹{(prop.paidAmount || prop.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Items Rented</p>
                      <div className="space-y-1">
                        {prop.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-white/70 bg-white/5 px-2 py-1 rounded">
                            <span>{item.name}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur p-2 rounded">
                    <button onClick={() => setEditingProp(prop)} className="text-amber-500 hover:text-white text-xs">Edit</button>
                    <button onClick={() => handleDeleteProp(prop._id)} className="text-red-500 hover:text-white text-xs">Delete</button>
                  </div>
                </div>
              ))}
              {filteredProps.length === 0 && (
                <div className="col-span-full py-12 text-center text-white/30 border border-white/5 rounded-xl border-dashed">
                  No prop rentals found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prop Modal */}
      {editingProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 p-6 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-light uppercase tracking-widest text-white">
                {editingProp._id ? 'Edit Prop Rental' : 'New Prop Rental'}
              </h3>
              <button onClick={() => setEditingProp(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveProp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Customer Name</label>
                  <input type="text" name="customerName" defaultValue={editingProp.customerName} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Phone (Optional)</label>
                  <input type="text" name="phone" defaultValue={editingProp.phone} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Email</label>
                  <input type="email" name="email" defaultValue={editingProp.email} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Total Amount</label>
                  <input 
                    type="number" 
                    name="totalAmount"
                    value={editingProp.totalAmount !== undefined ? editingProp.totalAmount : (editingProp.items || []).reduce((sum, item) => sum + item.price, 0)} 
                    onChange={e => setEditingProp({...editingProp, totalAmount: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Paid Amount</label>
                  <input 
                    type="number" 
                    name="paidAmount" 
                    value={editingProp.paidAmount || 0} 
                    onChange={e => setEditingProp({...editingProp, paidAmount: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-emerald-400 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Pending Amount</label>
                  <input 
                    type="number" 
                    name="pendingAmount" 
                    value={(editingProp.totalAmount !== undefined ? editingProp.totalAmount : (editingProp.items || []).reduce((sum, item) => sum + item.price, 0)) - (editingProp.paidAmount || 0)} 
                    readOnly
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-amber-500 text-sm cursor-not-allowed opacity-50" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-widest text-white/50">Rented Items</label>
                  <button type="button" onClick={() => setEditingProp({...editingProp, items: [...(editingProp.items||[]), {name:'', price:0}]})} className="text-[11px] uppercase text-emerald-400 hover:text-emerald-300 tracking-widest">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {(editingProp.items||[]).map((item, idx) => {
                    const selectedInventoryItem = rentalItems.find(r => r.name === item.name);
                    return (
                    <div key={idx} className="flex gap-2 items-center">
                      {selectedInventoryItem?.imageUrl ? (
                        <img src={selectedInventoryItem.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded border border-white/10 bg-white/5 shrink-0 flex items-center justify-center text-[10px] text-white/30 uppercase">Img</div>
                      )}
                      <select 
                        value={item.name} 
                        onChange={e => {
                          const newItems = [...editingProp.items];
                          const selectedItem = rentalItems.find(r => r.name === e.target.value);
                          newItems[idx].name = e.target.value;
                          if (selectedItem) newItems[idx].price = selectedItem.price;
                          setEditingProp({...editingProp, items: newItems});
                        }}
                        className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" 
                        required
                      >
                        <option value="">Select Item...</option>
                        {rentalItems.map(rItem => (
                          <option key={rItem._id} value={rItem.name}>{rItem.name}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={item.price} 
                        onChange={e => {
                          const newItems = [...editingProp.items];
                          newItems[idx].price = Number(e.target.value);
                          setEditingProp({...editingProp, items: newItems});
                        }}
                        className="w-24 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-emerald-400" 
                        required
                      />
                      <button type="button" onClick={() => {
                        const newItems = editingProp.items.filter((_, i) => i !== idx);
                        setEditingProp({...editingProp, items: newItems});
                      }} className="text-red-500 hover:text-red-400">✕</button>
                    </div>
                  )})}
                  {(!editingProp.items || editingProp.items.length === 0) && (
                    <p className="text-xs text-white/30 italic">No items added. Click + Add Item.</p>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingProp(null)} className="px-4 py-2 text-white/50 hover:text-white uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-bold rounded transition-colors">Save Prop Rental</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm uppercase tracking-widest text-white/70">Events ({filteredEvents.length})</h3>
            <button onClick={() => setEditingEvent({name: '', services: [], paidAmount: 0, status: 'Scheduled'})} className="px-4 py-2 bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-bold rounded transition-colors">
              + New Event
            </button>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/5 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => {
                const eventExpenses = expenses?.filter(e => e.bookingId === event._id && e.type === 'Event') || [];
                const eventTotalExpenses = eventExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const eventProfit = (event.paidAmount || event.totalAmount || 0) - eventTotalExpenses;

                const isSearched = searchQuery && (
                  (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (event.clientName && event.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (event.phone && event.phone.includes(searchQuery)) ||
                  (event.email && event.email.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                <div key={event._id} className={`bg-black/40 border ${isSearched ? 'border-emerald-500 bg-emerald-900/10' : 'border-white/5'} rounded-xl overflow-hidden group relative`}>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-playfair text-white text-xl tracking-wide">{event.name}</h4>
                        <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{event.status}</p>
                        {event.subEvents && <p className="text-xs text-emerald-400 mt-1">{event.subEvents}</p>}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white/40 uppercase tracking-widest block mb-1">Total</span>
                        <span className="text-white font-bold">₹{event.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {event.clientName && (
                      <div className="text-xs text-white/70 bg-white/5 p-2 rounded border border-white/10">
                        <p><span className="text-white/40 uppercase">Client:</span> <span className="text-emerald-400 font-bold">{event.clientName}</span></p>
                        {event.phone && <p><span className="text-white/40 uppercase">Phone:</span> {event.phone}</p>}
                        {event.email && <p><span className="text-white/40 uppercase">Email:</span> {event.email}</p>}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Total</p>
                        <p className="text-sm font-bold text-white">₹{(event.totalAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Paid</p>
                        <p className="text-sm text-emerald-400">₹{(event.paidAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">Pending</p>
                        <p className="text-sm text-amber-500">₹{(event.pendingAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Services</p>
                      <div className="space-y-1">
                        {(event.subEventList && event.subEventList.length > 0 ? event.subEventList.flatMap(sub => sub.services || []) : event.services || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-white/70 bg-white/5 px-2 py-1 rounded">
                            <span>{item.name}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {eventExpenses.length > 0 && (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-red-400/80 mb-1 flex justify-between">
                          <span>Expenses</span>
                          <span>₹{eventTotalExpenses.toLocaleString()}</span>
                        </p>
                        <div className="space-y-1">
                          {eventExpenses.map((exp, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-white/70 bg-red-500/5 px-2 py-1 rounded">
                              <span className="truncate pr-2">{exp.description}</span>
                              <div className="flex items-center gap-2">
                                <span>₹{exp.amount}</span>
                                <button onClick={() => onEditExpense(exp)} className="text-amber-500 hover:text-white">Edit</button>
                                <button onClick={() => onDeleteExpense(exp._id)} className="text-red-500 hover:text-white">✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur p-2 rounded">
                    <button onClick={() => onAddExpense({
                      date: event.date || new Date().toISOString().split('T')[0],
                      items: [{description: `Expense for ${event.name}`, amount: 0}],
                      type: 'Event',
                      bookingId: event._id
                    })} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">
                      + Expense
                    </button>
                    <button onClick={() => handleDownloadEventPdf(event._id)} className="text-blue-400 hover:text-white text-xs mr-2">Download PDF</button>
                    <button onClick={() => handleSendEventPdf(event._id)} className="text-emerald-400 hover:text-white text-xs mr-2">Send PDF</button>
                    <button onClick={() => setEditingEvent(event)} className="text-amber-500 hover:text-white text-xs">Edit</button>
                    <button onClick={() => handleDeleteEvent(event._id)} className="text-red-500 hover:text-white text-xs">Delete</button>
                  </div>
                </div>
              )})}
              {filteredEvents.length === 0 && (
                <div className="col-span-full py-12 text-center text-white/30 border border-white/5 rounded-xl border-dashed">
                  No events found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 p-6 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-light uppercase tracking-widest text-white">
                {editingEvent._id ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Event Name</label>
                  <input type="text" name="name" defaultValue={editingEvent.name} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Status</label>
                  <select name="status" defaultValue={editingEvent.status || 'pending'} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm">
                    <option value="pending">pending</option>
                    <option value="contacted">contacted</option>
                    <option value="confirmed">confirmed</option>
                    <option value="finished">finished</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Client Name (Optional)</label>
                  <input type="text" name="clientName" defaultValue={editingEvent.clientName} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Phone (Optional)</label>
                  <input type="text" name="phone" defaultValue={editingEvent.phone} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Event Date</label>
                  <input type="date" name="date" defaultValue={editingEvent.date || new Date().toISOString().split('T')[0]} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Email (Optional)</label>
                  <input type="email" name="email" defaultValue={editingEvent.email} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Total Amount</label>
                  <input 
                    type="number" 
                    name="totalAmount" 
                    value={editingEvent.totalAmount !== undefined ? editingEvent.totalAmount : ((editingEvent.subEventList && editingEvent.subEventList.length > 0) ? editingEvent.subEventList.reduce((sum, subEvent) => sum + (subEvent.services || []).reduce((s, item) => s + item.price, 0), 0) : (editingEvent.services || []).reduce((sum, item) => sum + item.price, 0))} 
                    onChange={e => setEditingEvent({...editingEvent, totalAmount: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Paid Amount</label>
                  <input 
                    type="number" 
                    name="paidAmount" 
                    value={editingEvent.paidAmount || 0} 
                    onChange={e => setEditingEvent({...editingEvent, paidAmount: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-emerald-400 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Pending Amount</label>
                  <input 
                    type="number" 
                    name="pendingAmount" 
                    value={(editingEvent.totalAmount !== undefined ? editingEvent.totalAmount : ((editingEvent.subEventList && editingEvent.subEventList.length > 0) ? editingEvent.subEventList.reduce((sum, subEvent) => sum + (subEvent.services || []).reduce((s, item) => s + item.price, 0), 0) : (editingEvent.services || []).reduce((sum, item) => sum + item.price, 0))) - (editingEvent.paidAmount || 0)} 
                    readOnly
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-amber-500 text-sm cursor-not-allowed opacity-50" 
                  />
                </div>
              </div>



              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Discount (%)</label>
                  <input 
                    type="number" 
                    value={editingEvent.discountPercentage || ''} 
                    onChange={e => {
                      const pct = Number(e.target.value);
                      const total = editingEvent.totalAmount !== undefined ? editingEvent.totalAmount : ((editingEvent.subEventList && editingEvent.subEventList.length > 0) ? editingEvent.subEventList.reduce((sum, subEvent) => sum + (subEvent.services || []).reduce((s, item) => s + item.price, 0), 0) : (editingEvent.services || []).reduce((sum, item) => sum + item.price, 0));
                      const flatDiscount = Math.round((pct / 100) * total);
                      setEditingEvent({...editingEvent, discountPercentage: pct, discount: flatDiscount});
                    }}
                    placeholder="e.g. 10" 
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Discount (₹)</label>
                  <input 
                    type="number" 
                    name="discount" 
                    value={editingEvent.discount || 0} 
                    onChange={e => {
                      const flatDiscount = Number(e.target.value);
                      const total = editingEvent.totalAmount !== undefined ? editingEvent.totalAmount : ((editingEvent.subEventList && editingEvent.subEventList.length > 0) ? editingEvent.subEventList.reduce((sum, subEvent) => sum + (subEvent.services || []).reduce((s, item) => s + item.price, 0), 0) : (editingEvent.services || []).reduce((sum, item) => sum + item.price, 0));
                      const pct = total > 0 ? Number(((flatDiscount / total) * 100).toFixed(2)) : 0;
                      setEditingEvent({...editingEvent, discount: flatDiscount, discountPercentage: pct});
                    }}
                    placeholder="0" 
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-widest text-white/50">Sub Events & Services</label>
                  <button type="button" onClick={() => setEditingEvent({
                    ...editingEvent, 
                    subEventList: [...(editingEvent.subEventList || []), { name: '', services: [] }]
                  })} className="text-xs text-white/50 hover:text-white border border-white/10 px-2 py-1 rounded">+ Add Sub Event</button>
                </div>
                <div className="space-y-4">
                  {(editingEvent.subEventList || []).map((sub, sIdx) => (
                    <div key={sIdx} className="bg-white/5 p-4 rounded border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <input 
                          type="text" 
                          placeholder="Sub Event Name (e.g., Haldi)" 
                          value={sub.name}
                          onChange={e => {
                            const newList = [...(editingEvent.subEventList || [])];
                            newList[sIdx].name = e.target.value;
                            setEditingEvent({...editingEvent, subEventList: newList});
                          }}
                          className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white w-2/3"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => {
                            const newList = [...(editingEvent.subEventList || [])];
                            newList[sIdx].services.push({ name: '', price: 0 });
                            setEditingEvent({...editingEvent, subEventList: newList});
                          }} className="text-xs text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">+ Service</button>
                          <button type="button" onClick={() => {
                            const newList = editingEvent.subEventList.filter((_, i) => i !== sIdx);
                            setEditingEvent({...editingEvent, subEventList: newList});
                          }} className="text-red-500 hover:text-red-400">✕</button>
                        </div>
                      </div>
                      <div className="space-y-2 pl-4 border-l border-white/10">
                        {(sub.services || []).map((svc, svcIdx) => (
                          <div key={svcIdx} className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Service Name" 
                              value={svc.name}
                              onChange={e => {
                                const newList = [...(editingEvent.subEventList || [])];
                                newList[sIdx].services[svcIdx].name = e.target.value;
                                setEditingEvent({...editingEvent, subEventList: newList});
                              }}
                              className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                              required
                            />
                            <input 
                              type="number" 
                              placeholder="Price" 
                              value={svc.price}
                              onChange={e => {
                                const newList = [...(editingEvent.subEventList || [])];
                                newList[sIdx].services[svcIdx].price = Number(e.target.value);
                                setEditingEvent({...editingEvent, subEventList: newList});
                              }}
                              className="w-24 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                              required
                            />
                            <button type="button" onClick={() => {
                              const newList = [...(editingEvent.subEventList || [])];
                              newList[sIdx].services = newList[sIdx].services.filter((_, i) => i !== svcIdx);
                              setEditingEvent({...editingEvent, subEventList: newList});
                            }} className="text-red-500 hover:text-red-400">✕</button>
                          </div>
                        ))}
                        {(!sub.services || sub.services.length === 0) && (
                          <p className="text-xs text-white/30 italic">No services added for this sub event.</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!editingEvent.subEventList || editingEvent.subEventList.length === 0) && (
                    <p className="text-xs text-white/30 italic">No sub events added. Click + Add Sub Event.</p>
                  )}
                  
                  {/* Deliverables */}
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-xs uppercase tracking-widest text-white/50">Deliverables</label>
                      <button type="button" onClick={() => setEditingEvent({
                        ...editingEvent, 
                        deliverables: [...(editingEvent.deliverables || []), '']
                      })} className="text-xs text-white/50 hover:text-white border border-white/10 px-2 py-1 rounded">+ Add Deliverable</button>
                    </div>
                    <div className="space-y-2">
                      {(editingEvent.deliverables || []).map((del, dIdx) => (
                        <div key={dIdx} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Deliverable Name (e.g., Candid Video)" 
                            value={del}
                            onChange={e => {
                              const newList = [...(editingEvent.deliverables || [])];
                              newList[dIdx] = e.target.value;
                              setEditingEvent({...editingEvent, deliverables: newList});
                            }}
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                          />
                          <button type="button" onClick={() => {
                            const newList = editingEvent.deliverables.filter((_, i) => i !== dIdx);
                            setEditingEvent({...editingEvent, deliverables: newList});
                          }} className="text-red-500 hover:text-red-400">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complimentries */}
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-xs uppercase tracking-widest text-white/50">Complimentries</label>
                      <button type="button" onClick={() => setEditingEvent({
                        ...editingEvent, 
                        complimentries: [...(editingEvent.complimentries || []), '']
                      })} className="text-xs text-white/50 hover:text-white border border-white/10 px-2 py-1 rounded">+ Add Complimentry</button>
                    </div>
                    <div className="space-y-2">
                      {(editingEvent.complimentries || []).map((comp, cIdx) => (
                        <div key={cIdx} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Complimentry (e.g., Free Album)" 
                            value={comp}
                            onChange={e => {
                              const newList = [...(editingEvent.complimentries || [])];
                              newList[cIdx] = e.target.value;
                              setEditingEvent({...editingEvent, complimentries: newList});
                            }}
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                          />
                          <button type="button" onClick={() => {
                            const newList = editingEvent.complimentries.filter((_, i) => i !== cIdx);
                            setEditingEvent({...editingEvent, complimentries: newList});
                          }} className="text-red-500 hover:text-red-400">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 text-white/50 hover:text-white uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-bold rounded transition-colors">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewShootExpenses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] border border-white/10 p-6 shadow-2xl rounded-xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-light uppercase tracking-widest text-white">
                Expenses for {viewShootExpenses.shootName}
              </h3>
              <button onClick={() => setViewShootExpenses(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {viewShootExpenses.expenses.map((expense, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-lg">
                  <div>
                    <div className="text-xs text-white/50 mb-1">{expense.date}</div>
                    <div className="text-sm text-white">{expense.description}</div>
                  </div>
                  <div className="text-red-400 font-bold">
                    ₹{expense.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    {isInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#111] border border-white/10 p-6 shadow-2xl rounded-xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-light uppercase tracking-widest text-white">Manage Rental Inventory</h3>
              <button onClick={() => setIsInventoryModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              <div>
                <h4 className="text-sm uppercase tracking-widest text-emerald-400 mb-6">{editingInventoryItem ? 'Edit Item' : 'Add New Item'}</h4>
                <form onSubmit={handleSaveInventoryItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                  <div className="w-full">
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Item Name</label>
                    <input type="text" name="name" defaultValue={editingInventoryItem?.name} required className="w-full bg-black/20 focus:bg-black/40 border border-white/10 focus:border-white/30 rounded-lg px-4 py-2.5 text-sm text-white transition-colors outline-none" />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Default Price</label>
                    <input type="number" name="price" defaultValue={editingInventoryItem?.price} required className="w-full bg-black/20 focus:bg-black/40 border border-white/10 focus:border-white/30 rounded-lg px-4 py-2.5 text-sm text-white transition-colors outline-none" />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Image (Optional)</label>
                    <div className="h-32 rounded-lg overflow-hidden">
                      <DragDropImageUploader onUploadSuccess={(url) => setInventoryImageUrl(url)} currentImage={inventoryImageUrl || editingInventoryItem?.imageUrl} />
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2 flex justify-end gap-3 mt-4">
                    {editingInventoryItem && (
                      <button type="button" onClick={() => { setEditingInventoryItem(null); setInventoryImageUrl(''); }} className="px-6 py-2.5 border border-white/20 text-white rounded-lg text-xs tracking-widest uppercase hover:bg-white/5 transition-colors">Cancel</button>
                    )}
                    <button type="submit" className="px-6 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-emerald-500/30 transition-colors whitespace-nowrap">Save Item</button>
                  </div>
                </form>
              </div>

              <div>
                <h4 className="text-sm uppercase text-white/70 mb-4 border-b border-white/10 pb-2">Current Inventory</h4>
                <div className="space-y-2">
                  <div className="flex justify-between px-4 py-2 text-xs uppercase text-white/40 border-b border-white/5">
                    <span>Item Name</span>
                    <span>Default Price</span>
                  </div>
                  {rentalItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg group">
                      <div className="flex items-center gap-4">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        )}
                        <div className="font-medium text-white">{item.name}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-emerald-400 font-mono">₹{item.price.toLocaleString()}</div>
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingInventoryItem(item); setInventoryImageUrl(item.imageUrl || ''); }} className="text-amber-500 hover:text-amber-400 text-xs uppercase tracking-widest">Edit</button>
                          <button onClick={() => handleDeleteInventoryItem(item._id)} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-widest">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {rentalItems.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm">Inventory is empty. Add some items above.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessView;
