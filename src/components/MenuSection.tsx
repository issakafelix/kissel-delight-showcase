import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jollofImage from "@/assets/jollof-rice.jpg";
import pizzaImage from "@/assets/pizza.jpg";
import friedRiceImage from "@/assets/fried-rice.jpg";
import beveragesImage from "@/assets/beverages.jpg";

const menuItems = [
  {
    id: 1,
    name: "Jollof Rice",
    description: "Authentic Nigerian Jollof rice cooked with aromatic spices, vegetables, and your choice of protein. A traditional favorite that brings the taste of Nigeria to your table.",
    price: "$15.99",
    image: jollofImage,
    category: "Main Course"
  },
  {
    id: 2,
    name: "Artisan Pizza",
    description: "Hand-crafted pizza with fresh ingredients, premium cheese, and our signature sauce. Choose from various toppings to create your perfect slice.",
    price: "$18.99",
    image: pizzaImage,
    category: "Main Course"
  },
  {
    id: 3,
    name: "Special Fried Rice",
    description: "Perfectly seasoned fried rice with fresh vegetables, eggs, and premium ingredients. A delightful fusion of flavors in every bite.",
    price: "$13.99",
    image: friedRiceImage,
    category: "Main Course"
  },
  {
    id: 4,
    name: "Fresh Beverages",
    description: "Refreshing selection of fruit juices, soft drinks, and specialty beverages. Made with fresh ingredients to complement your meal perfectly.",
    price: "$4.99",
    image: beveragesImage,
    category: "Beverages"
  }
];

const MenuSection = () => {
  return (
    <section id="menu" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-earth-brown mb-4">Our Menu</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of delicious dishes, prepared with the finest ingredients and authentic flavors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {menuItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-warm transition-all duration-300 transform hover:scale-105 bg-gradient-card border-golden/20"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-earth-brown">{item.name}</CardTitle>
                    <CardDescription className="text-sm text-primary font-medium">{item.category}</CardDescription>
                  </div>
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <Button variant="hero" className="w-full">
                  Order Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;