import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

import jollofImg from "@/assets/jollof-rice.jpg";
import friedRiceImg from "@/assets/fried-rice.jpg";
import beveragesImg from "@/assets/beverages.jpg";
import pizzaImg from "@/assets/pizza.jpg";

const menuData = {
  mains: [
    {
      id: 1,
      name: "Classic Jollof Rice",
      description: "Our signature rich, smoky, and perfectly spiced traditional Jollof rice cooked in a savory tomato broth.",
      price: "GH₵ 50.00",
      image: jollofImg,
      badge: "Popular"
    },
    {
      id: 2,
      name: "Assorted Jollof",
      description: "A premium bowl of Jollof rice loaded with a mix of chicken, beef, sausage, and veggies.",
      price: "GH₵ 85.00",
      image: "https://loremflickr.com/800/600/meal,rice?lock=10",
      badge: "Chef's Special"
    },
    {
      id: 3,
      name: "Special Fried Rice",
      description: "Wok-tossed fragrant rice with fresh vegetables and eggs.",
      price: "GH₵ 45.00",
      image: friedRiceImg
    },
    {
      id: 4,
      name: "Assorted Fried Rice",
      description: "Premium fried rice tossed with assorted meats, vegetables, and scrambled eggs.",
      price: "GH₵ 80.00",
      image: "https://loremflickr.com/800/600/fried,rice?lock=20"
    },
    {
      id: 5,
      name: "Indomie Noodles",
      description: "Savory stir-fried Indomie noodles mixed with spices, eggs, vegetables.",
      price: "GH₵ 40.00",
      image: "https://loremflickr.com/800/600/noodles?lock=30"
    },
    {
      id: 6,
      name: "Assorted Indomie",
      description: "A large portion of stir-fried noodles infused with assorted proteins and vegetables.",
      price: "GH₵ 60.00",
      image: "https://loremflickr.com/800/600/ramen?lock=40"
    }
  ],
  pastries: [
    {
      id: 7,
      name: "Golden Meat Pie",
      description: "Flaky, buttery crust filled with a savory and well-seasoned chunky meat sauce.",
      price: "GH₵ 25.00",
      image: "https://loremflickr.com/800/600/pastry,pie?lock=50"
    },
    {
      id: 8,
      name: "Decadent Cake",
      description: "A slice of our rich, freshly baked daily specialty cake. (Chocolate or Vanilla).",
      price: "GH₵ 30.00",
      image: "https://loremflickr.com/800/600/cake,dessert?lock=60",
      badge: "Sweet"
    },
    {
      id: 9,
      name: "Artisan Pizza Slice",
      description: "Freshly baked pizza with an assortment of savory toppings.",
      price: "GH₵ 40.00",
      image: pizzaImg
    }
  ],
  minerals: [
    {
      id: 10,
      name: "Assorted Soft Drinks",
      description: "Chilled selection of popular soft drinks (Coke, Sprite, Fanta).",
      price: "GH₵ 15.00",
      image: beveragesImg
    },
    {
      id: 11,
      name: "Malta & Dark Drinks",
      description: "A rich selection of malt drinks for that extra energy.",
      price: "GH₵ 20.00",
      image: "https://loremflickr.com/800/600/soda,bottle?lock=70"
    },
    {
      id: 12,
      name: "Fresh Fruit Juices",
      description: "Locally pressed fruit juices served icy cold to refresh your palate.",
      price: "GH₵ 25.00",
      image: "https://loremflickr.com/800/600/juice,drink?lock=80"
    }
  ]
};

const MenuCard = ({ item }: { item: any }) => {
  const { addToCart } = useCart();
  
  return (
    <Card className="overflow-hidden hover:shadow-warm transition-all duration-300 transform group bg-gradient-card border-golden/20 h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
        {item.badge && (
          <span className="absolute top-4 right-4 z-20 bg-golden text-earth-brown text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {item.badge}
          </span>
        )}
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
          <span className="text-xl font-bold text-primary whitespace-nowrap">{item.price}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Button 
          onClick={() => addToCart({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price.replace("GH₵", "").trim()),
            image: item.image
          })}
          variant="outline" 
          className="w-full hover:bg-primary hover:text-white transition-colors border-primary/50 text-primary"
        >
          Add to Order
        </Button>
      </CardContent>
    </Card>
  );
};

const MenuSection = () => {
  return (
    <section id="menu" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Discover Our Menu</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From our sizzling hot Jollof straight from the pan to mouth-watering pastries. Our dishes are prepared exactly how you love them.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Mains Category */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-bold text-earth-brown dark:text-foreground">Meals & Noodles</h3>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData.mains.map(item => <MenuCard key={item.id} item={item} />)}
            </div>
          </div>

          {/* Pastries Category */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-bold text-earth-brown dark:text-foreground">Pastries</h3>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData.pastries.map(item => <MenuCard key={item.id} item={item} />)}
            </div>
          </div>

          {/* Minerals & Drinks Category */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-bold text-earth-brown dark:text-foreground">Minerals & Drinks</h3>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData.minerals.map(item => <MenuCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MenuSection;