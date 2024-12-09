import React, { useEffect, useState } from "react";
import { Container, Header, Icon, Image, Statistic } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../common/CustomButton";
import { IMAGES } from "../../config/images";
import { BUTTONS } from "../../config/buttons";
import "./IntroPage.css";
import Spline from "@splinetool/react-spline";
import AuthModal from "../auth/AuthModal";

const IntroPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    // Thêm animation cho các elements khi scroll
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll(".animate-on-scroll").forEach((elem) => {
      observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    const animateCounter = (counter, target) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        counter.textContent =
          Math.floor(current) + (target > 1000 ? "K+" : "%");
        if (current >= target) {
          counter.textContent = target + (target > 1000 ? "K+" : "%");
          clearInterval(timer);
        }
      }, 10);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.textContent);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Thêm observer cho footer
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.1, // Hiển thị khi 10% footer xuất hiện
        rootMargin: "50px", // Trigger sớm hơn một chút
      }
    );

    // Observe footer
    const footer = document.querySelector(".footer-section");
    if (footer) {
      footerObserver.observe(footer);
    }

    return () => footerObserver.disconnect();
  }, []);

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  const handleVerifySuccess = () => {
    setAuthMode("login");
  };

  return (
    <div className="intro-page">
      {/* Particle Background */}
      <div className="particles"></div>

      {/* Navigation */}
      <div className="nav-buttons animate-on-scroll">
        <CustomButton
          {...BUTTONS.AUTH.LOGIN}
          onClick={() => handleOpenAuth("login")}
        />
        <CustomButton
          {...BUTTONS.AUTH.REGISTER}
          onClick={() => handleOpenAuth("register")}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="dots-background"></div>
        <div className="floating-elements">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
        <Container text>
          <div className="hero-content animate-on-scroll">
            <Header as="h1" className="hero-title">
              Intelligent Drive
              <div className="glowing-line"></div>
              <Header.Subheader>
                Smart storage platform for the future
              </Header.Subheader>
            </Header>
            <CustomButton
              {...BUTTONS.INTRO.EXPLORE}
              onClick={() => {
                document.querySelector(".features-section").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            />
          </div>
        </Container>
        <div className="decorative-line" style={{ top: "20%", left: "5%" }} />
        <div
          className="decorative-line"
          style={{ bottom: "30%", right: "10%" }}
        />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Header
            as="h2"
            textAlign="center"
            className="section-title animate-on-scroll"
          >
            Key Features
            <div className="underline"></div>
          </Header>
          <div className="features-grid">
            <div className="feature-item animate-on-scroll">
              <div className="icon-wrapper">
                <Icon name="shield" size="huge" className="feature-icon" />
                <div className="icon-glow"></div>
              </div>
              <h3>Optimal Security</h3>
              <p>
                End-to-end encryption, multi-factor authentication and 24/7 data
                protection
              </p>
            </div>
            <div
              className="feature-item animate-on-scroll"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="icon-wrapper">
                <Icon name="sync" size="huge" />
              </div>
              <h3>Smart Sync</h3>
              <p>Automatic sync across all devices, access anytime anywhere</p>
            </div>
            <div
              className="feature-item animate-on-scroll"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="icon-wrapper">
                <Icon name="search" size="huge" />
              </div>
              <h3>AI Search</h3>
              <p>AI technology helps search and classify files intelligently</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Media Storage Section */}
      <section className="media-storage-section">
        <Container>
          <Header
            as="h2"
            textAlign="center"
            className="section-title animate-on-scroll"
          >
            Smart Media Storage
            <div className="underline"></div>
          </Header>
          <div className="media-grid">
            <div className="media-content animate-on-scroll">
              <div className="media-features">
                <div className="media-feature-item">
                  <Icon name="image outline" size="large" />
                  <div className="feature-details">
                    <h3>Image Storage</h3>
                    <ul>
                      <li>Support all image formats</li>
                      <li>Auto image optimization</li>
                      <li>Smart image categorization</li>
                      <li>Face recognition</li>
                      <li>Advanced image search</li>
                    </ul>
                  </div>
                </div>
                <div className="media-feature-item">
                  <Icon name="video camera" size="large" />
                  <div className="feature-details">
                    <h3>Video Storage</h3>
                    <ul>
                      <li>4K video support</li>
                      <li>Auto video compression</li>
                      <li>Scene detection</li>
                      <li>Subtitle generation</li>
                      <li>Video thumbnails</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="media-stats animate-on-scroll">
              <div className="media-stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">File Formats</div>
                <div className="stat-description">
                  Support all popular formats including RAW, PSD, AI, and more
                </div>
              </div>
              <div className="media-stat-item">
                <div className="stat-number">10GB</div>
                <div className="stat-label">Free Storage</div>
                <div className="stat-description">
                  Start with 10GB free, expandable up to 2TB with premium plans
                </div>
              </div>
              <div className="media-stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Accuracy</div>
                <div className="stat-description">
                  High precision AI-powered file recognition and categorization
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <Container>
          <div className="showcase-content animate-on-scroll">
            <Header as="h2" className="showcase-title">
              Experience Smart Storage
              <div className="title-underline"></div>
            </Header>
            <p>
              Modern user interface, easy to use with smart features powered by
              AI
            </p>
            <CustomButton
              {...BUTTONS.INTRO.TRY_FREE}
              onClick={() => handleOpenAuth("register")}
            />
          </div>
          <div className="showcase-features animate-on-scroll">
            <div className="showcase-grid">
              <div className="showcase-item">
                <div className="showcase-icon">
                  <Icon name="cloud upload" size="huge" />
                </div>
                <h3>Smart Upload</h3>
                <p>Drag & drop anywhere, auto-organize files</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-icon">
                  <Icon name="share square" size="huge" />
                </div>
                <h3>Easy Sharing</h3>
                <p>Share files and folders with custom permissions</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-icon">
                  <Icon name="sync alternate" size="huge" />
                </div>
                <h3>Real-time Sync</h3>
                <p>Changes sync instantly across all devices</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-icon">
                  <Icon name="shield alternate" size="huge" />
                </div>
                <h3>Secure Storage</h3>
                <p>End-to-end encryption for all your data</p>
              </div>
            </div>
            <div className="showcase-stats">
              <div className="stat-box">
                <div className="stat-icon">
                  <Icon name="users" size="large" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">50K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">
                  <Icon name="file" size="large" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">1M+</div>
                  <div className="stat-label">Files Stored</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">
                  <Icon name="server" size="large" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <Container>
          <Header
            as="h2"
            textAlign="center"
            className="section-title animate-on-scroll"
          >
            Explore Storage Space
            <div className="underline"></div>
          </Header>
          <div className="gallery-grid">
            {IMAGES.GALLERY.map((item, index) => (
              <div
                key={`gallery-item-${index}`}
                className="gallery-item animate-on-scroll"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="image-wrapper">
                  <Image src={item.src} alt={item.caption} />
                  <div className="image-overlay"></div>
                  <span className="quality-badge">{item.quality}</span>
                  <div className="image-content">
                    <p className="image-caption">{item.caption}</p>
                    <p className="image-description">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <Container>
          <Header
            as="h2"
            textAlign="center"
            className="section-title animate-on-scroll"
          >
            Choose Your Plan
            <div className="underline"></div>
          </Header>
          <div className="pricing-grid">
            <div className="pricing-card animate-on-scroll">
              <div className="pricing-header">
                <h3>Basic</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">0</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="features-list">
                <li>
                  <Icon name="check" /> 10GB Storage
                </li>
                <li>
                  <Icon name="check" /> Basic AI Features
                </li>
                <li>
                  <Icon name="check" /> 2 Users
                </li>
                <li>
                  <Icon name="check" /> Email Support
                </li>
              </ul>
              <CustomButton
                text="Get Started"
                variant="secondary"
                onClick={() => handleOpenAuth("register")}
              />
            </div>

            <div className="pricing-card premium animate-on-scroll">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Premium</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">9</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="features-list">
                <li>
                  <Icon name="check" /> 100GB Storage
                </li>
                <li>
                  <Icon name="check" /> Advanced AI Features
                </li>
                <li>
                  <Icon name="check" /> 5 Users
                </li>
                <li>
                  <Icon name="check" /> Priority Support
                </li>
                <li>
                  <Icon name="check" /> Custom Integration
                </li>
              </ul>
              <CustomButton
                text="Try Premium"
                variant="primary"
                size="large"
                onClick={() => handleOpenAuth("register")}
              />
            </div>

            <div className="pricing-card animate-on-scroll">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">29</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="features-list">
                <li>
                  <Icon name="check" /> 1TB Storage
                </li>
                <li>
                  <Icon name="check" /> Full AI Suite
                </li>
                <li>
                  <Icon name="check" /> Unlimited Users
                </li>
                <li>
                  <Icon name="check" /> 24/7 Support
                </li>
                <li>
                  <Icon name="check" /> API Access
                </li>
              </ul>
              <CustomButton
                text="Contact Sales"
                variant="secondary"
                onClick={() =>
                  (window.location.href = "mailto:sales@example.com")
                }
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <Container>
          <div className="footer-content">
            <div className="footer-left">
              <p>© 2024 GitHub, Inc.</p>
              <div className="footer-links">
                <a href="#">Terms</a>
                <a href="#">Privacy (Updated 02/2024)</a>
                <a href="#">Sitemap</a>
                <a href="#">What is Git?</a>
                <a href="#">Manage cookies</a>
                <a href="#">Do not share my personal information</a>
              </div>
            </div>
            <div className="footer-social">
              <Icon name="github" size="large" />
              <Icon name="twitter" size="large" />
              <Icon name="facebook" size="large" />
              <Icon name="linkedin" size="large" />
              <Icon name="youtube" size="large" />
              <Icon name="twitch" size="large" />
              <Icon name="tiktok" size="large" />
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default IntroPage;
