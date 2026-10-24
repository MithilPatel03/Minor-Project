// Initial multi-restaurant platform dataset for EazyOrder

export const RESTAURANTS = [
  {
    id: 'r1',
    name: 'The Truffle Bistro & Steakhouse',
    cuisine: 'Gourmet Steak & Continental',
    rating: 4.9,
    reviewsCount: 342,
    location: 'MG Road, Indiranagar',
    deliveryTime: '15-20 min dine-in',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['Luxury Dining', 'Chef Special', 'Cocktail Bar']
  },
  {
    id: 'r2',
    name: 'Pizza Royale Neapolitan',
    cuisine: 'Stone-Baked Pizza & Pasta',
    rating: 4.8,
    reviewsCount: 512,
    location: 'Koramangala 5th Block',
    deliveryTime: '12-15 min dine-in',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    tags: ['Wood-Fired', 'Authentic Italian', 'Popular']
  },
  {
    id: 'r3',
    name: 'Spice Symphony Indian Grill',
    cuisine: 'North & South Indian Gourmet',
    rating: 4.7,
    reviewsCount: 289,
    location: 'Jubilee Hills, Road No 36',
    deliveryTime: '15-25 min dine-in',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Tandoori', 'Biryani', 'Family Dining']
  },
  {
    id: 'r4',
    name: 'Zenith Craft Cocktails & Desserts',
    cuisine: 'Artisanal Drinks & Pastries',
    rating: 4.9,
    reviewsCount: 198,
    location: 'Bandra West, Mumbai',
    deliveryTime: '5-10 min dine-in',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    tags: ['Nightlife', 'Dessert Lounge', 'Mocktails']
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Full Menu', icon: 'Utensils' },
  { id: 'specials', name: "Chef's Specials", icon: 'Sparkles' },
  { id: 'starters', name: 'Artisanal Starters', icon: 'Soup' },
  { id: 'mains', name: 'Gourmet Mains', icon: 'Beef' },
  { id: 'pizza', name: 'Stone-Baked Pizza', icon: 'Pizza' },
  { id: 'drinks', name: 'Craft Drinks & Cocktails', icon: 'Wine' },
  { id: 'desserts', name: 'Decadent Desserts', icon: 'Cake' }
];

export const INITIAL_MENU = [
  {
    id: 'm1',
    restaurantId: 'r1',
    name: 'Truffle Ribeye Steak',
    category: 'specials',
    price: 1299,
    description: 'Prime 12oz Black Angus ribeye infused with black truffle butter, served with rosemary roasted fingerling potatoes and wild asparagus.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prepTime: '20-25 mins',
    calories: 850,
    tags: ['Chef Pick', 'Gluten-Free'],
    isVeg: false,
    spicyLevel: 0,
    customizations: {
      doneness: ['Rare', 'Medium Rare', 'Medium', 'Well Done'],
      sides: ['Rosemary Potatoes', 'Truffle Fries', 'Garlic Mash'],
      extras: [
        { name: 'Extra Truffle Butter', price: 99 },
        { name: 'Sautéed Wild Mushrooms', price: 120 }
      ]
    },
    inStock: true
  },
  {
    id: 'm2',
    restaurantId: 'r1',
    name: 'Artisanal Burrata & Heirloom Salad',
    category: 'starters',
    price: 499,
    description: 'Fresh Italian burrata cheese, organic heirloom tomatoes, micro basil, toasted pine nuts, aged balsamic glaze, and grilled sourdough.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1628d?auto=format&fit=crop&w=800&q=80',
    prepTime: '10-12 mins',
    calories: 420,
    tags: ['Vegetarian', 'Popular'],
    isVeg: true,
    spicyLevel: 0,
    customizations: {
      bread: ['Grilled Sourdough', 'Gluten-Free Toast', 'No Bread'],
      extras: [
        { name: 'Add Prosciutto di Parma', price: 150 },
        { name: 'Extra Balsamic Glaze', price: 40 }
      ]
    },
    inStock: true
  },
  {
    id: 'm3',
    restaurantId: 'r1',
    name: 'Wild Mushroom Truffle Risotto',
    category: 'mains',
    price: 649,
    description: 'Creamy Carnaroli rice cooked slow with porcini broth, shaved Parmigiano-Reggiano, thyme, and white truffle oil drizzle.',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    prepTime: '15-20 mins',
    calories: 610,
    tags: ['Vegetarian', 'Gluten-Free'],
    isVeg: true,
    spicyLevel: 0,
    customizations: {
      cheese: ['Extra Parmigiano', 'Dairy-Free Cheese', 'Light Cheese'],
      extras: [
        { name: 'Add Grilled Chicken', price: 150 },
        { name: 'Add Sautéed Shrimp', price: 180 }
      ]
    },
    inStock: true
  },
  {
    id: 'm4',
    restaurantId: 'r2',
    name: 'Wood-Fired Margherita Royale',
    category: 'pizza',
    price: 449,
    description: 'Neapolitan style sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    prepTime: '12-15 mins',
    calories: 780,
    tags: ['Vegetarian', 'Bestseller'],
    isVeg: true,
    spicyLevel: 0,
    customizations: {
      crust: ['Classic Neapolitan', 'Crispy Thin Crust', 'Gluten-Free Crust (+ ₹80)'],
      extras: [
        { name: 'Double Mozzarella', price: 80 },
        { name: 'Spicy Chili Oil Drizzle', price: 30 },
        { name: 'Add Burrata Bomb', price: 160 }
      ]
    },
    inStock: true
  },
  {
    id: 'm5',
    restaurantId: 'r2',
    name: 'Diablo Spicy Pepperoni Pizza',
    category: 'pizza',
    price: 549,
    description: 'Artisan pepperoni, hot capocollo, spicy Calabrian chili crunch, mozzarella, and hot honey drizzle on sourdough crust.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    prepTime: '12-15 mins',
    calories: 890,
    tags: ['Spicy', 'Popular'],
    isVeg: false,
    spicyLevel: 2,
    customizations: {
      crust: ['Classic Neapolitan', 'Crispy Thin Crust'],
      extras: [
        { name: 'Extra Hot Honey', price: 40 },
        { name: 'Add Pickled Jalapeños', price: 40 }
      ]
    },
    inStock: true
  },
  {
    id: 'm6',
    restaurantId: 'r3',
    name: 'Royal Shahi Paneer Butter Masala',
    category: 'mains',
    price: 380,
    description: 'Charcoal grilled cottage cheese cubes simmered in velvet cashew, fresh cream, and San Marzano tomato gravy.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    prepTime: '15-20 mins',
    calories: 520,
    tags: ['Vegetarian', 'Popular'],
    isVeg: true,
    spicyLevel: 1,
    customizations: {
      spice: ['Mild', 'Medium Spicy', 'Extra Spicy'],
      extras: [
        { name: 'Butter Naan (2 pcs)', price: 80 },
        { name: 'Garlic Naan (2 pcs)', price: 99 }
      ]
    },
    inStock: true
  },
  {
    id: 'm7',
    restaurantId: 'r3',
    name: 'Hydrabadi Dum Chicken Biryani',
    category: 'specials',
    price: 420,
    description: 'Aromatic long-grain Basmati rice slow dum cooked with marinated tender chicken, saffron, mint, and whole spices.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    calories: 740,
    tags: ['Bestseller', 'Chef Pick'],
    isVeg: false,
    spicyLevel: 2,
    customizations: {
      extras: [
        { name: 'Extra Mirchi Ka Salan', price: 40 },
        { name: 'Boiled Egg (2 pcs)', price: 40 }
      ]
    },
    inStock: true
  },
  {
    id: 'm8',
    restaurantId: 'r4',
    name: 'Valrhona Lava Chocolate Cake',
    category: 'desserts',
    price: 399,
    description: 'Warm French dark chocolate molten cake served with Madagascar vanilla bean gelato and berry compote.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    prepTime: '10 mins',
    calories: 640,
    tags: ['Vegetarian', 'Chef Pick'],
    isVeg: true,
    spicyLevel: 0,
    customizations: {
      iceCream: ['Madagascar Vanilla', 'Pistachio Gelato', 'Vegan Dark Chocolate'],
      extras: [
        { name: 'Extra Gelato Scoop', price: 99 }
      ]
    },
    inStock: true
  },
  {
    id: 'm9',
    restaurantId: 'r4',
    name: 'Yuzu Dragonfruit Sparkler (Mocktail)',
    category: 'drinks',
    price: 299,
    description: 'Fresh Japanese yuzu, pink dragonfruit puree, sparkling mineral water, fresh mint, and agave nectar.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    prepTime: '4 mins',
    calories: 110,
    tags: ['Non-Alcoholic', 'Vegan'],
    isVeg: true,
    spicyLevel: 0,
    customizations: {},
    inStock: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1001',
    tableNumber: '04',
    restaurantId: 'r1',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'PREPARING',
    items: [
      {
        id: 'm1',
        name: 'Truffle Ribeye Steak',
        price: 1299,
        quantity: 1,
        selectedOptions: { doneness: 'Medium Rare', sides: 'Rosemary Potatoes' }
      }
    ],
    subtotal: 1299,
    tax: 64.95,
    tip: 100,
    total: 1463.95,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI Payment'
  }
];
