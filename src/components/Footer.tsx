const Footer = () => {
  return (
    <footer className="bg-earth-brown text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-golden">Kissel Food</h3>
            <p className="text-gray-300">
              Serving exceptional dining experiences with authentic flavors and premium quality ingredients.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-golden transition-colors">Home</a></li>
              <li><a href="#menu" className="text-gray-300 hover:text-golden transition-colors">Menu</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-golden transition-colors">About</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-golden transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Our Menu</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Jollof Rice</li>
              <li>Artisan Pizza</li>
              <li>Fried Rice</li>
              <li>Fresh Beverages</li>
              <li>Fruit Juices</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-golden">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>123 Flavor Street</p>
              <p>Cuisine City, FC 12345</p>
              <p>Phone: (555) 123-FOOD</p>
              <p>Email: info@kisselfood.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Kissel Food Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;