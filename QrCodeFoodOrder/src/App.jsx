import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import CustomerView from './components/CustomerView';
import CartDrawer from './components/CartDrawer';
import KitchenView from './components/KitchenView';
import QrGeneratorView from './components/QrGeneratorView';
import AdminView from './components/AdminView';
import WaiterModal from './components/WaiterModal';
import AccessDenied from './components/AccessDenied';

import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import RestaurantsPage from './pages/RestaurantsPage';

import { INITIAL_MENU, INITIAL_ORDERS, RESTAURANTS } from './data/initialData';
import { subscribeToSync, broadcastState, playWaiterAlert } from './utils/syncService';

function AppContent() {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = useState('04');
  const [currentRestaurantId, setCurrentRestaurantId] = useState('r1');

  // Active User session (default Customer role)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eazyorder_user');
      return saved ? JSON.parse(saved) : {
        id: 'guest_101',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 987-6543',
        role: 'customer',
        loyaltyPoints: 250,
        tier: 'Gold Diner'
      };
    } catch (e) {
      return null;
    }
  });

  // Role helper
  const role = currentUser ? currentUser.role : 'customer';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || role === 'admin';

  // Load initial menu state
  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem('eazyorder_menu');
      return saved ? JSON.parse(saved) : INITIAL_MENU;
    } catch (e) {
      return INITIAL_MENU;
    }
  });

  // Load initial orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('eazyorder_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  // Load waiter calls
  const [waiterRequests, setWaiterRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('eazyorder_waiter_reqs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);

  // Check URL query parameters e.g. ?restaurant=r2&table=05
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const restParam = params.get('restaurant');
    if (tableParam) setActiveTable(tableParam);
    if (restParam) setCurrentRestaurantId(restParam);
  }, []);

  // Real-time tab sync listener
  useEffect(() => {
    const unsubscribe = subscribeToSync((event) => {
      if (event.type === 'NEW_ORDER') {
        setOrders(prev => [event.payload, ...prev]);
      } else if (event.type === 'UPDATE_ORDER_STATUS') {
        setOrders(prev => prev.map(o => o.id === event.payload.orderId ? { ...o, status: event.payload.status } : o));
      } else if (event.type === 'WAITER_REQUEST') {
        setWaiterRequests(prev => [event.payload, ...prev]);
        playWaiterAlert();
      } else if (event.type === 'TOGGLE_STOCK') {
        setMenu(prev => prev.map(m => m.id === event.payload ? { ...m, inStock: !m.inStock } : m));
      } else if (event.type === 'UPDATE_PRICE') {
        setMenu(prev => prev.map(m => m.id === event.payload.dishId ? { ...m, price: event.payload.newPrice } : m));
      } else if (event.type === 'ADD_DISH') {
        setMenu(prev => [event.payload, ...prev]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Persist states
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('eazyorder_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('eazyorder_user');
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('eazyorder_menu', JSON.stringify(menu));
    } catch (e) {}
  }, [menu]);

  useEffect(() => {
    try {
      localStorage.setItem('eazyorder_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('eazyorder_waiter_reqs', JSON.stringify(waiterRequests));
    } catch (e) {}
  }, [waiterRequests]);

  // Switch role handler for testing
  const handleSwitchRole = (newRole) => {
    let name = 'Alex Morgan';
    let email = 'alex@eazyorder.com';

    if (newRole === 'staff') {
      name = 'Chef Marco';
      email = 'chef@eazyorder.com';
    } else if (newRole === 'admin') {
      name = 'Manager Sarah';
      email = 'admin@eazyorder.com';
    }

    setCurrentUser({
      id: `usr_${newRole}`,
      name,
      email,
      role: newRole,
      loyaltyPoints: newRole === 'customer' ? 250 : 0,
      tier: newRole === 'admin' ? 'Manager' : newRole === 'staff' ? 'Kitchen Staff' : 'Gold Diner'
    });
  };

  // Cart Handlers
  const handleAddToCart = (cartItem) => {
    setCart(prev => [...prev, cartItem]);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCart(prev => {
        const next = [...prev];
        const item = next[index];
        const newTotal = (item.unitPrice * newQty).toFixed(2);
        next[index] = { ...item, quantity: newQty, totalPrice: parseFloat(newTotal) };
        return next;
      });
    }
  };

  const handleRemoveCartItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Place Order
  const handlePlaceOrder = ({ subtotal, tax, tip, total, paymentMethod }) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: activeTable,
      restaurantId: currentRestaurantId,
      timestamp: new Date().toISOString(),
      status: 'SENT',
      items: cart,
      subtotal,
      tax,
      tip,
      total,
      paymentStatus: 'PAID',
      paymentMethod,
      customerName: currentUser ? currentUser.name : 'Diner Guest'
    };

    setOrders(prev => [newOrder, ...prev]);
    broadcastState('NEW_ORDER', newOrder);
    setCart([]);
  };

  // Update order status in KDS
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    broadcastState('UPDATE_ORDER_STATUS', { orderId, status: newStatus });
  };

  // Waiter Calls
  const handleSendWaiterRequest = (requestData) => {
    setWaiterRequests(prev => [requestData, ...prev]);
    broadcastState('WAITER_REQUEST', requestData);
  };

  const handleClearWaiterRequest = (index) => {
    setWaiterRequests(prev => prev.filter((_, i) => i !== index));
  };

  // Stock toggle
  const handleToggleStock = (dishId) => {
    setMenu(prev => prev.map(m => m.id === dishId ? { ...m, inStock: !m.inStock } : m));
    broadcastState('TOGGLE_STOCK', dishId);
  };

  // Price modifier
  const handleUpdatePrice = (dishId, newPrice) => {
    setMenu(prev => prev.map(m => m.id === dishId ? { ...m, price: newPrice } : m));
    broadcastState('UPDATE_PRICE', { dishId, newPrice });
  };

  // Add new item dish handler
  const handleAddItem = (newItem) => {
    setMenu(prev => [newItem, ...prev]);
    broadcastState('ADD_DISH', newItem);
  };

  // Menu items for active restaurant
  const currentRestaurantMenu = menu.filter(m => !m.restaurantId || m.restaurantId === currentRestaurantId);

  const activeCustomerOrder = orders.find(
    o => o.tableNumber === activeTable && o.status !== 'SERVED'
  );

  return (
    <div className="app-container">
      <Navbar
        cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        activeTable={activeTable}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onSwitchRole={handleSwitchRole}
      />

      <main className="main-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />

          <Route
            path="/restaurants"
            element={
              <RestaurantsPage
                onSelectRestaurant={setCurrentRestaurantId}
                currentRestaurantId={currentRestaurantId}
              />
            }
          />

          <Route
            path="/menu"
            element={
              <CustomerView
                menu={currentRestaurantMenu}
                activeTable={activeTable}
                onTableChange={setActiveTable}
                cart={cart}
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                activeOrder={activeCustomerOrder}
                onRequestWaiter={() => setIsWaiterModalOpen(true)}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <OrderHistoryPage
                orders={orders}
                activeTable={activeTable}
                onRequestWaiter={() => setIsWaiterModalOpen(true)}
              />
            }
          />

          {/* Kitchen KDS: Protected for Staff */}
          <Route
            path="/kitchen"
            element={
              isStaff ? (
                <KitchenView
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  waiterRequests={waiterRequests}
                  onClearWaiterRequest={handleClearWaiterRequest}
                />
              ) : (
                <AccessDenied
                  requiredRole="staff"
                  currentUser={currentUser}
                  onSwitchRole={handleSwitchRole}
                />
              )
            }
          />

          {/* Table QR Codes: Protected for Admin */}
          <Route
            path="/qr-generator"
            element={
              isAdmin ? (
                <QrGeneratorView
                  onSelectTableAndSimulate={(tableNum) => {
                    setActiveTable(tableNum);
                    navigate(`/menu?table=${tableNum}`);
                  }}
                />
              ) : (
                <AccessDenied
                  requiredRole="admin"
                  currentUser={currentUser}
                  onSwitchRole={handleSwitchRole}
                />
              )
            }
          />

          {/* Admin Analytics & Item Manager: Protected for Admin */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminView
                  orders={orders}
                  menu={currentRestaurantMenu}
                  onToggleStock={handleToggleStock}
                  onUpdatePrice={handleUpdatePrice}
                  onAddItem={handleAddItem}
                  currentRestaurantId={currentRestaurantId}
                />
              ) : (
                <AccessDenied
                  requiredRole="admin"
                  currentUser={currentUser}
                  onSwitchRole={handleSwitchRole}
                />
              )
            }
          />

          <Route
            path="/auth"
            element={
              <AuthPage
                onLogin={(user) => setCurrentUser(user)}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <ProfilePage
                user={currentUser}
                onLogout={() => setCurrentUser(null)}
                onSwitchRole={handleSwitchRole}
                userOrdersCount={orders.length}
              />
            }
          />

          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        activeTable={activeTable}
      />

      {/* Waiter Request Modal */}
      <WaiterModal
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
        activeTable={activeTable}
        onSendRequest={handleSendWaiterRequest}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
