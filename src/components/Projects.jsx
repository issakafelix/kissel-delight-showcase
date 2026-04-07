import netPulseImg from '../assets/netpulse.png';
import chatbotImg from '../assets/chatbot.png';

const Projects = () => {
  const projectList = [
    {
      title: 'NetPulse',
      img: netPulseImg,
      desc: 'An enterprise-grade network intelligence dashboard providing real-time diagnostics and node health monitoring across distributed systems.',
      features: [
        'Real-time Latency & Packet Loss tracking',
        'Network Topology Auto-discovery',
        'Hardware health & SSD integrity monitoring'
      ],
      tags: ['Python', 'Socket', 'Networking'],
      specs: [
        { label: 'Language', value: 'Python 3.x' },
        { label: 'Library', value: 'Socket / Scapy' },
        { label: 'Target', value: 'Latency & Health' }
      ],
      url: 'https://netpac.vercel.app/',
      cta: 'View Live Project'
    },
    {
      title: 'AI Network Assistant',
      img: chatbotImg,
      desc: 'Intelligent conversational interface with a "Networking Specialist" personality. Trained to troubleshoot connectivity issues and provide architectural advice.',
      features: [
        'Google Gemini AI Integration',
        'Firebase Data Isolation',
        'Network Troubleshooting Logic'
      ],
      tags: ['React', 'Gemini API', 'Firebase'],
      specs: [
        { label: 'Core', value: 'Gemini 1.5' },
        { label: 'Context', value: 'Net-Specialist' },
        { label: 'Auth', value: 'Firebase' }
      ],
      url: 'https://waketip.vercel.app/',
      cta: 'Launch AI Assistant'
    }
  ];

  return (
    <div className="section-wrapper">
      <section className="section" id="projects">
        <div className="section__header section__header--center reveal">
          <span className="section__label">Selected Projects</span>
          <h2 className="section__title">Engineering from the <br />packet to the pixel</h2>
          <p className="section__subtitle">A showcase of technical depth and infrastructural scale.</p>
        </div>

        <div className="projects__grid stagger">
          {projectList.map((project, idx) => (
            <article key={idx} className="project-card">
              <div className="project-card__image">
                <img src={project.img} alt={project.title} />
              </div>
              <div className="project-card__body">
                <div className="project-card__layout">
                  <div className="project-card__main">
                    <h3 className="project-card__title">{project.title}</h3>
                    <p className="project-card__desc">{project.desc}</p>
                    <ul className="project-card__features">
                      {project.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    <div className="project-card__tags">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="project-card__specs">
                    {project.specs.map((spec, i) => (
                      <div key={i} className="spec-item">
                        <h4>{spec.label}</h4>
                        <p>{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-card__link"
                >
                  {project.cta} <span className="arrow">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
