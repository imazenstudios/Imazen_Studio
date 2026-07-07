import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DragDropImageUploader from '../DragDropImageUploader';

const BusinessView = ({ bookings, expenses, partners, onAddPartner, onAddExpense, onEditPartner, onEditExpense, onDeletePartner, onDeleteExpense }) => {
  const [filterType, setFilterType] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'confirmed_shoots', 'props'
  const [propsData, setPropsData] = useState([]);
  const [editingProp, setEditingProp] = useState(null);

  useEffect(() => {
    fetchProps();
  }, []);

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
    const paidAmount = Number(formData.get('paidAmount') || 0);
    const pendingAmount = calculatedTotal - paidAmount;

    const data = {
      customerName: formData.get('customerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      photo: editingProp?.photo || '',
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
  const allBookings = filterByDate(bookings, 'date').filter(b => b.status !== 'Cancelled');
  const confirmedBookings = filterByDate(bookings.filter(b => b.status === 'Confirmed' || b.status === 'Finished'), 'date');
  const filteredExpenses = filterByDate(expenses, 'date');
  const filteredProps = filterByDate(propsData, 'date');

  // Calculations
  const getTotals = () => {
    let shootEarnings = 0;
    let propEarnings = 0;
    let pending = 0;
    let studioExpenses = 0;
    let shootExpenses = 0;

    if (viewMode === 'overview') {
      // Overall Earnings: All bookings + Props
      allBookings.forEach(b => {
        shootEarnings += (b.totalAmount || 0) - (b.pendingAmount || 0);
        pending += (b.pendingAmount || 0);
      });
      filteredProps.forEach(p => {
        propEarnings += p.paidAmount || p.totalAmount || 0; // Use paidAmount if available
        pending += p.pendingAmount || 0;
      });
      studioExpenses = filteredExpenses.filter(e => e.type === 'Studio').reduce((a, b) => a + b.amount, 0);
      shootExpenses = filteredExpenses.filter(e => e.type === 'Shoot').reduce((a, b) => a + b.amount, 0);
    } 
    else if (viewMode === 'confirmed_shoots') {
      // Earnings from confirmed shoots only
      confirmedBookings.forEach(b => {
        shootEarnings += (b.totalAmount || 0) - (b.pendingAmount || 0);
        pending += (b.pendingAmount || 0);
      });
      shootExpenses = filteredExpenses.filter(e => e.type === 'Shoot' && confirmedBookings.some(cb => cb._id === e.bookingId)).reduce((a, b) => a + b.amount, 0);
    }
    else if (viewMode === 'props') {
      // Earnings from props only
      filteredProps.forEach(p => {
        propEarnings += p.paidAmount || p.totalAmount || 0;
        pending += p.pendingAmount || 0;
      });
    }

    const earnings = shootEarnings + propEarnings;
    const totalExpenses = studioExpenses + shootExpenses;
    const profit = earnings - totalExpenses;

    return { earnings, shootEarnings, propEarnings, pending, studioExpenses, shootExpenses, totalExpenses, profit };
  };

  const totals = getTotals();

  const renderPartnerProfits = () => (
    <div className="bg-[#111] p-6 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm uppercase tracking-widest text-white/70">
          Partner Profits ({viewMode.replace('_', ' ')})
        </h4>
        <button onClick={onAddPartner} className="px-3 py-1 bg-white text-black text-xs uppercase tracking-widest hover:bg-white/90">Add Partner</button>
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
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Total Earnings</p>
        <p className="text-3xl font-light text-emerald-400">₹{totals.earnings.toLocaleString()}</p>
        <p className="text-xs text-white/30 mt-2">
          {viewMode === 'overview' && `Shoots: ₹${totals.shootEarnings} | Rentals: ₹${totals.propEarnings}`}
          {viewMode === 'confirmed_shoots' && `Shoots: ₹${totals.shootEarnings}`}
          {viewMode === 'props' && `Rentals: ₹${totals.propEarnings}`}
        </p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Pending Amount</p>
        <p className="text-3xl font-light text-amber-500">₹{totals.pending.toLocaleString()}</p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Total Expenses</p>
        <p className="text-3xl font-light text-red-400">₹{totals.totalExpenses.toLocaleString()}</p>
        <p className="text-xs text-white/30 mt-2">
          {viewMode === 'overview' && `Studio: ₹${totals.studioExpenses} | Shoot: ₹${totals.shootExpenses}`}
          {viewMode === 'confirmed_shoots' && `Shoot Expenses: ₹${totals.shootExpenses}`}
          {viewMode === 'props' && `No Expenses tracked`}
        </p>
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Net Profit</p>
        <p className="text-3xl font-light text-white">₹{totals.profit.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Header Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
         <div className="flex gap-4">
           <button onClick={() => setViewMode('overview')} className={`text-sm uppercase tracking-widest ${viewMode === 'overview' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Overview</button>
           <button onClick={() => setViewMode('confirmed_shoots')} className={`text-sm uppercase tracking-widest ${viewMode === 'confirmed_shoots' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Confirmed Shoots</button>
           <button onClick={() => setViewMode('props')} className={`text-sm uppercase tracking-widest ${viewMode === 'props' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}>Props Rentals</button>
         </div>
      </div>

      {/* Shared Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-xl border border-white/5">
        <div className="flex gap-2">
          {['all', 'weekly', 'monthly', 'custom'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-xs uppercase tracking-widest rounded transition-colors ${filterType === type ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {type === 'all' ? 'All Time' : type === 'weekly' ? 'This Week' : type === 'monthly' ? 'This Month' : 'Date Range'}
            </button>
          ))}
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
      {renderOverviewCards()}

      {/* Tab Content */}
      {viewMode === 'overview' && (
        <div className="space-y-8">
          {renderPartnerProfits()}
          
          {/* Expenses Table */}
          <div className="bg-[#111] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm uppercase tracking-widest text-white/70">All Expenditures</h4>
              <button onClick={() => onAddExpense({date: new Date().toISOString().split('T')[0], amount: 0, type: 'Studio', description: ''})} className="px-3 py-1 bg-white text-black text-xs uppercase tracking-widest hover:bg-white/90">Add Expense</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="p-4 font-normal">Date</th>
                    <th className="p-4 font-normal">Type</th>
                    <th className="p-4 font-normal">Description</th>
                    <th className="p-4 font-normal">Amount</th>
                    <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredExpenses.map(expense => (
                    <tr key={expense._id} className="hover:bg-white/[0.02]">
                      <td className="p-4">{expense.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase ${expense.type === 'Studio' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>{expense.type}</span>
                        {expense.bookingId && <span className="ml-2 text-[10px] text-white/40">Linked to Shoot</span>}
                      </td>
                      <td className="p-4">{expense.description}</td>
                      <td className="p-4 text-red-400">₹{expense.amount.toLocaleString()}</td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => onEditExpense(expense)} className="text-amber-500 hover:text-amber-400 text-xs">Edit</button>
                        <button onClick={() => onDeleteExpense(expense._id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-white/30">No expenses found for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'confirmed_shoots' && (
        <div className="space-y-8">
          {renderPartnerProfits()}
          
          <div className="bg-[#111] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm uppercase tracking-widest text-white/70">Confirmed Shoots Details</h4>
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
                  {confirmedBookings.map(shoot => {
                    const shootExpenses = expenses.filter(e => e.bookingId === shoot._id);
                    const totalShootExp = shootExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                    const paidAmt = (shoot.totalAmount || 0) - (shoot.pendingAmount || 0);
                    const pendingAmt = shoot.pendingAmount || 0;
                    const shootProfit = (shoot.totalAmount || 0) - paidAmt - totalShootExp;
                    
                    return (
                      <tr key={shoot._id} className="hover:bg-white/[0.02]">
                        <td className="p-4">
                          <div>{shoot.date}</div>
                          <div className="text-xs text-white/40">{shoot.name}</div>
                        </td>
                        <td className="p-4">₹{shoot.totalAmount?.toLocaleString()}</td>
                        <td className="p-4 text-emerald-400">₹{paidAmt.toLocaleString()}</td>
                        <td className="p-4 text-amber-500">₹{pendingAmt.toLocaleString()}</td>
                        <td className="p-4 text-red-400">₹{totalShootExp.toLocaleString()}</td>
                        <td className="p-4 font-bold text-white">₹{shootProfit.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => {
                            onAddExpense({
                              date: shoot.date,
                              amount: 0,
                              type: 'Shoot',
                              description: `Expense for ${shoot.name}`,
                              bookingId: shoot._id
                            })
                          }} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">
                            + Expense
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {confirmedBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-white/30">No confirmed shoots found.</td>
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
              <button onClick={() => setEditingProp({ items: [] })} className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                New Prop Rental
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProps.map(prop => (
                <div key={prop._id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden relative group">
                  {prop.photo ? (
                     <div className="h-40 w-full overflow-hidden">
                       <img src={prop.photo} alt="Prop" className="w-full h-full object-cover" />
                     </div>
                  ) : (
                     <div className="h-40 w-full bg-white/5 flex items-center justify-center">
                       <span className="text-white/20 uppercase text-xs tracking-widest">No Image</span>
                     </div>
                  )}
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
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Paid</p>
                        <p className="text-sm text-emerald-400">₹{(prop.paidAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Pending</p>
                        <p className="text-sm text-amber-500">₹{(prop.pendingAmount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Profit</p>
                        <p className="text-sm font-bold text-white">₹{(prop.paidAmount || prop.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Items Rented</p>
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
              <div className="grid grid-cols-2 gap-4">
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
                    value={((editingProp.items || []).reduce((sum, item) => sum + item.price, 0) - (editingProp.paidAmount || 0))} 
                    readOnly
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-amber-500 text-sm cursor-not-allowed opacity-50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-1">Photo (Optional)</label>
                <div className="h-40 border border-white/10 rounded overflow-hidden">
                   <DragDropImageUploader 
                     currentImage={editingProp.photo || ''} 
                     aspect={4/3} 
                     onUploadSuccess={(url) => setEditingProp(prev => ({...prev, photo: url}))} 
                   />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-widest text-white/50">Rented Items</label>
                  <button type="button" onClick={() => setEditingProp({...editingProp, items: [...(editingProp.items||[]), {name:'', price:0}]})} className="text-[10px] uppercase text-emerald-400 hover:text-emerald-300 tracking-widest">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {(editingProp.items||[]).map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Item Name" 
                        value={item.name} 
                        onChange={e => {
                          const newItems = [...editingProp.items];
                          newItems[idx].name = e.target.value;
                          setEditingProp({...editingProp, items: newItems});
                        }}
                        className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" 
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={item.price} 
                        onChange={e => {
                          const newItems = [...editingProp.items];
                          newItems[idx].price = Number(e.target.value);
                          setEditingProp({...editingProp, items: newItems});
                        }}
                        className="w-24 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white" 
                        required
                      />
                      <button type="button" onClick={() => {
                        const newItems = editingProp.items.filter((_, i) => i !== idx);
                        setEditingProp({...editingProp, items: newItems});
                      }} className="text-red-500 hover:text-red-400">✕</button>
                    </div>
                  ))}
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

    </div>
  );
};

export default BusinessView;
