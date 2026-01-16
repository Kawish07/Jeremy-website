import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useEffect, useRef } from 'react';
import { resolveImage, ensureProtocol, placeholderDataUrl, API } from './lib/image';

// Helper function to format numbers with commas
const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export default function AllListings({ onBack }) {
    const [filterStatus, setFilterStatus] = useState('all');
    

    const [listings, setListings] = useState([]);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        fetch(`${API}/api/listings`)
            .then((r) => {
                if (!r.ok) throw new Error(`API returned ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (!mountedRef.current) return;
                setListings(data);
            })
                .catch((err) => {
                    console.error('Failed to load listings:', err);
                    setListings([]);
                });
        return () => { mountedRef.current = false; };
    }, []);

    const filteredListings = filterStatus === 'all' 
        ? listings 
        : listings.filter(listing => listing.status === filterStatus);

    const getStatusBadge = (status) => {
        switch(status) {
            case 'under-contract':
                return { text: 'UNDER CONTRACT', color: '#d8a24a' };
            case 'sold':
                return { text: 'SOLD', color: '#1c3b57' };
            case 'active':
                return { text: 'ACTIVE', color: '#0f1f2e' };
            default:
                return { text: 'ACTIVE', color: '#0f1f2e' };
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f1e5]">
            <Header onBack={onBack} light={true} />

            {/* Hero Section with Background Image */}
            <section className="relative h-[80vh]">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: "url('https://images.pexels.com/photos/3288100/pexels-photo-3288100.png')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f2e]/80 via-[#0f1f2e]/60 to-transparent" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-[#f7f1e5] px-6">
                    <div className="max-w-4xl">
                        <p className="text-sm tracking-[0.3em] mb-4 uppercase font-light text-[#f5c15c]">Exclusive Properties</p>
                        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                            Our Premium
                            <br />
                            <span className="relative inline-block mt-2">
                                Listings
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-[#d8a24a] opacity-70 -z-10"></span>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed text-[#f7f1e5] opacity-95">
                            Browse curated luxury properties across Texas and beyond. Schedule a private tour with a single click.
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-[#efe5d5] py-8 px-6 border-b border-[#d8a24a]/60">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-serif text-[#0f1f2e]">All Properties</h2>
                        <p className="text-sm text-[#2f3d4c] mt-1">{filteredListings.length} {filteredListings.length === 1 ? 'Property' : 'Properties'} Available</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-6 py-2 text-sm tracking-wide rounded-full transition-all shadow-sm ${
                                filterStatus === 'all' 
                                    ? 'bg-[#0f1f2e] text-[#f7f1e5] border border-[#0f1f2e]' 
                                    : 'bg-[#f7f1e5] text-[#0f1f2e] border border-[#d8a24a] hover:border-[#0f1f2e]'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-6 py-2 text-sm tracking-wide rounded-full transition-all shadow-sm ${
                                filterStatus === 'active' 
                                    ? 'bg-[#0f1f2e] text-[#f7f1e5] border border-[#0f1f2e]' 
                                    : 'bg-[#f7f1e5] text-[#0f1f2e] border border-[#d8a24a] hover:border-[#0f1f2e]'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilterStatus('under-contract')}
                            className={`px-6 py-2 text-sm tracking-wide rounded-full transition-all shadow-sm ${
                                filterStatus === 'under-contract' 
                                    ? 'bg-[#0f1f2e] text-[#f7f1e5] border border-[#0f1f2e]' 
                                    : 'bg-[#f7f1e5] text-[#0f1f2e] border border-[#d8a24a] hover:border-[#0f1f2e]'
                            }`}
                        >
                            Under Contract
                        </button>
                        <button
                            onClick={() => setFilterStatus('sold')}
                            className={`px-6 py-2 text-sm tracking-wide rounded-full transition-all shadow-sm ${
                                filterStatus === 'sold' 
                                    ? 'bg-[#0f1f2e] text-[#f7f1e5] border border-[#0f1f2e]' 
                                    : 'bg-[#f7f1e5] text-[#0f1f2e] border border-[#d8a24a] hover:border-[#0f1f2e]'
                            }`}
                        >
                            Sold
                        </button>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <main className="max-w-7xl mx-auto py-16 px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.map((listing, idx) => {
                        const statusBadge = getStatusBadge(listing.status);
                        const idValue = listing._id || listing.id || idx;
                        if (!listing.image && (!listing.images || listing.images.length === 0)) {
                            console.warn('Listing missing image, using placeholder:', idValue);
                        }
                        return (
                            <article key={idValue} className="bg-white/90 group overflow-hidden rounded-2xl shadow-[0_18px_45px_rgba(15,31,46,0.08)] border border-[#e5d8c4]" style={{ transform: 'translateZ(0)' }}>
                                <Link to={idValue ? `/listing/${idValue}` : '#'} className="block">
                                    <div className="relative overflow-hidden h-80" style={{ transform: 'translateZ(0)' }}>
                                        <img
                                            src={ensureProtocol(resolveImage(listing.image || (listing.images && listing.images[0]) || placeholderDataUrl()))}
                                            alt={listing.title}
                                            loading="lazy"
                                            decoding="async"
                                            draggable={false}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderDataUrl(); }}
                                        />
                                        <span className="absolute top-4 right-4 text-white text-xs font-medium px-4 py-2 tracking-[0.2em] rounded-full shadow-lg" style={{ backgroundColor: statusBadge.color }}>
                                            {statusBadge.text}
                                        </span>
                                    </div>
                                </Link>

                                <div className="py-6">
                                    <h3 className="text-2xl font-serif text-[#0f1f2e] mb-3">
                                        {listing.title}
                                    </h3>

                                    <p className="text-sm text-[#2f3d4c] mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#d8a24a]" />
                                        {listing.address}
                                    </p>

                                    <p className="text-sm text-[#2f3d4c] mb-6 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full bg-[#f1e3c9] text-[#0f1f2e]">{listing.beds} Beds</span>
                                        <span className="px-3 py-1 rounded-full bg-[#f1e3c9] text-[#0f1f2e]">{listing.baths} Baths</span>
                                        <span className="px-3 py-1 rounded-full bg-[#f1e3c9] text-[#0f1f2e]">{listing.sqft} Sq.Ft.</span>
                                    </p>

                                    <p className="text-3xl font-serif text-[#d8a24a] mb-6">${formatPrice(listing.price)}</p>

                                    <button className="text-sm font-semibold px-4 py-2 bg-[#0f1f2e] text-[#f7f1e5] rounded-full hover:bg-[#1c3b57] transition-colors shadow-md">
                                        View Details
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {filteredListings.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[#2f3d4c] text-lg">No properties found in this category.</p>
                    </div>
                )}
            </main>
            {/* <section className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src={'/images/jemey7.jpg'}
                        alt="Jeremy profile"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 35%' }}
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
                    <div className="max-w-3xl">
                        <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
                            Work With Me
                        </h2>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
                            I love real estate. I strive to share this passion with my clients and will use my wealth of experience to help you realize your own dreams for your home, family and asset growth.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Contact Me
                        </button>
                    </div>
                </div>
            </section> */}
            <Footer />
        </div>
    );
}