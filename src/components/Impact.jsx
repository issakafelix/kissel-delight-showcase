const Impact = () => {
  const impacts = [
    { icon: '📈', title: 'Proven Track Record', desc: 'Over 5 years of delivering high-impact solutions that scale. From network diagnostics tools to enterprise SaaS platforms.' },
    { icon: '🛠️', title: 'Full-Stack Expertise', desc: 'End-to-end development capabilities from React frontends to Node.js backends and complex Cisco network configurations.' },
    { icon: '🛡️', title: 'Quality & Security', desc: 'Enterprise-grade security practices and high code quality thresholds ensure that your systems are fast, secure and reliable.' },
    { icon: '💡', title: 'Business Impact Focus', desc: 'Not just building features, but solving pain points. I focus on ROI, latency reduction, and engineering excellence.' }
  ];

  return (
    <section className="section section--alt" id="about">
      <div className="section">
        <div className="section__header section__header--center reveal">
          <span className="section__label">Why Work With Me</span>
          <h2 className="section__title">Proven track record of delivering <br />high-impact solutions</h2>
          <p className="section__subtitle">I focus on delivering real value through clean code, secure infrastructure, and thoughtful engineering solutions from beginning to end.</p>
        </div>

        <div className="impact-grid stagger">
          {impacts.map((item, index) => (
            <article key={index} className="impact-card">
              <div className="impact-card__icon">{item.icon}</div>
              <h3 className="impact-card__title">{item.title}</h3>
              <p className="impact-card__desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
