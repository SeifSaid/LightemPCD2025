import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: '#fff',
    minHeight: '100vh',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0,
    color: '#222',
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
    margin: '0.5rem 0 0 0',
  },
  createListingBtn: {
    backgroundColor: '#facc15',
    color: '#222',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
    fontWeight: '600',
    color: '#666',
    padding: '1rem 0',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem',
    background: '#fff',
    transition: 'background 0.2s',
  },
  buyBtn: {
    backgroundColor: '#facc15',
    color: '#222',
    padding: '0.5rem 1.25rem',
    borderRadius: '0.4rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
};

const OrderEnergy = () => {
  const navigate = useNavigate();
  const listings = [
    {
      id: 1,
      producer: "GreenGuru",
      energy: 61,
      price: "100.99 wei",
      distance: "7 km (Ariana)",
      orders: "112 orders",
      completion: "98.45%",
    },
    {
      id: 2,
      producer: "BioBeth",
      energy: 21,
      price: "95.50 wei",
      distance: "12 km (Lac2)",
      orders: "41 orders",
      completion: "78.9%",
    },
    {
      id: 3,
      producer: "SunPower",
      energy: 45,
      price: "99.50 wei",
      distance: "5 km (Marsa)",
      orders: "67 orders",
      completion: "85.2%",
    },
    {
      id: 4,
      producer: "EcoVolt",
      energy: 80,
      price: "120.00 wei",
      distance: "9 km (Bardo)",
      orders: "88 orders",
      completion: "92.1%",
    },
  ];

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Order Energy</h1>
            <p style={styles.subtitle}>Browse and purchase energy at fixed prices</p>
          </div>
          <button 
            onClick={() => navigate('/list-energy')} 
            style={styles.createListingBtn}
          >
            Create Listing
          </button>
        </div>

        {listings.length > 0 ? (
          <>
            <div style={styles.tableHeader}>
              <span>Producer</span>
              <span>Energy amount</span>
              <span>Price</span>
              <span>Location</span>
              <span>Action</span>
            </div>
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                style={styles.tableRow}
                onMouseOver={e => e.target.style.background = '#fafafa'}
                onMouseOut={e => e.target.style.background = '#fff'}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#222', fontSize: '0.95rem' }}>
                    {listing.producer}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5' }}>
                    {listing.completion} &bull; {listing.orders}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: '#222' }}>{listing.energy} kWh</div>
                <div style={{ fontWeight: '600', color: '#222' }}>{listing.price}</div>
                <div style={{ color: '#666' }}>{listing.distance}</div>
                <div>
                  <button 
                    style={styles.buyBtn}
                    onMouseOver={e => e.target.style.backgroundColor = '#e6b800'}
                    onMouseOut={e => e.target.style.backgroundColor = '#facc15'}
                    onClick={() => navigate('/buy-energy', { state: { listing } })}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>
              No listings available
            </h3>
            <p style={{ color: '#888' }}>
              Check back later for new listings or create your own
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderEnergy;
