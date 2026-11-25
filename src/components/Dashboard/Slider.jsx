import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80&auto=format&fit=crop',
    alt: 'Min 60% off wedding elegance',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80&auto=format&fit=crop',
    alt: 'Min 50% off winter jackets',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80&auto=format&fit=crop',
    alt: 'Up to 50% off premium watches',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&auto=format&fit=crop',
    alt: 'Prime only offers',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop',
    alt: 'Beauty sale',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop',
    alt: 'Shoes sale',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop',
    alt: 'Smartwatch sale',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80&auto=format&fit=crop',
    alt: 'Prime exclusive',
  },
];

function Slider() {
  return (
    <>
      <style>{`
        .promo-slider-wrapper {
          width: 100%;
          max-width: 1350px;
          margin: 0 auto;
          padding: 14px 28px;
          position: relative;
        }

        svg{
          width:50% !important;
          height:50% !important;
        }

        .promo-swiper {
          border-radius: 14px;
          overflow: hidden;
          padding: 2px;
        }

        .promo-swiper .swiper-slide {
          height: auto;
          display: flex;
        }

        /* Banner card */
        .banner-item {
          width: 100%;
          height: 340px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .banner-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .banner-item:hover img {
          transform: scale(1.05);
        }

        /* ---- White circular arrows ---- */
        .promo-swiper .swiper-button-prev,
        .promo-swiper .swiper-button-next {
          width: 46px;
          height: 46px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          color: #222 !important;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .promo-swiper .swiper-button-prev:hover,
        .promo-swiper .swiper-button-next:hover {
          background: #f2f2f2;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
        }

        .promo-swiper .swiper-button-prev::after,
        .promo-swiper .swiper-button-next::after {
          font-size: 16px !important;
          font-weight: 900;
        }

        .promo-swiper .swiper-button-prev {
          left: -10px;
        }

        .promo-swiper .swiper-button-next {
          right: -10px;
        }

        /* Pagination dots */
        .promo-swiper .swiper-pagination {
          bottom: 2px !important;
        }

        .promo-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #bbb;
          opacity: 0.7;
          transition: all 0.25s ease;
        }

        .promo-swiper .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 6px;
          background: #1a1a1a;
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .banner-item {
            height: 270px;
          }
          .promo-slider-wrapper {
            padding: 12px 18px;
          }
        }

        @media (max-width: 768px) {
          .banner-item {
            height: 220px;
          }
          .promo-swiper .swiper-button-prev,
          .promo-swiper .swiper-button-next {
            width: 38px;
            height: 38px;
          }
        }

        @media (max-width: 576px) {
          .banner-item {
            height: 190px;
          }
          .promo-slider-wrapper {
            padding: 10px 12px;
          }
        }
      `}</style>

      <div className="promo-slider-wrapper">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          className="promo-swiper"
          spaceBetween={12}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 8 },
            576: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 },
            992: { slidesPerView: 4, spaceBetween: 12 },
          }}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="banner-item">
                <img src={banner.image} alt={banner.alt} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default Slider;