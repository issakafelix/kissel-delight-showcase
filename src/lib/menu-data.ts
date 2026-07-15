export type MenuCategory = "mains" | "pastries" | "drinks";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  badge?: string;
  available: boolean;
  sortOrder: number;
}

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  mains: "Meals & Noodles",
  pastries: "Pastries",
  drinks: "Minerals & Drinks",
};

export const formatGHS = (amount: number) => `GH₵${amount.toFixed(2)}`;

// Static fallback catalog — used when the Firestore `menuItems` collection is
// empty or unreachable, and as the source for the one-click admin seeding.
export const DEFAULT_MENU: Omit<MenuItem, "id">[] = [
  {
    name: "Classic Jollof Rice",
    description: "Our signature rich, smoky, and perfectly spiced traditional Jollof rice cooked in a savory tomato broth.",
    price: 50,
    image: "/menu/jollof-rice.jpg",
    category: "mains",
    badge: "Popular",
    available: true,
    sortOrder: 1,
  },
  {
    name: "Assorted Jollof",
    description: "A premium bowl of Jollof rice loaded with a mix of chicken, beef, sausage, and veggies.",
    price: 85,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    category: "mains",
    badge: "Chef's Special",
    available: true,
    sortOrder: 2,
  },
  {
    name: "Special Fried Rice",
    description: "Wok-tossed fragrant rice with fresh vegetables and eggs.",
    price: 45,
    image: "/menu/fried-rice.jpg",
    category: "mains",
    available: true,
    sortOrder: 3,
  },
  {
    name: "Assorted Fried Rice",
    description: "Premium fried rice tossed with assorted meats, vegetables, and scrambled eggs.",
    price: 80,
    image: "https://loremflickr.com/800/600/fried,rice?lock=20",
    category: "mains",
    available: true,
    sortOrder: 4,
  },
  {
    name: "Indomie Noodles",
    description: "Savory stir-fried Indomie noodles mixed with spices, eggs, vegetables.",
    price: 40,
    image: "https://loremflickr.com/800/600/noodles?lock=30",
    category: "mains",
    available: true,
    sortOrder: 5,
  },
  {
    name: "Assorted Indomie",
    description: "A large portion of stir-fried noodles infused with assorted proteins and vegetables.",
    price: 60,
    image: "https://loremflickr.com/800/600/ramen?lock=40",
    category: "mains",
    available: true,
    sortOrder: 6,
  },
  {
    name: "Golden Meat Pie",
    description: "Flaky, buttery crust filled with a savory and well-seasoned chunky meat sauce.",
    price: 25,
    image: "https://loremflickr.com/800/600/pastry,pie?lock=50",
    category: "pastries",
    available: true,
    sortOrder: 7,
  },
  {
    name: "Decadent Cake",
    description: "A slice of our rich, freshly baked daily specialty cake. (Chocolate or Vanilla).",
    price: 30,
    image: "https://loremflickr.com/800/600/cake,dessert?lock=60",
    category: "pastries",
    badge: "Sweet",
    available: true,
    sortOrder: 8,
  },
  {
    name: "Artisan Pizza Slice",
    description: "Freshly baked pizza with an assortment of savory toppings.",
    price: 40,
    image: "/menu/pizza.jpg",
    category: "pastries",
    available: true,
    sortOrder: 9,
  },
  {
    name: "Assorted Soft Drinks",
    description: "Chilled selection of popular soft drinks (Coke, Sprite, Fanta).",
    price: 15,
    image: "/menu/beverages.jpg",
    category: "drinks",
    available: true,
    sortOrder: 10,
  },
  {
    name: "Malta & Dark Drinks",
    description: "A rich selection of malt drinks for that extra energy.",
    price: 20,
    image: "https://loremflickr.com/800/600/soda,bottle?lock=70",
    category: "drinks",
    available: true,
    sortOrder: 11,
  },
  {
    name: "Fresh Fruit Juices",
    description: "Locally pressed fruit juices served icy cold to refresh your palate.",
    price: 25,
    image: "https://loremflickr.com/800/600/juice,drink?lock=80",
    category: "drinks",
    available: true,
    sortOrder: 12,
  },
];

export const FALLBACK_MENU: MenuItem[] = DEFAULT_MENU.map((item, i) => ({
  ...item,
  id: `static-${i + 1}`,
}));
