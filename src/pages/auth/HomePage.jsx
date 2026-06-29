import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Leaf } from 'lucide-react'
import { SI, CATEGORIES } from '../../utils/constants'
import ProductCard from '../../components/common/ProductCard'
import api from '../../services/api'
import toast from 'react-hot-toast'



// Hero rotating background images
const HERO_GRID_IMAGES = [
  { src: 'images/common/c1.png',  },
  { src: 'images/common/c2.png', alt: 'fruits' },
  { src: 'images/common/c3.png', alt: 'honey' },
  { src: 'images/common/c4.jpeg', alt: 'spices' },
  { src: 'images/common/c5.png', alt: 'grains' },
  { src: 'images/common/c6.png', alt: 'herbs' },
]

const features = [
  { icon: <Leaf size={22} />, title: 'ස්වාභාවික නිෂ්පාදන', desc: 'අත්කම් නිර්මාණ', iconBg: '#f0fdf4', iconColor: '#16a34a' },
  { icon: <Truck size={22} />, title: 'ශීඝ්‍ර Deliveryය', desc: 'ගෙදරට ලබා දෙමු', iconBg: '#eff6ff', iconColor: '#2563eb' },
  { icon: <ShieldCheck size={22} />, title: 'විශ්වාසදායී', desc: 'ගුණාත්මකභාවය තහවුරු', iconBg: '#fff7ed', iconColor: '#e25f1e' },
]

const HERO_STYLE = {
  background: 'linear-gradient(135deg, #3d1009 0%, #8c2916 30%, #e25f1e 70%, #f59e0b 100%)',
}

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

   // fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const res = await api.get('/products?limit=6')
        setProducts(res.data || [])
      } catch (err) {
        console.error(err)
        toast.error('නිෂ්පාදන ලබා ගැනීමට නොහැකි විය')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={HERO_STYLE}>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 flex flex-col md:flex-row items-center gap-12">

          {/* Left copy */}
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-block text-sm px-4 py-1.5 rounded-full mb-5 font-medium"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
               ශ්‍රී ලාංකික වටහපත් නිෂ්පාදන
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold mb-3 leading-tight"
              style={{ fontFamily: 'Yaldevi, sans-serif', color: '#ffffff' }}
            >
              {SI.appName}
            </h1>
            <p
              className="text-xl font-medium mb-5"
              style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Noto Sans Sinhala, sans-serif' }}
            >
              {SI.appTagline}
            </p>
            <p
              className="text-base mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              ශ්‍රී ලාංකික ගුණාත්මක වටහපත් නිෂ්පාදන නිවසේ දොරකඩටම ගෙන්වා ගන්න​.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: '#ffffff', color: '#b84512' }}
              >
                {SI.shopNow} <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' }}
              >
                {SI.register}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              {['✓ 100% ස්වාභාවික', '✓ 500+ නිෂ්පාදකයන්', '✓ ශීඝ්‍ර delivery'].map(t => (
                <span key={t} className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — real photo grid */}
          <div className="flex-shrink-0 grid grid-cols-3 gap-2.5">
            {HERO_GRID_IMAGES.map((img, i) => (
              <div
                key={i}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1"
                style={{ border: '2px solid rgba(255,255,255,0.25)' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURE STRIP ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: f.iconBg, color: f.iconColor }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{f.title}</p>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES with images ===== */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Yaldevi, sans-serif' }}>
              {SI.categories}
            </h2>
            <p className="text-gray-500 text-sm mt-1">ඔබේ කාණ්ඩය තෝරන්න</p>
          </div>
          <Link to="/products" className="text-sm font-medium flex items-center gap-1" style={{ color: '#e25f1e' }}>
            {SI.viewAll} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Full bleed image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient overlay — always visible at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                }}
              />

              {/* Darker overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(226,95,30,0.25)' }}
              />

              {/* Label at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p
                  className="text-white font-bold text-sm leading-tight text-center drop-shadow-md"
                  style={{ fontFamily: 'Yaldevi, sans-serif' }}
                >
                  {cat.label}
                </p>
              </div>

              {/* "Browse" pill on hover */}
              <div
                className="absolute top-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
              >
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.9)', color: '#e25f1e' }}
                >
                  බලන්න →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section style={{ background: '#faf9f7' }} className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Yaldevi, sans-serif' }}>
                {SI.featuredProducts}
              </h2>
              <p className="text-gray-500 text-sm mt-1">ජනප්‍රිය ශ්‍රී ලාංකික නිෂ්පාදන</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: '#e25f1e' }}
            >
              {SI.viewAll} <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BANNER — new arrivals ===== */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left banner */}
          <div
            className="relative rounded-3xl overflow-hidden h-48 flex items-center px-8"
            style={{ background: 'linear-gradient(120deg, #14532d, #15803d)' }}
          >
            <img
              src="images/common/c4.jpeg"
              alt="vegetables"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <p className="text-white/70 text-sm mb-1">නව ලැබීම්</p>
              <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: 'Yaldevi' }}>
                කුඩා ප්‍රමානයේ අතු
              </h3>
              <Link
                to="/products?category=vegetables"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: '#fff', color: '#15803d' }}
              >
                දැන් බලන්න <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right banner */}
          <div
            className="relative rounded-3xl overflow-hidden h-48 flex items-center px-8"
            style={{ background: 'linear-gradient(120deg, #78350f, #d97706)' }}
          >
            <img
              src="images/common/c1.png"
              alt="honey"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <p className="text-white/70 text-sm mb-1">විශේෂ දීමනා</p>
              <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: 'Yaldevi' }}>
                කුඩා ප්‍රමානයේ තලකොළ අතු
              </h3>
              <Link
                to="/products?category=honey"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: '#fff', color: '#b45309' }}
              >
                දැන් බලන්න <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCER CTA ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-16">
        <div
          className="relative rounded-3xl overflow-hidden p-10 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #166534 0%, #15803d 60%, #22c55e 100%)' }}
        >
          {/* Background image overlay */}
          <img
            src="images/common/c4.jpeg"
            alt="farm"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Yaldevi, sans-serif', color: '#ffffff' }}>
              නිශ්පාදකයෙකු ද ඔබ?
            </h2>
            <p className="mb-6 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
              ඔබේ ස්වාභාවික වටහපත් නිෂ්පාදන රටේ ගනුදෙනුකරුවන්ට
              විකිණීමේ අවස්ථාව ලබාගන්න.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
              style={{ background: '#ffffff', color: '#166534' }}
            >
              නිෂ්පාදකයෙකු ලෙස ලියාපදිංචි වන්න <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
