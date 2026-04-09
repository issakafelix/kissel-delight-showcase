const Skills = () => {
  const skillCategories = [
    {
      icon: '🎨',
      title: 'Frontend Development',
      status: 'Primary Focus',
      bars: 5,
      skills: [
        'Core Web: HTML5, CSS3, Modern JavaScript (ES6+)',
        'Frameworks & Libs: React, Vue.js, Tailwind CSS',
        'Responsive Design: Mobile-first, user-friendly UI/UX',
        'API Integration: RESTful APIs, Google Generative AI'
      ]
    },
    {
      icon: '📊',
      title: 'System Analysis',
      status: 'Additional Skill',
      bars: 4,
      skills: [
        'Architecture: Translating requirements into scalable technical designs',
        'Data Logic: Database fundamentals (SQL, Access), Data flows',
        'Performance Optimization: Evaluating system bottlenecks',
        'Technical Research: Deep-dive infrastructural analysis'
      ]
    },
    {
      icon: '🛡️',
      title: 'Networking & Cybersecurity',
      status: 'Personal Passion',
      bars: 4,
      skills: [
        'Daily Tools: Wireshark, Nmap, Cisco Packet Tracer & online networking resources',
        'Networking: TCP/IP, DNS, Routing, Network Diagnostics',
        'Security: Web security best practices, Penetration Testing (Kali Linux)',
        'Programming: Python, Java, C++ for backend scripting'
      ]
    }
  ];

  return (
    <section className="section" id="skills">
      <div className="section__header reveal">
        <span className="section__label">Skills & Expertise</span>
        <h2 className="section__title">Depth in Development, <br />Scale in Infrastructure</h2>
      </div>

      <div className="skills__grid stagger">
        {skillCategories.map((cat, idx) => (
          <div key={idx} className="skill-category">
            <div className="skill-category__status">
              <div className="signal-strength" data-bars={cat.bars}>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
              </div>
              <div className="status-label">Status: <span>{cat.status}</span></div>
            </div>
            
            <div className="skill-category__icon">{cat.icon}</div>
            <h3 className="skill-category__title">{cat.title}</h3>
            
            <div className="skill-category__pills">
              {cat.skills.map((skill, i) => (
                <span key={i} className="skill-pill">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
