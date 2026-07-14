import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Layers, HeartHandshake, Award, Building, BookOpen, UserCheck, Star } from 'lucide-react';
import PulseArrow from '../components/PulseArrow';

const Home = () => {
  const images = [
    '/photos/products/arduino_board.jpg',
    '/photos/products/robotics_kit.jpg',
    '/photos/products/iot_kit.jpg',
    '/photos/products/embedded_systems.jpg',
    '/photos/products/ai_kit.jpg',
    '/photos/products/electronics_equipment.jpg'
  ];

  // Auto-playing slideshow image index
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 2500); // Cycle through images every 2.5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  const demoKits = [
    {
      id: 'arduino',
      name: 'Arduino Control Lab',
      terminalLines: [
        'Initializing hardware setup...',
        'void setup() completed successfully.',
        'Digital Pin 13 set to OUTPUT.',
        'Loop 1: Pin 13 -> HIGH (LED ON)',
        'Loop 2: Pin 13 -> LOW  (LED OFF)',
        'Loop 3: Pin 13 -> HIGH (LED ON)',
        'Loop 4: Pin 13 -> LOW  (LED OFF)',
        'Simulation finished.'
      ],
      schematic: '⚡ [MCU] Pin 13 ──► [Resistor 220Ω] ──► [LED Red] ──► [GND]'
    },
    {
      id: 'iot',
      name: 'IoT Telemetry Module',
      terminalLines: [
        'Starting Wi-Fi connection protocol...',
        'Connecting to gateway "EduLabs_AP"...',
        'Connected! Assigned IP: 192.168.1.104',
        'Initializing cloud connection socket...',
        'Sending telemetry packet to backend API...',
        'JSON: {"temp": 24.5, "humidity": 56.2}',
        'Data post response code: 200 OK',
        'Simulation finished.'
      ],
      schematic: '🌐 [ESP32 WiFi] ──► [I2C Bus] ──► [DHT22 Temp Sensor] ──► [Cloud Telemetry Dashboard]'
    },
    {
      id: 'robotics',
      name: 'Robotics Kinematics Controller',
      terminalLines: [
        'Starting ultrasonic sonar sweep...',
        'Distance read: 45cm (Path clear)',
        'Moving DC Motors forward. Speed: 180rpm',
        'Distance read: 8cm (Obstacle detected!)',
        'Executing avoidance protocol: Reverse & turn left',
        'Path clear. Resuming autonomous navigation...',
        'Simulation finished.'
      ],
      schematic: '🤖 [RoboCore] ──► [L298D Motor Shield] ──► [DC Gear Motors (L/R)] ──► [Ultrasonic HC-SR04]'
    }
  ];

  const [activeDemo, setActiveDemo] = useState(demoKits[0]);
  const [terminalOutput, setTerminalOutput] = useState([
    'System ready. Click "Run Code Simulator" to run the hardware trace.'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = (kit) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTerminalOutput(['[SYSTEM] Loading firmware flash into virtual RAM...']);
    
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < kit.terminalLines.length) {
        setTerminalOutput((prev) => [...prev, `[SERIAL] ${kit.terminalLines[lineIdx]}`]);
        lineIdx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 600);
  };

  const featureCards = [
    {
      title: 'Practical Learning',
      desc: 'Hands-on projects mapped to university labs and engineering syllabus.',
      icon: <Layers className="service-icon" />
    },
    {
      title: 'Durable Quality Kits',
      desc: 'Industrial-grade microcontrollers, durable sensors, and robust components.',
      icon: <Cpu className="service-icon" />
    },
    {
      title: 'Student Support',
      desc: 'Tangible hardware manuals, source code guides, and technical guidance.',
      icon: <HeartHandshake className="service-icon" />
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Students Trained', icon: <UserCheck size={20} /> },
    { value: '150+', label: 'Partner Colleges', icon: <Building size={20} /> },
    { value: '6+', label: 'Hardware Kits', icon: <Cpu size={20} /> },
    { value: '25+', label: 'Lab Experiments', icon: <BookOpen size={20} /> }
  ];

  const testimonials = [
    {
      quote: "EduCircuit Starter Kits completely changed our practical labs. Students learn registers and sensor protocols faster.",
      author: "Dr. Alok Mehta",
      role: "HOD Electronics Engineering",
      institution: "State Institute of Tech"
    },
    {
      quote: "The IoT Training Kit helped me build my senior project. Telemetry graphing and cloud streaming worked right out of the box.",
      author: "Sarah K.",
      role: "Electronics Student",
      institution: "Tech University"
    },
    {
      quote: "Durable components and clear bare-metal programming guides. Excellent support for academic departments.",
      author: "Prof. Robert Carter",
      role: "Faculty Lab In-charge",
      institution: "MIT School of Engineering"
    }
  ];

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById('home-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Hero Section */}
      <header className="hero-section scroll-reveal active" id="home-hero">
        <div className="hero-container container">
          {/* Hero Content Column */}
          <div className="hero-content">
            <span className="hero-badge">Welcome to EduCircuit Labs</span>
            <h1>
              Engineering Excellence Through <span>Hands-On Innovation</span>
            </h1>
            <p>
              Step out of theory and into hardware. Discover curriculum-mapped, industry-grade training kits designed for universities, academic laboratories, and self-taught engineering students.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn-primary">
                Explore Kits
                <PulseArrow style={{ marginLeft: '6px', width: '16px', height: '8px' }} />
              </Link>
              <a href="#home-features" onClick={scrollToFeatures} className="btn-secondary">
                See Why Us
              </a>
              <Link to="/contact" className="btn-secondary" style={{ border: '1px solid transparent', background: 'transparent', paddingLeft: '8px', paddingRight: '8px' }}>
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Hero Visual Column (Rotating 3D Cube) */}
          <div className="hero-visual" style={{ position: 'relative' }}>
            <div className="hero-glow-circle circle-1" />
            <div className="hero-glow-circle circle-2" />
            <div className="cube-wrapper" style={{ zIndex: 1 }}>
              <div className="cube">
                <div className="cube-face front">Arduino</div>
                <div className="cube-face back">IoT Kits</div>
                <div className="cube-face right">Robotics</div>
                <div className="cube-face left">Embedded</div>
                <div className="cube-face top">Labs</div>
                <div className="cube-face bottom">Sensors</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="container scroll-reveal" id="home-stats" aria-label="Key Performance Indicators" style={{ marginTop: '-20px' }}>
        <div className="stats-grid-card">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item-box">
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <div className="stat-numeric-value">{stat.value}</div>
              <div className="stat-description-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container scroll-reveal" id="home-features" aria-label="Key Features">
        <div className="section-header">
          <h2>
            Why Choose Our <span>Labs</span>
          </h2>
          <p>
            Providing full-spectrum laboratory support and curriculum-mapped hardware boards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {featureCards.map((feat, i) => (
            <div key={i} className="service-card">
              <div className="service-icon-box indigo-glow">
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Prototyping Sandbox Section */}
      <section className="container scroll-reveal" id="home-sandbox" aria-label="Interactive Hardware Simulator" style={{ margin: '20px auto' }}>
        <div className="section-header">
          <h2>
            Interactive <span>Hardware Workbench</span>
          </h2>
          <p>
            Flash virtual firmware schemas and monitor real-time hardware trace telemetry directly in your browser.
          </p>
        </div>

        {/* Workbench Panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          {/* Left Column: Interactive Controller list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Select Hardware Track</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Choose one of our educational lab tracks to explore how microcontrollers process telemetry and drive physical output layers.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {demoKits.map((kit) => (
                  <button
                    key={kit.id}
                    onClick={() => {
                      setActiveDemo(kit);
                      setTerminalOutput([`Loaded config: ${kit.name}. Click "Run Code Simulator" below.`]);
                    }}
                    className={`btn-secondary`}
                    style={{
                      justifyContent: 'flex-start',
                      padding: '12px 16px',
                      borderWidth: activeDemo.id === kit.id ? '2px' : '1px',
                      borderColor: activeDemo.id === kit.id ? 'var(--accent-indigo)' : 'var(--border-color)',
                      background: activeDemo.id === kit.id ? 'rgba(165, 152, 110, 0.05)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    {kit.id === 'arduino' ? '⚡ ' : kit.id === 'iot' ? '🌐 ' : '🤖 '}
                    {kit.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button Panel */}
            <button
              onClick={() => runSimulation(activeDemo)}
              disabled={isSimulating}
              className="btn-primary"
              style={{
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                opacity: isSimulating ? 0.6 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{isSimulating ? 'Simulating Trace...' : 'Run Code Simulator'}</span>
              <PulseArrow style={{ marginLeft: '4px', width: '18px', height: '9px' }} />
            </button>
          </div>

          {/* Right Column: Visualizer Output Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Visual Trace Module */}
            <div className="card-panel" style={{ background: '#2D2A24', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-ethereal-blue)', letterSpacing: '0.1em' }}>
                Hardware Schematic Routing
              </span>
              <div style={{ color: '#E8E4D9', fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-word', borderLeft: '3px solid var(--accent-indigo)', paddingLeft: '12px' }}>
                {activeDemo.schematic}
              </div>
              
              {/* Dynamic Animated LED indicator based on simulation activity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{
                  height: '8px',
                  width: '8px',
                  borderRadius: '50%',
                  backgroundColor: isSimulating ? 'var(--color-ethereal-blue)' : '#8A8374',
                  boxShadow: isSimulating ? '0 0 10px var(--color-ethereal-blue)' : 'none',
                  transition: 'all 0.3s ease'
                }} />
                <span style={{ fontSize: '0.75rem', color: '#8A8374', fontFamily: 'monospace' }}>
                  {isSimulating ? 'Trace pulse active...' : 'Hardware state: IDLE'}
                </span>
              </div>
            </div>

            {/* Serial Monitor console */}
            <div className="serial-debug-monitor">
              <div className="serial-debug-monitor-glow" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#8A8374', letterSpacing: '0.1em', marginBottom: '8px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', zIndex: 3 }}>
                🖥️ Serial Output Debug Monitor
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 3 }}>
                {terminalOutput.map((line, idx) => (
                  <div key={idx} style={{ color: line.startsWith('[SYSTEM]') ? '#A5986E' : line.startsWith('[SERIAL]') ? '#E8E4D9' : '#A0D4E0' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container scroll-reveal" id="home-testimonials" aria-label="Customer Testimonials" style={{ margin: '20px auto' }}>
        <div className="section-header">
          <h2>
            What Faculty & Students <span>Say</span>
          </h2>
          <p>
            Real feedback from instructors and student engineers working in academic labs.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card-panel">
              <div className="stars-row">
                <Star size={14} fill="var(--color-ethereal-blue)" color="var(--color-ethereal-blue)" />
                <Star size={14} fill="var(--color-ethereal-blue)" color="var(--color-ethereal-blue)" />
                <Star size={14} fill="var(--color-ethereal-blue)" color="var(--color-ethereal-blue)" />
                <Star size={14} fill="var(--color-ethereal-blue)" color="var(--color-ethereal-blue)" />
                <Star size={14} fill="var(--color-ethereal-blue)" color="var(--color-ethereal-blue)" />
              </div>
              <p className="testimonial-quote-text">"{t.quote}"</p>
              <div className="testimonial-profile">
                <div className="author-details">
                  <h4>{t.author}</h4>
                  <span>{t.role} | <strong>{t.institution}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spotlight Single Card Slideshow Section */}
      <section className="container scroll-reveal" id="home-spotlight" aria-label="Spotlight Kit Showcase" style={{ marginBottom: '40px' }}>
        <div className="section-header">
          <h2>
            Spotlight <span>Hardware Showcase</span>
          </h2>
          <p>
            An auto-playing slideshow of our primary engineering and laboratory training setups.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <article className="product-card" style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
            {/* Auto-playing Image Slideshow container */}
            <div className="card-media" style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className="transition-opacity duration-1000 ease-in-out"
                  style={{ 
                    opacity: imgIndex === idx ? 1 : 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  <img 
                    src={img} 
                    alt={`EduCircuit Setup ${idx + 1}`} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
              
              {/* Overlay with brand name on it */}
              <div 
                className="absolute bottom-0 inset-x-0 p-5" 
                style={{ 
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-ethereal-blue)', letterSpacing: '0.1em' }}>
                  EduCircuit Labs
                </span>
                <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                  Industrial Training Kits Collection
                </h3>
              </div>
            </div>

            {/* Description & Action details */}
            <div className="card-content" style={{ textAlign: 'left', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                EduCircuit Labs develops curriculum-mapped training resources to bridge the gap between engineering theory and laboratory mastery. Explore our 6 signature experimental packages:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  Arduino Kit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  IoT Training Kit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  Robotics Kit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  Embedded System Kit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  AI Learning Kit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)' }} />
                  Electronics Lab Kit
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span className="card-price" style={{ fontSize: '1.2rem' }}>Starting at ₹5000</span>
                <Link to="/catalog" className="btn-primary">
                  Explore All 6 Kits
                  <PulseArrow style={{ marginLeft: '6px', width: '16px', height: '8px' }} />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
