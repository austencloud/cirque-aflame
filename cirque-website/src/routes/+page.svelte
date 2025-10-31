<script lang="ts">
  import Fa from 'svelte-fa';
  import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

  const services = [
    { name: 'Fire Performers', emoji: '🔥', description: 'Mesmerizing fire spinning, eating, and LED props' },
    { name: 'Stilt Walkers', emoji: '🎪', description: 'Towering entertainers who interact with crowds' },
    { name: 'LED Dancers', emoji: '✨', description: 'Cutting-edge light shows for nighttime events' },
    { name: 'Jugglers', emoji: '🤹', description: 'Skilled performers with balls, clubs, and fire' },
    { name: 'Aerialists', emoji: '🎭', description: 'Gravity-defying performances on silks and lyra' },
    { name: 'Balloon Artists', emoji: '🎈', description: 'Expert balloon twisters for all ages' },
  ];
</script>

<svelte:head>
  <title>Cirque Aflame | Chicago's Premier Circus Entertainment</title>
  <meta name="description" content="Book professional circus entertainment in Chicago. Fire performers, stilt walkers, LED dancers, and more. Fully insured. 500+ successful events." />
</svelte:head>

<div class="page">
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <h1>
        <span class="line1">Ignite Your</span>
        <span class="line2">Imagination!</span>
      </h1>
      <p class="subtitle">Chicago's Premier Circus Entertainment • Fully Insured</p>

      <div class="badges">
        <div class="badge">🛡️ Fully Insured</div>
        <div class="badge">🎪 500+ Events</div>
        <div class="badge">⭐ 5-Star Reviews</div>
      </div>

      <div class="ctas">
        <a href="#contact" class="btn primary">Book Your Event</a>
        <a href="tel:2244423123" class="btn secondary">📞 (224) 442-3123</a>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="services" id="services">
    <div class="container">
      <h2>Our Spectacular Services</h2>
      <p class="section-desc">Professional entertainment for every occasion</p>

      <div class="services-grid">
        {#each services as service}
          <div class="service-card">
            <div class="service-icon">{service.emoji}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-value">500+</div>
          <div class="stat-label">Events Produced</div>
        </div>
        <div class="stat">
          <div class="stat-value">50+</div>
          <div class="stat-label">Professional Performers</div>
        </div>
        <div class="stat">
          <div class="stat-value">100%</div>
          <div class="stat-label">Insured & Safe</div>
        </div>
        <div class="stat">
          <div class="stat-value">4.9★</div>
          <div class="stat-label">Average Rating</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="contact" id="contact">
    <div class="container">
      <h2>Ready to Book?</h2>
      <p class="section-desc">Let's create an unforgettable event together</p>

      <div class="contact-methods">
        <a href="tel:2244423123" class="contact-card">
          <Fa icon={faPhone} size="2x" />
          <div>
            <div class="label">Call Us</div>
            <div class="value">(224) 442-3123</div>
          </div>
        </a>
        <a href="mailto:cirqueaflame@gmail.com" class="contact-card">
          <Fa icon={faEnvelope} size="2x" />
          <div>
            <div class="label">Email Us</div>
            <div class="value">cirqueaflame@gmail.com</div>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>&copy; 2025 Cirque Aflame. All rights reserved. Fully insured and bonded.</p>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .page {
    background: #0a0a0a;
    color: white;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, #1a1a1a 0%, #2b2b2b 100%);
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  }

  h1 {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .line1 {
    color: white;
  }

  .line2 {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    color: #999;
    margin: 1.5rem 0;
  }

  .badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 2rem 0;
  }

  .badge {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.95rem;
    font-weight: 600;
  }

  .ctas {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 3rem;
  }

  .btn {
    padding: 1rem 2rem;
    border-radius: 100px;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.3s;
    display: inline-block;
  }

  .btn.primary {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
  }

  .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(255, 107, 53, 0.6);
  }

  .btn.secondary {
    background: transparent;
    color: white;
    border: 2px solid #ff6b35;
  }

  .btn.secondary:hover {
    background: rgba(255, 107, 53, 0.1);
  }

  /* Services */
  .services {
    padding: 6rem 0;
    background: #111;
  }

  h2 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    text-align: center;
    margin: 0 0 1rem 0;
  }

  .section-desc {
    text-align: center;
    font-size: 1.25rem;
    color: #999;
    margin-bottom: 4rem;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .service-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 2.5rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s;
  }

  .service-card:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 40px rgba(255, 107, 53, 0.2);
  }

  .service-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .service-card h3 {
    font-size: 1.5rem;
    margin: 0 0 0.75rem 0;
  }

  .service-card p {
    color: #aaa;
    line-height: 1.6;
    margin: 0;
  }

  /* Stats */
  .stats {
    padding: 6rem 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .stat {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-value {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #999;
    font-size: 1rem;
  }

  /* Contact */
  .contact {
    padding: 6rem 0;
    background: #0a0a0a;
  }

  .contact-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .contact-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-decoration: none;
    color: white;
    transition: all 0.3s;
  }

  .contact-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-4px);
  }

  .contact-card :global(svg) {
    color: #ff6b35;
    flex-shrink: 0;
  }

  .label {
    font-size: 0.875rem;
    color: #999;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 700;
  }

  /* Footer */
  footer {
    padding: 2rem 0;
    background: #000;
    text-align: center;
    color: #666;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .ctas {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn {
      width: 100%;
    }
  }
</style>
