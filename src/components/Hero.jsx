import profilePic from '../assets/profile2.jpg';

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          <span style={{ display: 'block', fontSize: 'var(--fs-lg)', color: 'var(--accent)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-xs)' }}>
            Hi, my name is
          </span>
          <span style={{ display: 'block', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 'var(--fw-black)', color: 'var(--text-primary)', marginBottom: 'var(--space-md)', lineHeight: '1.1', letterSpacing: '-1px' }}>
            Issaka Felix.
          </span>
          Frontend Developer <br />
          <span className="highlight">Building modern web applications</span>
        </h1>

        <p className="hero__bio">
          I am a <strong>Frontend Developer</strong> studying at <strong>Accra Technical University</strong>. I craft fast, scalable, and responsive web applications using modern UI technologies, with a strong foundation in <strong>System Analysis</strong>.
        </p>
        
        <p className="hero__bio">
          Beyond the frontend, my personal passions lie in <strong>Networking and Cybersecurity</strong>, allowing me to build interfaces that are not only beautiful and user-friendly, but also secure and architecturally sound.
        </p>

        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">View Projects <span className="arrow">→</span></a>
          <a href="#contact" className="btn btn--outline">Get In Touch</a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
