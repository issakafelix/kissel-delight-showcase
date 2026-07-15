import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/db";
import { MenuItem, MenuCategory, CATEGORY_LABELS, FALLBACK_MENU, formatGHS } from "@/lib/menu-data";

type CategoryFilter = MenuCategory | "all";

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mains", label: CATEGORY_LABELS.mains },
  { value: "pastries", label: CATEGORY_LABELS.pastries },
  { value: "drinks", label: CATEGORY_LABELS.drinks },
];

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addToCart } = useCart();

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-warm transition-all duration-300 transform group bg-gradient-card border-golden/20 h-full flex flex-col",
      !item.available && "opacity-80"
    )}>
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
        {item.badge && item.available && (
          <span className="absolute top-4 right-4 z-20 bg-golden text-earth-brown text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {item.badge}
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
            !item.available && "grayscale"
          )}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
          }}
        />
      </div>
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl text-earth-brown dark:text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</CardTitle>
            <CardDescription className="text-sm text-foreground/80 leading-relaxed max-w-[200px]">{item.description}</CardDescription>
          </div>
          <span className="text-xl font-bold text-primary whitespace-nowrap">{formatGHS(item.price)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Button
          onClick={() => addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image
          })}
          disabled={!item.available}
          variant="outline"
          className="w-full hover:bg-primary hover:text-white transition-colors border-primary/50 text-primary disabled:opacity-60"
        >
          {item.available ? "Add to Order" : "Currently Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
};

const MenuSection = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // Live menu from Firestore; falls back to the static catalog when the
  // collection is empty or the network/rules block the read.
  const { data: menu } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const items = await db.fetchMenu();
      return items.length > 0 ? items : FALLBACK_MENU;
    },
    placeholderData: FALLBACK_MENU,
    retry: 1,
    staleTime: 60_000,
  });

  const items = menu ?? FALLBACK_MENU;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    });
  }, [items, search, category]);

  const grouped = useMemo(() => {
    const categories: MenuCategory[] = ["mains", "pastries", "drinks"];
    return categories
      .map((cat) => ({ category: cat, items: filtered.filter((i) => i.category === cat) }))
      .filter((group) => group.items.length > 0);
  }, [filtered]);

  return (
    <section id="menu" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Discover Our Menu</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From our sizzling hot Jollof straight from the pan to mouth-watering pastries. Our dishes are prepared exactly how you love them.
          </p>
        </div>

        {/* Search + category filters */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, e.g. jollof, noodles, juice…"
              className="pl-12 h-14 text-base rounded-full bg-muted/40 border-golden/20 focus-visible:ring-primary"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors border",
                  category === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-24">
          {grouped.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg py-16">
              No dishes match "{search}". Try a different search.
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-3xl font-bold text-earth-brown dark:text-foreground">{CATEGORY_LABELS[group.category]}</h3>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.items.map(item => <MenuCard key={item.id} item={item} />)}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default MenuSection;
