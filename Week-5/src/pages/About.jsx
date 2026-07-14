import React from 'react';
import { Target, Compass } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '40px' }} id="about-page">
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>
          About <span>EduCircuit Labs</span>
        </h1>
        <p>
          Bridging the gap between engineering theory and hands-on laboratory mastery.
        </p>
      </div>

      {/* Intro block */}
      <div className="card-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2>Who We Are</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            EduCircuit Labs provides industrial training solutions for students and educational institutes by connecting theoretical knowledge with practical implementation.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            We engineer high-performance training modules and comprehensive learning curriculum guides that allow universities, college labs, and eager self-learners to gain tangible, job-ready skills in electronics and automation.
          </p>
        </div>
        <div style={{
          backgroundColor: '#2D2A24',
          borderRadius: '12px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-headlines)' }}>
            EduCircuit <span style={{ color: 'var(--accent-cyan)' }}>Labs</span>
          </span>
        </div>
      </div>

      {/* Mission / Vision Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(165, 152, 110, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <Target size={20} />
          </div>
          <h3>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            To make engineering education highly practical, curriculum-aligned, and skill-oriented. We design systems that empower students to build, test, and troubleshoot physical circuits.
          </p>
        </div>

        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(160, 212, 224, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}>
            <Compass size={20} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <h3>Our Vision</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            To foster a new generation of skilled, industry-ready engineers by becoming the leading standard in hardware education resources across universities and student groups globally.
          </p>
        </div>
      </div>

      {/* Statistics Block */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '24px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>6+</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Training Kits</div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>20+</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Learning Modules</div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>15+</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Practical Experiments</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-indigo)', lineHeight: '1.25' }}>Beginner to Advanced</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Levels</div>
        </div>
      </div>
    </div>
  );
};

export default About;
