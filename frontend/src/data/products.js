// Sample product data for the e-commerce site
import Product1 from '../assets/Product1.png';
import Product2 from '../assets/Product2.png';
import Product3 from '../assets/Product3.png';
import Product4 from '../assets/Product4.png';
import Product5 from '../assets/Product5.png';

export const PRODUCTS_DATA = [
  // Suits Category
  {
    id: 1,
    name: 'Classic Navy Suit',
    category: 'suits',
    price: 2500,
    rentalPrice: 800,
    image: Product1,
    description: 'Premium navy blue suit perfect for formal occasions',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue'],
    inStock: true
  },
  {
    id: 2,
    name: 'Charcoal Business Suit',
    category: 'suits',
    price: 2800,
    rentalPrice: 900,
    image: Product1,
    description: 'Professional charcoal suit for business meetings',
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal'],
    inStock: true
  },
  {
    id: 3,
    name: 'Black Formal Suit',
    category: 'suits',
    price: 3200,
    rentalPrice: 1000,
    image: Product1,
    description: 'Elegant black suit for special occasions',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    inStock: true
  },

  // Kurtas Category
  {
    id: 4,
    name: 'Traditional White Kurta',
    category: 'kurtas',
    price: 1200,
    rentalPrice: 400,
    image: Product2,
    description: 'Classic white kurta with intricate embroidery',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    inStock: true
  },
  {
    id: 5,
    name: 'Royal Blue Kurta',
    category: 'kurtas',
    price: 1500,
    rentalPrice: 500,
    image: Product2,
    description: 'Rich royal blue kurta with golden details',
    sizes: ['M', 'L', 'XL'],
    colors: ['Royal Blue'],
    inStock: true
  },
  {
    id: 6,
    name: 'Cream Silk Kurta',
    category: 'kurtas',
    price: 1800,
    rentalPrice: 600,
    image: Product2,
    description: 'Luxurious cream silk kurta for special events',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Cream'],
    inStock: true
  },

  // Bandhgalas Category
  {
    id: 7,
    name: 'Classic Bandhgala',
    category: 'bandhgalas',
    price: 2000,
    rentalPrice: 700,
    image: Product3,
    description: 'Traditional bandhgala with modern fit',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    inStock: true
  },
  {
    id: 8,
    name: 'Designer Bandhgala',
    category: 'bandhgalas',
    price: 2500,
    rentalPrice: 800,
    image: Product3,
    description: 'Designer bandhgala with premium fabric',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue'],
    inStock: true
  },
  {
    id: 9,
    name: 'Wedding Bandhgala',
    category: 'bandhgalas',
    price: 3000,
    rentalPrice: 1000,
    image: Product3,
    description: 'Elegant bandhgala perfect for weddings',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Maroon'],
    inStock: true
  },

  // Formal Wear Category
  {
    id: 10,
    name: 'Business Blazer',
    category: 'formal',
    price: 1800,
    rentalPrice: 600,
    image: Product4,
    description: 'Professional blazer for office wear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy Blue'],
    inStock: true
  },
  {
    id: 11,
    name: 'Formal Shirt Set',
    category: 'formal',
    price: 1000,
    rentalPrice: 350,
    image: Product4,
    description: 'Crisp formal shirt with matching trousers',
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    inStock: true
  },
  {
    id: 12,
    name: 'Executive Suit',
    category: 'formal',
    price: 2200,
    rentalPrice: 750,
    image: Product4,
    description: 'Executive suit for corporate events',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Navy Blue'],
    inStock: true
  },

  // Traditional Category
  {
    id: 13,
    name: 'Sherwani Set',
    category: 'traditional',
    price: 3500,
    rentalPrice: 1200,
    image: Product5,
    description: 'Traditional sherwani for special occasions',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'Gold'],
    inStock: true
  },
  {
    id: 14,
    name: 'Wedding Kurta Set',
    category: 'traditional',
    price: 2800,
    rentalPrice: 950,
    image: Product5,
    description: 'Elaborate kurta set for wedding ceremonies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Maroon'],
    inStock: true
  },
  {
    id: 15,
    name: 'Festival Attire',
    category: 'traditional',
    price: 1500,
    rentalPrice: 500,
    image: Product5,
    description: 'Traditional attire for festivals and celebrations',
    sizes: ['M', 'L', 'XL'],
    colors: ['Orange', 'Yellow'],
    inStock: true
  }
];

export const CATEGORIES = [
  { id: 'suits', name: 'Suits', count: 3 },
  { id: 'kurtas', name: 'Kurtas', count: 3 },
  { id: 'bandhgalas', name: 'Bandhgalas', count: 3 },
  { id: 'formal', name: 'Formal Wear', count: 3 },
  { id: 'traditional', name: 'Traditional', count: 3 }
];

export const getProductsByCategory = (category) => {
  if (!category) return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(product => product.category === category);
};

export const getProductById = (id) => {
  return PRODUCTS_DATA.find(product => product.id === parseInt(id));
};
