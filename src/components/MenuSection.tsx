import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/db";
import {
  MenuItem,
  MenuCategory,
  MenuVariant,
  MenuAddon,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  FALLBACK_MENU,
  formatPrice,
  displayFromPrice,
  hasChoices,
} from "@/lib/menu-data";

type CategoryFilter = MenuCategory | "all";

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
];

// ── Customisation dialog for items with sizes and/or add-ons ────────────────
const CustomizeDialog = ({
  item,
  open,
  onOpenChange,
}: {
  item: MenuItem;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const { addToCart } = useCart();
  const hasVariants = Boolean(item.variants && item.variants.length);
  const [variantId, setVariantId] = useState<string>(item.variants?.[0]?.id ?? "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const variant: MenuVariant | undefined = item.variants?.find((v) => v.id === variantId);
  const basePrice = variant ? variant.price : item.price;
  const addonObjs: MenuAddon[] = (item.addons ?? []).filter((a) => selectedAddons.includes(a.id));
  const unitPrice = basePrice + addonObjs.reduce((s, a) => s + a.price, 0);

  const toggleAddon = (id: string) =>
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleAdd = () => {
    addToCart(
      {
        itemId: item.id,
        name: variant ? `${item.name} (${variant.name})` : item.name,
        image: item.image,
        variantId: variant?.id,
        variantName: variant?.name,
        addons: addonObjs.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        unitPrice,
      },
      quantity
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {hasVariants && (
            <div>
              <p className="text-sm font-semibold mb-2">Choose a size <span className="text-primary">*</span></p>
              <RadioGroup value={variantId} onValueChange={setVariantId} className="space-y-2">
                {item.variants!.map((v) => (
                  <Label
                    key={v.id}
                    htmlFor={`v-${v.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors",
                      variantId === v.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem value={v.id} id={`v-${v.id}`} />
                      <span className="font-medium">{v.name}</span>
                    </span>
                    <span className="font-bold text-primary">{formatPrice(v.price)}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {item.addons && item.addons.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Add extras <span className="text-muted-foreground font-normal">(optional)</span></p>
              <div className="space-y-2">
                {item.addons.map((a) => (
                  <Label
                    key={a.id}
                    htmlFor={`a-${a.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors",
                      selectedAddons.includes(a.id) ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Checkbox id={`a-${a.id}`} checked={selectedAddons.includes(a.id)} onCheckedChange={() => toggleAddon(a.id)} />
                      <span className="font-medium">{a.name}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">+{formatPrice(a.price)}</span>
                  </Label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 hover:bg-muted transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-2 hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button onClick={handleAdd} size="lg" className="w-full py-6 text-base rounded-xl">
            Add to Order · {formatPrice(unitPrice * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addToCart } = useCart();
  const [customizing, setCustomizing] = useState(false);
  const customizable = hasChoices(item);
  const fromPrice = displayFromPrice(item);

  const handleClick = () => {
    if (!item.available) return;
    if (customizable) {
      setCustomizing(true);
    } else {
      addToCart({ itemId: item.id, name: item.name, image: item.image, addons: [], unitPrice: item.price });
    }
  };

  return (
    <>
      {customizable && item.available && (
        <CustomizeDialog item={item} open={customizing} onOpenChange={setCustomizing} />
      )}
      <Card className={cn(
        "overflow-hidden hover:shadow-warm transition-all duration-300 transform group bg-gradient-card border-golden/20 h-full flex flex-col",
        !item.available && "opacity-80"
      )}>
        <div className="relative h-56 sm:h-64 overflow-hidden">
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
              e.currentTarget.src = "/menu/jollof-rice.jpg";
            }}
          />
        </div>
        <CardHeader className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-earth-brown dark:text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</CardTitle>
              <CardDescription className="text-sm text-foreground/80 leading-relaxed max-w-[210px]">{item.description}</CardDescription>
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary whitespace-nowrap">
              {item.variants && item.variants.length ? <span className="text-xs font-medium text-muted-foreground block">from</span> : null}
              {formatPrice(fromPrice)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 mt-auto">
          <Button
            onClick={handleClick}
            disabled={!item.available}
            variant="outline"
            className="w-full hover:bg-primary hover:text-white transition-colors border-primary/50 text-primary disabled:opacity-60"
          >
            {!item.available ? "Currently Unavailable" : customizable ? "Choose Options" : "Add to Order"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

const MenuSection = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

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
      return item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
    });
  }, [items, search, category]);

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        items: filtered.filter((i) => i.category === cat),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  return (
    <section id="menu" className="py-20 sm:py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Discover Our Menu</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            From smoky Ghanaian jollof to sizzling grilled chicken and stone-baked pizza — freshly made to order.
          </p>
        </div>

        {/* Search + category filters */}
        <div className="max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, e.g. jollof, chicken, pizza…"
              className="pl-12 h-14 text-base rounded-full bg-muted/40 border-golden/20 focus-visible:ring-primary"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={cn(
                  "px-4 sm:px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors border",
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

        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24">
          {grouped.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg py-16">
              No dishes match "{search}". Try a different search.
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-earth-brown dark:text-foreground">{CATEGORY_LABELS[group.category]}</h3>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {group.items.map((item) => <MenuCard key={item.id} item={item} />)}
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
