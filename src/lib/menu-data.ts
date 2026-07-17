export type MenuCategory = "rice" | "chicken" | "pizza" | "drinks";

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  rice: "Rice Dishes",
  chicken: "Chicken & Proteins",
  pizza: "Pizza",
  drinks: "Soft Drinks",
};

export const CATEGORY_ORDER: MenuCategory[] = ["rice", "chicken", "pizza", "drinks"];

// ── Money ─────────────────────────────────────────────────────────────────
// All prices are integer PESEWAS to avoid floating-point errors.
// 100 pesewas = GHS 1.00.
export const formatPrice = (pesewas: number) => `₵${(pesewas / 100).toFixed(2)}`;
export const cedisToPesewas = (cedis: number) => Math.round(cedis * 100);
export const pesewasToCedis = (pesewas: number) => pesewas / 100;

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ── Menu shape ──────────────────────────────────────────────────────────────
// A variant is a required, mutually-exclusive choice that SETS the price
// (e.g. pizza Medium/Large, chicken Half/Full). An add-on is an optional
// extra that ADDS to the price (e.g. extra chicken, extra cheese).
export interface MenuVariant {
  id: string;
  name: string;
  price: number; // absolute price in pesewas for this variant
}

export interface MenuAddon {
  id: string;
  name: string;
  price: number; // pesewas added on top of the base/variant price
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // base price in pesewas; ignored for display when variants exist
  category: MenuCategory;
  image: string;
  available: boolean;
  sortOrder: number;
  badge?: string;
  variants?: MenuVariant[];
  addons?: MenuAddon[];
}

// The lowest sticker price, used for the "from ₵.." label on variant items.
export const displayFromPrice = (item: Pick<MenuItem, "price" | "variants">) =>
  item.variants && item.variants.length
    ? Math.min(...item.variants.map((v) => v.price))
    : item.price;

export const hasChoices = (item: Pick<MenuItem, "variants" | "addons">) =>
  Boolean((item.variants && item.variants.length) || (item.addons && item.addons.length));

// ── Reusable add-on sets ────────────────────────────────────────────────────
const RICE_ADDONS: MenuAddon[] = [
  { id: "extra-chicken", name: "Extra Chicken", price: 1500 },
  { id: "extra-egg", name: "Extra Egg", price: 500 },
  { id: "extra-shito", name: "Extra Shito", price: 300 },
];
const CHICKEN_ADDONS: MenuAddon[] = [
  { id: "extra-sauce", name: "Extra Sauce", price: 300 },
];
const PIZZA_ADDONS: MenuAddon[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 1000 },
  { id: "extra-chicken", name: "Extra Chicken", price: 1500 },
];

// ── Default Kissel Food catalog (Accra, GHS). Source of truth for seeding. ──
export const DEFAULT_MENU: Omit<MenuItem, "id">[] = [
  // Rice Dishes
  {
    name: "Jollof Rice",
    slug: "jollof-rice",
    description: "Smoky Ghanaian jollof served with coleslaw and shito.",
    price: 5500,
    category: "rice",
    image: "/menu/jollof-rice.jpg",
    available: true,
    sortOrder: 1,
    badge: "Popular",
    addons: RICE_ADDONS,
  },
  {
    name: "Fried Rice",
    slug: "fried-rice",
    description: "Stir-fried rice with vegetables, served with coleslaw.",
    price: 5000,
    category: "rice",
    image: "/menu/fried-rice.jpg",
    available: true,
    sortOrder: 2,
    addons: RICE_ADDONS,
  },
  {
    name: "Assorted Jollof",
    slug: "assorted-jollof",
    description: "Jollof rice loaded with assorted meats (chicken, beef, sausage, gizzard).",
    price: 7000,
    category: "rice",
    image: "/menu/assorted-jollof.jpg",
    available: true,
    sortOrder: 3,
    badge: "Chef's Special",
    addons: RICE_ADDONS,
  },
  {
    name: "Assorted Fried Rice",
    slug: "assorted-fried-rice",
    description: "Fried rice with assorted meats and vegetables.",
    price: 7000,
    category: "rice",
    image: "/menu/assorted-fried-rice.jpg",
    available: true,
    sortOrder: 4,
    addons: RICE_ADDONS,
  },

  // Chicken & Proteins
  {
    name: "Grilled Chicken",
    slug: "grilled-chicken",
    description: "Flame-grilled chicken marinated in Ghanaian spices.",
    price: 4000,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    available: true,
    sortOrder: 5,
    variants: [
      { id: "half", name: "Half", price: 4000 },
      { id: "full", name: "Full", price: 7500 },
    ],
    addons: CHICKEN_ADDONS,
  },
  {
    name: "Fried Chicken",
    slug: "fried-chicken",
    description: "Crispy golden fried chicken, seasoned and double-fried.",
    price: 3000,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    available: true,
    sortOrder: 6,
    variants: [
      { id: "2pc", name: "2 pieces", price: 3000 },
      { id: "4pc", name: "4 pieces", price: 5500 },
    ],
    addons: CHICKEN_ADDONS,
  },
  {
    name: "Chicken Wings",
    slug: "chicken-wings",
    description: "Spicy glazed chicken wings, tossed in our house sauce.",
    price: 3500,
    category: "chicken",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80",
    available: true,
    sortOrder: 7,
    variants: [
      { id: "6pc", name: "6 pieces", price: 3500 },
      { id: "12pc", name: "12 pieces", price: 6500 },
    ],
    addons: CHICKEN_ADDONS,
  },

  // Pizza
  {
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    description: "Classic tomato, mozzarella & fresh basil.",
    price: 6000,
    category: "pizza",
    image: "/menu/pizza.jpg",
    available: true,
    sortOrder: 8,
    variants: [
      { id: "medium", name: "Medium", price: 6000 },
      { id: "large", name: "Large", price: 8500 },
    ],
    addons: PIZZA_ADDONS,
  },
  {
    name: "Chicken BBQ Pizza",
    slug: "chicken-bbq-pizza",
    description: "BBQ chicken, onions, peppers & mozzarella.",
    price: 7500,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    available: true,
    sortOrder: 9,
    variants: [
      { id: "medium", name: "Medium", price: 7500 },
      { id: "large", name: "Large", price: 10000 },
    ],
    addons: PIZZA_ADDONS,
  },
  {
    name: "Pepperoni Pizza",
    slug: "pepperoni-pizza",
    description: "Loaded pepperoni & mozzarella on a rich tomato base.",
    price: 7500,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    available: true,
    sortOrder: 10,
    variants: [
      { id: "medium", name: "Medium", price: 7500 },
      { id: "large", name: "Large", price: 10500 },
    ],
    addons: PIZZA_ADDONS,
  },
  {
    name: "Kissel Special Pizza",
    slug: "kissel-special-pizza",
    description: "Chicken, beef, sausage, peppers & extra cheese — the house favourite.",
    price: 9000,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1621070766841-a7bf1ee96df0?w=800&q=80",
    available: true,
    sortOrder: 11,
    badge: "House Favourite",
    variants: [
      { id: "medium", name: "Medium", price: 9000 },
      { id: "large", name: "Large", price: 12000 },
    ],
    addons: PIZZA_ADDONS,
  },

  // Soft Drinks
  {
    name: "Coca-Cola",
    slug: "coca-cola",
    description: "Chilled and served ice-cold.",
    price: 1000,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
    available: true,
    sortOrder: 12,
  },
  {
    name: "Fanta",
    slug: "fanta",
    description: "Chilled 300ml orange soda.",
    price: 1000,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80",
    available: true,
    sortOrder: 13,
  },
  {
    name: "Sprite",
    slug: "sprite",
    description: "Chilled 300ml lemon-lime soda.",
    price: 1000,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80",
    available: true,
    sortOrder: 14,
  },
  {
    name: "Malta Guinness",
    slug: "malta-guinness",
    description: "Rich non-alcoholic malt drink.",
    price: 1500,
    category: "drinks",
    image: "/menu/beverages.jpg",
    available: true,
    sortOrder: 15,
  },
  {
    name: "Bottled Water",
    slug: "bottled-water",
    description: "500ml purified drinking water.",
    price: 800,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    available: true,
    sortOrder: 16,
  },
];

export const FALLBACK_MENU: MenuItem[] = DEFAULT_MENU.map((item, i) => ({
  ...item,
  id: `static-${i + 1}`,
}));
