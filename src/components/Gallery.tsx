const images = [
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1920",
    alt: "Restaurant Interior",
    className: "md:col-span-2 md:row-span-2"
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    alt: "Gourmet Dish",
    className: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
    alt: "Fine Dining Setup",
    className: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800",
    alt: "Chef Plating",
    className: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-811c75db4482?auto=format&fit=crop&q=80&w=800",
    alt: "Beautiful Appetizer",
    className: "md:col-span-2 row-span-1"
  }
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-cream dark:bg-background/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Atmosphere</span>
          <h2 className="text-4xl md:text-5xl font-bold text-earth-brown dark:text-foreground mb-4">Our Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the Kissel Food experience. From our elegant dining room to the art of plating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] max-w-6xl mx-auto">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`overflow-hidden rounded-xl group relative shadow-elegant ${img.className}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
