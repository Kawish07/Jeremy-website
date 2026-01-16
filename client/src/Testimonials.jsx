import React from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-[#f7f1e5]">
      <Header />

      {/* Top split hero: left image, right content */}
      <section className="grid md:grid-cols-2">
        <div
          className="h-[90vh] md:h-[100vh] bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('/images/jemey7.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2e]/75 via-[#0f1f2e]/55 to-transparent" />
        </div>
        <div className="flex items-center justify-center bg-[#f7f1e5] p-12">
          <div className="max-w-xl text-[#0f1f2e]">
            <p className="text-sm tracking-[0.3em] mb-6 text-[#d8a24a] font-light">
              TESTIMONIALS
            </p>
            <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
              Testimonials
            </h1>
            <div className="w-16 h-1 bg-[#d8a24a] mb-6" />
            <p className="text-base text-[#2f3d4c] leading-relaxed mb-8">
              Read what our clients have to say about working with Jeremy Denham.
            </p>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openContactModal"))
              }
              className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            >
              Contact Jeremy
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="py-20 bg-[#efe5d5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-[0.3em] mb-4 text-[#d8a24a] font-light">
            TESTIMONIALS
          </p>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-[#0f1f2e]">No testimonials yet</h2>
          <p className="text-base text-[#2f3d4c] leading-relaxed mb-8">
            Check back soon to see what clients are saying. In the meantime, feel free to reach out with any questions.
          </p>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openContactModal"))
            }
            className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          >
            Contact Jeremy
          </button>
        </div>
      </section>

      {/* Image CTA section with overlay */}
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/jemey2 enhanced.jpg')",
            backgroundPosition: "center 15%",
          }}
        />
        {/* dark overlay to improve white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2e]/80 via-[#0f1f2e]/70 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-[#f7f1e5] text-4xl md:text-5xl font-serif mb-4">
            Work with Jeremy Denham
          </h2>
          <p className="text-[#e8dfcf] text-lg mb-6 font-light">
            Call us today to schedule a private showing
          </p>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openContactModal"))
            }
            className="px-8 py-3 rounded-full font-semibold bg-[#d8a24a] text-[#0f1f2e] border-2 border-[#d8a24a] hover:bg-[#f5c15c] transition-all duration-200 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          >
            Contact
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
