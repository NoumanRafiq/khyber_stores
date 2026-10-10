/**
 * Khyber Stores - Product Catalog Data
 * Pure static data object accessible in both standard script and module contexts.
 */
window.Khyber = window.Khyber || {};

window.Khyber.products = [
  {
    id: "kh-001",
    name: "Aura Sculpted Ceramic Vase",
    tagline: "Hand-thrown stoneware with undulating organic contours.",
    price: 88.00,
    category: "Living",
    rating: 4.9,
    reviewsCount: 38,
    badge: "Bestseller",
    image: "assets/images/ceramic-vase.jpg",
    images: [
      "assets/images/ceramic-vase.jpg",
      "assets/images/artisan-craft.jpg"
    ],
    variants: [
      { name: "Terracotta Sand", color: "#C87D55", inStock: true },
      { name: "Oatmeal Matte", color: "#E3DAC9", inStock: true },
      { name: "Raw Umber", color: "#634735", inStock: false }
    ],
    details: {
      material: "100% High-fire stoneware, unglazed matte exterior",
      dimensions: "10.5\" H x 6.2\" W (26.7cm x 15.7cm)",
      origin: "Handcrafted in Portugal",
      care: "Wipe with damp cloth. Watertight interior."
    },
    description: "The Aura Vase celebrates natural imperfections with its tactile twist form. Sculpted from earthen clay and fired at high temperatures, it stands as an architectural centerpiece with or without botanical stems."
  },
  {
    id: "kh-002",
    name: "Atelier Cognac Leather Tote",
    tagline: "Full-grain vegetable-tanned leather built for lifetimes.",
    price: 245.00,
    category: "Accessories",
    rating: 5.0,
    reviewsCount: 64,
    badge: "Heritage",
    image: "assets/images/leather-tote.jpg",
    images: [
      "assets/images/leather-tote.jpg",
      "assets/images/artisan-craft.jpg"
    ],
    variants: [
      { name: "Warm Cognac", color: "#9A5026", inStock: true },
      { name: "Dark Walnut", color: "#3B2519", inStock: true }
    ],
    details: {
      material: "Full-grain Italian Tuscan leather, solid brass hardware",
      dimensions: "14\" W x 12\" H x 5.5\" D (fits 15\" laptops)",
      origin: "Artisan workshop in Florence",
      care: "Condition semi-annually with natural beeswax."
    },
    description: "Unlined, raw-edged, and intentionally pared down. The Atelier Tote develops a deep personal patina over decades. Features an interior slip pocket and reinforced bridle leather handles."
  },
  {
    id: "kh-003",
    name: "Solstice Brushed Brass Lamp",
    tagline: "Cordless ambient illumination with 3-step warm dimming.",
    price: 165.00,
    category: "Lighting",
    rating: 4.8,
    reviewsCount: 29,
    badge: "Design Icon",
    image: "assets/images/brass-lamp.jpg",
    images: [
      "assets/images/brass-lamp.jpg",
      "assets/images/ceramic-vase.jpg"
    ],
    variants: [
      { name: "Brushed Brass", color: "#CBB375", inStock: true },
      { name: "Smoked Bronze", color: "#4A4238", inStock: true }
    ],
    details: {
      material: "Spun solid brass, silicone base pad, USB-C recharge",
      dimensions: "9.8\" H x 6.3\" Dome Diameter",
      origin: "Copenhagen design studio",
      care: "Dust with dry microfiber cloth."
    },
    description: "Sculptural serenity for desks, dining, and reading nooks. Delivers up to 24 hours of ambient 2400K light on a single charge with seamless touch-sensitive top dimming."
  },
  {
    id: "kh-004",
    name: "Fjord Waffle Merino Throw",
    tagline: "Ultra-fine New Zealand merino wool with tactile honeycomb weave.",
    price: 130.00,
    category: "Textiles",
    rating: 4.9,
    reviewsCount: 42,
    badge: "Seasonal",
    image: "assets/images/merino-blanket.jpg",
    images: [
      "assets/images/merino-blanket.jpg",
      "assets/images/scented-candle.jpg"
    ],
    variants: [
      { name: "Natural Oat", color: "#E5DDD0", inStock: true },
      { name: "Heather Slate", color: "#8B929A", inStock: true }
    ],
    details: {
      material: "100% Extra-fine 19.5-micron Merino Wool",
      dimensions: "55\" x 78\" (140cm x 200cm) with fringe",
      origin: "Woven in Yorkshire mills",
      care: "Dry clean or gentle hand wash cold."
    },
    description: "Breathable, featherlight, yet deeply insulating. Woven on traditional looms to create an expansive waffle structure that traps warm air without weight."
  },
  {
    id: "kh-005",
    name: "Ember & Oak Scented Candle",
    tagline: "Smoked cedarwood, amber resin, and wild vetiver in amber glass.",
    price: 42.00,
    category: "Living",
    rating: 4.7,
    reviewsCount: 51,
    badge: "Staff Pick",
    image: "assets/images/scented-candle.jpg",
    images: [
      "assets/images/scented-candle.jpg",
      "assets/images/artisan-craft.jpg"
    ],
    variants: [
      { name: "8 oz Amber Jar", color: "#6A4E23", inStock: true },
      { name: "14 oz Double Wick", color: "#3B2519", inStock: true }
    ],
    details: {
      material: "100% Mid-western soy wax, FSC wood wick, apothecary glass",
      dimensions: "3.5\" H x 3.1\" Diameter, ~60 hour burn",
      origin: "Hand-poured in small batches",
      care: "Trim wooden wick to 1/8\" before lighting."
    },
    description: "Evokes wood fires in autumn rain. Poured by hand with pure botanical fragrance oils and a natural crackling wood wick that replicates the quiet whisper of an open hearth."
  }
];
