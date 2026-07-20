const images = [
  {
    src: "/menu/jollof-rice.jpg",
    alt: "Jollof Rice with Grilled Chicken",
    className: "md:col-span-2 md:row-span-2"
  },
  {
    src: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    alt: "Flame-Grilled Chicken",
    className: "col-span-1 row-span-1"
  },
  {
    src: "/menu/pizza.jpg",
    alt: "Stone-Baked Pizza",
    className: "col-span-1 row-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80",
    alt: "Crispy Chicken Wings",
    className: "col-span-1 row-span-1"
  },
  {
    src: "/menu/assorted-jollof.jpg",
    alt: "Assorted Jollof Platter with Grilled Fish",
    className: "md:col-span-2 row-span-1"
  }
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-cream dark:bg-background/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Food</span>
          <h2 className="text-4xl md:text-5xl font-bold text-earth-brown dark:text-foreground mb-4">A Taste of the Menu</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A closer look at what comes out of the kitchen — cooked fresh, plated simply, ready to order.
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
                  e.currentTarget.src = "/menu/jollof-rice.jpg";
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
