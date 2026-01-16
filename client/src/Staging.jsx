import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
// BeforeAfterSlider Component
const BeforeAfterSlider = ({ before, after, title }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-light text-center mb-8 text-[#0f1f2e]">{title}</h2>

      <div
        ref={containerRef}
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-ew-resize select-none rounded-2xl shadow-[0_20px_45px_rgba(15,31,46,0.14)] border border-[#e5d8c4] bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image (Empty Room) - Base Layer */}
        <div className="absolute inset-0">
          <img
            src={before}
            alt="Before staging"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* After Image (Staged Room with Furniture) - Reveals as you drag right */}
        <div
          className="absolute inset-0 top-0 left-0 overflow-hidden"
          style={{
            width: `${sliderPosition}%`,
          }}
        >
          <img
            src={after}
            alt="After staging"
            className="h-full object-cover"
            style={{
              width: containerRef.current
                ? `${containerRef.current.offsetWidth}px`
                : "100vw",
              maxWidth: "none",
            }}
            draggable="false"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, backgroundColor: '#d8a24a' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#0f1f2e] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#f7f1e5]">
            <svg
              className="w-6 h-6 text-[#f7f1e5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Properties Data
const properties = [
  {
    title: "Elegant Living Room Transformation",
    before: "images/Living Room.jpeg",
    after: "images/living room after.jpeg",
  },
];

// Main Staging Component
export default function Staging() {
  return (
    <div className="min-h-screen bg-[#f7f1e5]">
      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="grid md:grid-cols-2 h-[90vh] md:h-[95vh]">
          <div className="h-full relative">
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/jemey3 enhanced.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2e]/75 via-[#0f1f2e]/55 to-transparent" />
          </div>
          <div className="flex items-center justify-center bg-[#f7f1e5] p-12">
            <div className="max-w-2xl text-[#0f1f2e]">
              <p className="text-sm tracking-[0.3em] mb-6 text-[#d8a24a] font-light">
                BEFORE & AFTER
              </p>
              <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                Staging Before & After
              </h1>
              <div className="w-16 h-1 bg-[#d8a24a] mb-6" />
              <p className="text-base text-[#2f3d4c] leading-relaxed">
                Our concierge staging transforms every room with purposeful design, curated furnishings, and light that sells. See the difference before you list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sliders Section */}
      <section className="py-20 bg-[#efe5d5]">
        <div className="max-w-6xl mx-auto px-6">
          {properties.map((property, index) => (
            <BeforeAfterSlider
              key={index}
              before={property.before}
              after={property.after}
              title={property.title}
            />
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-[#0f1f2e] py-20 text-[#f7f1e5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-[#e8dfcf] mb-8 text-lg">
            Let us help you showcase your property's full potential with
            professional staging services.
          </p>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openContactModal"))
            }
            className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          >
            Get Started Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
