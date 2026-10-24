import React, { useState } from 'react';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Layers, CheckCircle, AlertTriangle, Eye, EyeOff, Edit2, Save, IndianRupee, Plus, Sparkles } from 'lucide-react';
import AddItemModal from './AddItemModal';

export default function AdminView({ orders, menu, onToggleStock, onUpdatePrice, onAddItem, currentRestaurantId }) {
  const [editingPrices, setEditingPrices] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Financial & Operational Analytics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const servedOrdersCount = orders.filter(o => o.status === 'SERVED').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'SERVED').length;

  // Item sales distribution computation
  const itemSalesMap = {};
  orders.forEach(ord => {
    ord.items.forEach(it => {
      if (!itemSalesMap[it.name]) {
        itemSalesMap[it.name] = { count: 0, revenue: 0 };
      }
      itemSalesMap[it.name].count += it.quantity;
      itemSalesMap[it.name].revenue += (it.price * it.quantity);
    });
  });

  const sortedTopSellers = Object.entries(itemSalesMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const handlePriceChange = (dishId, val) => {
    setEditingPrices(prev => ({ ...prev, [dishId]: val }));
  };

  const handleSavePrice = (dishId) => {
    const newPriceVal = parseFloat(editingPrices[dishId]);
    if (!isNaN(newPriceVal) && newPriceVal >= 0) {
      onUpdatePrice(dishId, newPriceVal);
      setEditingPrices(prev => {
        const next = { ...prev };
        delete next[dishId];
        return next;
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Restaurant Operations & Menu Manager</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Add new dishes, modify prices in ₹, manage stock, and track live dine-in sales
          </p>
        </div>

        <button
          type="button"
          className="btn-add-cart"
          onClick={() => setIsAddModalOpen(true)}
          style={{ height: '46px', padding: '0 20px', fontSize: '0.95rem' }}
        >
          <Plus size={18} />
          <span>Add New Menu Dish</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Sales Today</span>
            <IndianRupee size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +18.4% vs yesterday
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
            <ShoppingBag size={20} color="var(--info)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {totalOrdersCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {servedOrdersCount} Served • {activeOrdersCount} In Kitchen
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avg Prep Time</span>
            <Clock size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            14.2 mins
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '4px' }}>
            ⚡ 2.1m faster than target
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Menu Items Stock</span>
            <Layers size={20} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {menu.filter(m => m.inStock).length} / {menu.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active on Digital Menu
          </div>
        </div>
      </div>

      {/* Split Section: Top Selling Dishes & Price Management */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Top Selling Dishes Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Most Popular Items</h3>

          {sortedTopSellers.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>No sales data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedTopSellers.map(([name, data], i) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 800,
                      color: 'var(--primary)',
                      width: '24px'
                    }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.9rem' }}>
                      {data.count} ordered
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ₹{data.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Price & Availability Editor Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              Menu Dishes & Prices (₹)
            </h3>
            <button
              type="button"
              className="btn-add-cart"
              onClick={() => setIsAddModalOpen(true)}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Plus size={14} />
              <span>Add Dish</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
            {menu.map(dish => {
              const isEditing = editingPrices.hasOwnProperty(dish.id);
              const currentEditVal = isEditing ? editingPrices[dish.id] : dish.price;

              return (
                <div
                  key={dish.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-light)',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dish.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Price: <strong style={{ color: 'var(--primary)' }}>₹{dish.price}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Price Editing Inputs */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹</span>
                        <input
                          type="number"
                          value={currentEditVal}
                          onChange={e => handlePriceChange(dish.id, e.target.value)}
                          style={{
                            width: '80px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#161a22',
                            border: '1px solid var(--primary)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.88rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePrice(dish.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'var(--accent)',
                            color: '#000',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePriceChange(dish.id, dish.price.toString())}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-main)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                    )}

                    {/* Stock Switcher */}
                    <button
                      type="button"
                      onClick={() => onToggleStock(dish.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: dish.inStock ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: dish.inStock ? 'var(--accent)' : 'var(--danger)',
                        border: dish.inStock ? '1px solid var(--accent)' : '1px solid var(--danger)'
                      }}
                    >
                      {dish.inStock ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{dish.inStock ? 'In Stock' : 'Out'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={onAddItem}
        currentRestaurantId={currentRestaurantId}
      />
    </div>
  );
}
