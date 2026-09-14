export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">RETAIL POS+</div>
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-btn ${activeTab === 'POS' ? 'active' : ''}`} 
          onClick={() => setActiveTab('POS')}
        >
          🛍️ POS Checkout
        </button>
        <button 
          className={`sidebar-btn ${activeTab === 'PRODUCTS' ? 'active' : ''}`} 
          onClick={() => setActiveTab('PRODUCTS')}
        >
          📦 Manage Products
        </button>
        <button 
          className={`sidebar-btn ${activeTab === 'ORDERS' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ORDERS')}
        >
          📋 Orders
        </button>
      </nav>
    </div>
  );
}
