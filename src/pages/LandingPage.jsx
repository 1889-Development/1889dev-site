import React, { useEffect, useState } from 'react';
import { Github, ArrowRight, Wrench, Zap, Target, RefreshCw, Rocket, Server, Code, Shield, Mail, MapPin, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../data/mock';
import ContactForm from '../components/ContactForm';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const processIcons = {
    Discover: Target,
    Design: Wrench,
    Build: Zap,
    Refine: RefreshCw,
    Ship: Rocket
  };

  const serviceIcons = {
    Server: Server,
    Wrench: Wrench,
    Code: Code,
    Shield: Shield
  };

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'});
  };

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-header header-minimized' : ''
      }`} data-testid="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="logo-container">
            <img 
              src={mockData.hero.logo} 
              alt="1889 Development Logo" 
              className={`logo-image ${scrolled ? 'logo-minimized' : ''}`}
            />
            <div className={`logo-brand ${scrolled ? 'brand-minimized' : ''}`}>
              <span className="brand-name">1889</span>
              <span className="brand-tagline">Development</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="nav-link" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Services</a>
            <a href="#why" className="nav-link" onClick={(e) => {e.preventDefault(); handleNavClick('why')}}>Philosophy</a>
            <a href="#project" className="nav-link" onClick={(e) => {e.preventDefault(); handleNavClick('project')}}>Work</a>
            <a href="#contact" className="nav-link" onClick={(e) => {e.preventDefault(); handleNavClick('contact')}}>Contact</a>
            <a href={mockData.founder.github} target="_blank" rel="noopener noreferrer" className="nav-icon">
              <Github className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-menu md:hidden">
            <nav className="mobile-nav">
              <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Services</a>
              <a href="#why" onClick={(e) => {e.preventDefault(); handleNavClick('why')}}>Philosophy</a>
              <a href="#project" onClick={(e) => {e.preventDefault(); handleNavClick('project')}}>Work</a>
              <a href="#contact" onClick={(e) => {e.preventDefault(); handleNavClick('contact')}}>Contact</a>
              <a href={mockData.founder.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={mockData.hero.backgroundImage} alt="" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            {mockData.hero.title}
          </h1>
          <p className="hero-subtitle animate-fade-in-delay">
            {mockData.hero.subtitle}
          </p>
          <div className="hero-cta animate-fade-in-delay-2">
            <Button 
              size="lg" 
              className="cta-button"
              onClick={scrollToContact}
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="services-section section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center reveal-on-scroll">What We Build</h2>
          <div className="services-grid">
            {mockData.services.map((service, index) => {
              const Icon = serviceIcons[service.icon];
              return (
                <Card key={index} className="service-card glass-card reveal-on-scroll" style={{animationDelay: `${index * 0.1}s`}} data-testid={`service-card-${index}`}>
                  <div className="service-icon-container">
                    <Icon className="service-icon" />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="service-feature-item">
                        <div className="feature-dot"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why 1889 Section */}
      <section id="why" className="why-section section-padding">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="section-title reveal-on-scroll">{mockData.why1889.title}</h2>
          <div className="why-content">
            {mockData.why1889.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="why-paragraph reveal-on-scroll" style={{animationDelay: `${index * 0.15}s`}}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Current Project Section */}
      <section id="project" className="project-section section-padding">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title">Current Project</h2>
            <Badge className="status-badge">{mockData.currentProject.status}</Badge>
          </div>
          
          <Card className="project-card glass-card reveal-on-scroll">
            <div className="project-grid">
              <div className="project-image-container">
                <img 
                  src={mockData.currentProject.image} 
                  alt={mockData.currentProject.name}
                  className="project-image"
                />
                <div className="project-image-overlay"></div>
              </div>
              
              <div className="project-details">
                <h3 className="project-name">{mockData.currentProject.name}</h3>
                <p className="project-tagline">{mockData.currentProject.tagline}</p>
                <p className="project-description">{mockData.currentProject.description}</p>
                
                <div className="project-vision">
                  <h4 className="vision-title">Vision</h4>
                  <p className="vision-text">{mockData.currentProject.vision}</p>
                </div>
                
                <div className="project-features">
                  {mockData.currentProject.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-dot"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="process-section section-padding">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title text-center mb-16 reveal-on-scroll">Our Process</h2>
          <div className="process-grid">
            {mockData.process.map((item, index) => {
              const Icon = processIcons[item.step];
              return (
                <div key={index} className="process-card reveal-on-scroll" style={{animationDelay: `${index * 0.1}s`}} data-testid={`process-card-${index}`}>
                  <div className="process-icon-container">
                    <Icon className="process-icon" />
                  </div>
                  <h3 className="process-step">{item.step}</h3>
                  <p className="process-description">{item.description}</p>
                  {index < mockData.process.length - 1 && (
                    <ArrowRight className="process-arrow" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section section-padding">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="founder-card glass-card reveal-on-scroll">
            <h2 className="founder-title">{mockData.founder.title}</h2>
            <p className="founder-name">{mockData.founder.name}</p>
            <p className="founder-bio">{mockData.founder.bio}</p>
            <blockquote className="founder-quote">
              "{mockData.founder.philosophy}"
            </blockquote>
            <a 
              href={mockData.founder.github}
              target="_blank"
              rel="noopener noreferrer"
              className="founder-github"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </Card>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="contact-section section-padding">
        <div className="max-w-5xl mx-auto px-6">
          <div className="contact-header reveal-on-scroll">
            <h2 className="contact-title">{mockData.contact.cta}</h2>
            <p className="contact-description">{mockData.contact.description}</p>
            <div className="contact-info">
              <div className="info-item">
                <MapPin className="w-5 h-5" />
                <span>{mockData.contact.location}</span>
              </div>
              <div className="info-item">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${mockData.contact.email}`}>{mockData.contact.email}</a>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="max-w-7xl mx-auto px-6">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <img 
                  src={mockData.hero.logo} 
                  alt="1889 Development Logo" 
                  className="logo-image-footer"
                />
                <div className="footer-brand-text">
                  <span className="footer-brand-name">1889</span>
                  <span className="footer-brand-tagline">Development</span>
                </div>
              </div>
              <p className="footer-description">
                Infrastructure-first solutions for startups in Norfolk, VA. Building systems engineered to endure.
              </p>
              <div className="footer-social">
                <a href={mockData.contact.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub" data-testid="footer-github">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-column-title">Quick Links</h4>
              <nav className="footer-nav">
                <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Services</a>
                <a href="#why" onClick={(e) => {e.preventDefault(); handleNavClick('why')}}>Philosophy</a>
                <a href="#project" onClick={(e) => {e.preventDefault(); handleNavClick('project')}}>Work</a>
                <a href="#process" onClick={(e) => {e.preventDefault(); handleNavClick('process')}}>Process</a>
                <a href="#contact" onClick={(e) => {e.preventDefault(); handleNavClick('contact')}}>Contact</a>
              </nav>
            </div>

            {/* Services */}
            <div className="footer-column">
              <h4 className="footer-column-title">Services</h4>
              <nav className="footer-nav">
                <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>On-Site Infrastructure</a>
                <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Systems Engineering</a>
                <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Full-Stack Development</a>
                <a href="#services" onClick={(e) => {e.preventDefault(); handleNavClick('services')}}>Ongoing Management</a>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4 className="footer-column-title">Get in Touch</h4>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${mockData.contact.email}`}>{mockData.contact.email}</a>
                </div>
                <div className="footer-contact-item">
                  <MapPin className="w-4 h-4" />
                  <span>{mockData.contact.location}</span>
                </div>
              </div>
              <Button 
                className="footer-cta-button"
                onClick={scrollToContact}
                data-testid="footer-cta-button"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 1889 Development. Engineering software with intention.</p>
            <p className="footer-made-with">Crafted with precision in Norfolk, VA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
