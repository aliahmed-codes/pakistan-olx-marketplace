// Categories and Sub-categories for Pakistan Marketplace
// Based on OLX Pakistan structure

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: 'mobiles',
    name: 'Mobiles',
    slug: 'mobiles',
    icon: 'Smartphone',
    description: 'Mobile phones, tablets, and accessories',
    subCategories: [
      { id: 'mobile-phones', name: 'Mobile Phones', slug: 'mobile-phones' },
      { id: 'tablets', name: 'Tablets', slug: 'tablets' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
      { id: 'smart-watches', name: 'Smart Watches', slug: 'smart-watches' },
      { id: 'mobile-cases', name: 'Mobile Cases & Covers', slug: 'mobile-cases' },
      { id: 'chargers-cables', name: 'Chargers & Cables', slug: 'chargers-cables' },
      { id: 'power-banks', name: 'Power Banks', slug: 'power-banks' },
      { id: 'headphones', name: 'Headphones & Earphones', slug: 'headphones' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    icon: 'Car',
    description: 'Cars, bikes, and other vehicles',
    subCategories: [
      { id: 'cars', name: 'Cars', slug: 'cars' },
      { id: 'cars-on-installments', name: 'Cars on Installments', slug: 'cars-on-installments' },
      { id: 'cars-accessories', name: 'Car Accessories', slug: 'cars-accessories' },
      { id: 'spare-parts', name: 'Spare Parts', slug: 'spare-parts' },
      { id: 'buses-vans-trucks', name: 'Buses, Vans & Trucks', slug: 'buses-vans-trucks' },
      { id: 'rickshaw-chingchi', name: 'Rickshaw & Chingchi', slug: 'rickshaw-chingchi' },
      { id: 'tractors-trailers', name: 'Tractors & Trailers', slug: 'tractors-trailers' },
      { id: 'boats', name: 'Boats', slug: 'boats' },
      { id: 'other-vehicles', name: 'Other Vehicles', slug: 'other-vehicles' },
    ],
  },
  {
    id: 'bikes',
    name: 'Bikes',
    slug: 'bikes',
    icon: 'Bike',
    description: 'Motorcycles, scooters, and bicycles',
    subCategories: [
      { id: 'motorcycles', name: 'Motorcycles', slug: 'motorcycles' },
      { id: 'bikes-on-installments', name: 'Bikes on Installments', slug: 'bikes-on-installments' },
      { id: 'scooters', name: 'Scooters', slug: 'scooters' },
      { id: 'atv-quads', name: 'ATV & Quads', slug: 'atv-quads' },
      { id: 'bicycles', name: 'Bicycles', slug: 'bicycles' },
      { id: 'bike-spare-parts', name: 'Spare Parts', slug: 'bike-spare-parts' },
      { id: 'bike-accessories', name: 'Bike Accessories', slug: 'bike-accessories' },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    slug: 'property',
    icon: 'Home',
    description: 'Houses, apartments, plots, and commercial properties',
    subCategories: [
      { id: 'for-sale-houses', name: 'For Sale: Houses & Apartments', slug: 'for-sale-houses' },
      { id: 'for-sale-land-plots', name: 'For Sale: Land & Plots', slug: 'for-sale-land-plots' },
      { id: 'for-sale-shops', name: 'For Sale: Shops & Offices', slug: 'for-sale-shops' },
      { id: 'for-rent-houses', name: 'For Rent: Houses & Apartments', slug: 'for-rent-houses' },
      { id: 'for-rent-land-plots', name: 'For Rent: Land & Plots', slug: 'for-rent-land-plots' },
      { id: 'for-rent-shops', name: 'For Rent: Shops & Offices', slug: 'for-rent-shops' },
      { id: 'rooms-flatmates', name: 'Rooms & Flatmates', slug: 'rooms-flatmates' },
      { id: 'paying-guests', name: 'Paying Guests', slug: 'paying-guests' },
      { id: 'vacation-rentals', name: 'Vacation Rentals', slug: 'vacation-rentals' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Home Appliances',
    slug: 'electronics',
    icon: 'Monitor',
    description: 'Computers, TVs, home appliances, and more',
    subCategories: [
      { id: 'computers-accessories', name: 'Computers & Accessories', slug: 'computers-accessories' },
      { id: 'tv-video-audio', name: 'TV - Video - Audio', slug: 'tv-video-audio' },
      { id: 'cameras-accessories', name: 'Cameras & Accessories', slug: 'cameras-accessories' },
      { id: 'games-entertainment', name: 'Games & Entertainment', slug: 'games-entertainment' },
      { id: 'fridges-freezers', name: 'Fridges & Freezers', slug: 'fridges-freezers' },
      { id: 'ac-coolers', name: 'AC & Coolers', slug: 'ac-coolers' },
      { id: 'washing-machines', name: 'Washing Machines', slug: 'washing-machines' },
      { id: 'fans', name: 'Fans', slug: 'fans' },
      { id: 'microwaves-ovens', name: 'Microwaves & Ovens', slug: 'microwaves-ovens' },
      { id: 'sewing-machines', name: 'Sewing Machines', slug: 'sewing-machines' },
      { id: 'water-dispensers', name: 'Water Dispensers', slug: 'water-dispensers' },
      { id: 'generators-ups', name: 'Generators & UPS', slug: 'generators-ups' },
      { id: 'other-home-appliances', name: 'Other Home Appliances', slug: 'other-home-appliances' },
    ],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    slug: 'jobs',
    icon: 'Briefcase',
    description: 'Find jobs and post job openings',
    subCategories: [
      { id: 'accounting-finance', name: 'Accounting & Finance', slug: 'accounting-finance' },
      { id: 'advertising-media', name: 'Advertising & Media', slug: 'advertising-media' },
      { id: 'education', name: 'Education', slug: 'education' },
      { id: 'engineering', name: 'Engineering', slug: 'engineering' },
      { id: 'healthcare', name: 'Healthcare', slug: 'healthcare' },
      { id: 'hr-recruitment', name: 'HR & Recruitment', slug: 'hr-recruitment' },
      { id: 'it-software', name: 'IT & Software', slug: 'it-software' },
      { id: 'marketing', name: 'Marketing', slug: 'marketing' },
      { id: 'sales', name: 'Sales', slug: 'sales' },
      { id: 'customer-service', name: 'Customer Service', slug: 'customer-service' },
      { id: 'domestic-staff', name: 'Domestic Staff', slug: 'domestic-staff' },
      { id: 'drivers-delivery', name: 'Drivers & Delivery', slug: 'drivers-delivery' },
      { id: 'security', name: 'Security', slug: 'security' },
      { id: 'hotels-tourism', name: 'Hotels & Tourism', slug: 'hotels-tourism' },
      { id: 'other-jobs', name: 'Other Jobs', slug: 'other-jobs' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    slug: 'services',
    icon: 'Wrench',
    description: 'Professional services and repairs',
    subCategories: [
      { id: 'electronics-repair', name: 'Electronics & Computer Repair', slug: 'electronics-repair' },
      { id: 'mechanics-motorcycles', name: 'Mechanics & Motorcycles', slug: 'mechanics-motorcycles' },
      { id: 'maids-domestic-help', name: 'Maids & Domestic Help', slug: 'maids-domestic-help' },
      { id: 'catering-restaurant', name: 'Catering & Restaurant', slug: 'catering-restaurant' },
      { id: 'farm-poultry', name: 'Farm & Poultry', slug: 'farm-poultry' },
      { id: 'health-beauty', name: 'Health & Beauty', slug: 'health-beauty' },
      { id: 'movers-packers', name: 'Movers & Packers', slug: 'movers-packers' },
      { id: 'drivers-taxi', name: 'Drivers & Taxi', slug: 'drivers-taxi' },
      { id: 'event-services', name: 'Event Services', slug: 'event-services' },
      { id: 'home-office-repair', name: 'Home & Office Repair', slug: 'home-office-repair' },
      { id: 'cleaning-services', name: 'Cleaning Services', slug: 'cleaning-services' },
      { id: 'construction-labor', name: 'Construction & Labor', slug: 'construction-labor' },
      { id: 'other-services', name: 'Other Services', slug: 'other-services' },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture & Home Decor',
    slug: 'furniture',
    icon: 'Sofa',
    description: 'Home and office furniture',
    subCategories: [
      { id: 'sofas-seating', name: 'Sofa & Chairs', slug: 'sofas-seating' },
      { id: 'beds-wardrobes', name: 'Beds & Wardrobes', slug: 'beds-wardrobes' },
      { id: 'tables-dining', name: 'Tables & Dining', slug: 'tables-dining' },
      { id: 'rugs-carpets', name: 'Rugs & Carpets', slug: 'rugs-carpets' },
      { id: 'curtains-blinds', name: 'Curtains & Blinds', slug: 'curtains-blinds' },
      { id: 'office-furniture', name: 'Office Furniture', slug: 'office-furniture' },
      { id: 'home-decoration', name: 'Home Decoration', slug: 'home-decoration' },
      { id: 'garden-outdoor', name: 'Garden & Outdoor', slug: 'garden-outdoor' },
      { id: 'painting-mirrors', name: 'Painting & Mirrors', slug: 'painting-mirrors' },
      { id: 'lighting', name: 'Lighting', slug: 'lighting' },
      { id: 'other-household', name: 'Other Household Items', slug: 'other-household' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion & Beauty',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Clothing, shoes, and accessories',
    subCategories: [
      { id: 'clothes', name: 'Clothes', slug: 'clothes' },
      { id: 'watches', name: 'Watches', slug: 'watches' },
      { id: 'jewelry', name: 'Jewelry', slug: 'jewelry' },
      { id: 'bags-luggage', name: 'Bags & Luggage', slug: 'bags-luggage' },
      { id: 'footwear', name: 'Footwear', slug: 'footwear' },
      { id: 'wedding-dresses', name: 'Wedding Dresses', slug: 'wedding-dresses' },
      { id: 'makeup', name: 'Makeup', slug: 'makeup' },
      { id: 'skin-hair-care', name: 'Skin & Hair Care', slug: 'skin-hair-care' },
      { id: 'fragrances', name: 'Fragrances', slug: 'fragrances' },
      { id: 'other-fashion', name: 'Other Fashion', slug: 'other-fashion' },
    ],
  },
  {
    id: 'books-sports',
    name: 'Books, Sports & Hobbies',
    slug: 'books-sports',
    icon: 'BookOpen',
    description: 'Books, sports equipment, and hobbies',
    subCategories: [
      { id: 'books-magazines', name: 'Books & Magazines', slug: 'books-magazines' },
      { id: 'musical-instruments', name: 'Musical Instruments', slug: 'musical-instruments' },
      { id: 'sports-equipment', name: 'Sports Equipment', slug: 'sports-equipment' },
      { id: 'gym-fitness', name: 'Gym & Fitness', slug: 'gym-fitness' },
      { id: 'toys-games', name: 'Toys & Games', slug: 'toys-games' },
      { id: 'arts-crafts', name: 'Arts & Crafts', slug: 'arts-crafts' },
      { id: 'coins-collectibles', name: 'Coins & Collectibles', slug: 'coins-collectibles' },
      { id: 'cds-dvds', name: 'CDs & DVDs', slug: 'cds-dvds' },
      { id: 'other-hobbies', name: 'Other Hobbies', slug: 'other-hobbies' },
    ],
  },
  {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    icon: 'Baby',
    description: 'Kids products and baby items',
    subCategories: [
      { id: 'kids-furniture', name: 'Kids Furniture', slug: 'kids-furniture' },
      { id: 'kids-clothing', name: 'Kids Clothing', slug: 'kids-clothing' },
      { id: 'baby-care', name: 'Baby Care', slug: 'baby-care' },
      { id: 'kids-toys', name: 'Toys', slug: 'kids-toys' },
      { id: 'prams-walkers', name: 'Prams & Walkers', slug: 'prams-walkers' },
      { id: 'swings-slides', name: 'Swings & Slides', slug: 'swings-slides' },
      { id: 'kids-bikes', name: 'Kids Bikes', slug: 'kids-bikes' },
      { id: 'kids-accessories', name: 'Kids Accessories', slug: 'kids-accessories' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    slug: 'animals',
    icon: 'Cat',
    description: 'Pets and animals',
    subCategories: [
      { id: 'birds', name: 'Birds', slug: 'birds' },
      { id: 'cats', name: 'Cats', slug: 'cats' },
      { id: 'dogs', name: 'Dogs', slug: 'dogs' },
      { id: 'fish-aquariums', name: 'Fish & Aquariums', slug: 'fish-aquariums' },
      { id: 'livestock', name: 'Livestock', slug: 'livestock' },
      { id: 'pet-food-accessories', name: 'Pet Food & Accessories', slug: 'pet-food-accessories' },
      { id: 'other-animals', name: 'Other Animals', slug: 'other-animals' },
    ],
  },
  {
    id: 'business',
    name: 'Business, Industrial & Agriculture',
    slug: 'business',
    icon: 'Factory',
    description: 'Business equipment and industrial items',
    subCategories: [
      { id: 'business-for-sale', name: 'Business for Sale', slug: 'business-for-sale' },
      { id: 'food-restaurant', name: 'Food & Restaurant', slug: 'food-restaurant' },
      { id: 'medical-pharma', name: 'Medical & Pharma', slug: 'medical-pharma' },
      { id: 'construction-heavy-machinery', name: 'Construction & Heavy Machinery', slug: 'construction-heavy-machinery' },
      { id: 'agriculture', name: 'Agriculture', slug: 'agriculture' },
      { id: 'industrial-equipment', name: 'Industrial Equipment', slug: 'industrial-equipment' },
      { id: 'other-business', name: 'Other Business & Industry', slug: 'other-business' },
    ],
  },
];

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Get sub-category by slug
export function getSubCategoryBySlug(categorySlug: string, subCategorySlug: string): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories.find((s) => s.slug === subCategorySlug);
}

// Get all sub-categories for a category
export function getSubCategories(categorySlug: string): SubCategory[] {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories || [];
}
