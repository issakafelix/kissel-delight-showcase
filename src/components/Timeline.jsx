const Timeline = () => {
  const experiences = [
    {
      role: 'Senior Software Engineer & Network Architect',
      company: 'NetPulse (SaaS Founder)',
      period: '2024 — Present',
      desc: 'Designed and built a real-time network monitoring platform from scratch. Leveraged Python sockets and React to visualize packet loss and latency across 500+ infrastructure nodes.',
      tech: ['React', 'Python', 'Cisco IOS', 'PostgreSQL']
    },
    {
      role: 'Frontend Engineer (IT Research Assistant)',
      company: 'Accra Technical University (ATU)',
      period: '2023 — 2024',
      desc: 'Led the frontend development for an academic research portal focused on cybersecurity trends and network traffic data visualization. Optimized dashboard performance by 40%.',
      tech: ['Next.js', 'TypeScript', 'D3.js']
    },
    {
      role: 'Network Infrastructure Specialist',
      company: 'Global Tech Corp',
      period: '2021 — 2023',
      desc: 'Managed complex enterprise networks, configured VPNs, and maintained server uptime. Implemented new security protocols that reduced unauthorized access attempts by 65%.',
      tech: ['Networking', 'Security', 'Cloud']
    }
  ];

  return (
    <section className="section" id="experience">
      <div className="section__header reveal">
        <span className="section__label">Professional Journey</span>
        <h2 className="section__title">My professional journey in <br />software & networking</h2>
      </div>

      <div className="timeline stagger">
        {experiences.map((exp, idx) => (
          <div key={idx} className="timeline__item">
            <div className="timeline__dot"></div>
            <h3 className="timeline__role">{exp.role}</h3>
            <p className="timeline__company">{exp.company}</p>
            <p className="timeline__period">{exp.period}</p>
            <p className="timeline__desc">{exp.desc}</p>
            <div className="timeline__tech">
              {exp.tech.map((t, i) => (
                <span key={i} className="tag tag--brand">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
