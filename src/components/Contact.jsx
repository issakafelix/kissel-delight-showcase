import { useState } from 'react';

const Contact = () => {
  // --- ACTION REQUIRED: Get a free Form ID from Formspree.io and paste it here ---
  const FORMSPREE_ID = "mjgpwodq"; 
  
  const [formStatus, setFormStatus] = useState('Send Message');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending...');

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('✓ Message Sent!');
        setIsSuccess(true);
        form.reset();
        setTimeout(() => {
          setFormStatus('Send Message');
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setFormStatus('Error! Try again.');
      setTimeout(() => setFormStatus('Send Message'), 3000);
      console.error(error);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="contact__container">
        <div className="contact__info reveal-left">
          <span className="section__label">Contact Me</span>
          <h2 className="section__title">Let's build <br />something impactful</h2>
          <p className="contact__intro">Whether you have a specific project in mind or just want to discuss the future of the internet, I'd love to hear from you. Let's turn your vision into high-performance reality.</p>
          
          <div className="contact__info-item">
            <div className="contact__info-icon">✉️</div>
            <div className="contact__info-text">
              <h4>Email</h4>
              <p><a href="mailto:issakafelix57@gmail.com" className="contact__link">issakafelix57@gmail.com</a></p>
            </div>
          </div>
          
          <div className="contact__info-item">
            <div className="contact__info-icon">📞</div>
            <div className="contact__info-text">
              <h4>Phone</h4>
              <p>0549910292</p>
            </div>
          </div>
          
          <div className="contact__info-item">
            <div className="contact__info-icon">📍</div>
            <div className="contact__info-text">
              <h4>Location</h4>
              <p>Accra, Ghana</p>
            </div>
          </div>
          
          <div className="contact__map" style={{ marginTop: 'var(--space-xl)' }}>
            <iframe 
              src="https://maps.google.com/maps?q=Accra,%20Ghana&t=&z=12&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="200" 
              style={{ border: 0, borderRadius: 'var(--radius-lg)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map showing Accra, Ghana"
            ></iframe>
          </div>
        </div>

        <form className="contact__form reveal-right" id="contact-form" onSubmit={handleSubmit}>
          <h3 className="contact__form-title">Send Message</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input name="name" type="text" id="name" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input name="email" type="email" id="email" required placeholder="your.email@gmail.com" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea name="message" id="message" required placeholder="Tell me about your project or network inquiry..."></textarea>
          </div>
          <button 
            type="submit" 
            className="btn btn--primary" 
            style={isSuccess ? { background: '#22c55e' } : {}}
          >
            {formStatus} <span className="arrow">→</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
