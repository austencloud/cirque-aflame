<script lang="ts">
	import Fa from 'svelte-fa';
	import { faFire, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
	import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ label: 'Services', href: '/#services' },
		{ label: 'Gallery', href: '/gallery' },
		{ label: 'About Us', href: '/about' },
		{ label: 'Book Now', href: '/#booking' }
	];

	const services = [
		{ label: 'Fire Performers', href: '/services/fire-performers' },
		{ label: 'Stilt Walkers', href: '/services/stilt-walkers' },
		{ label: 'LED Dancers', href: '/services/led-dancers' },
		{ label: 'Aerialists', href: '/services/aerialists' }
	];

	const legal = [
		{ label: 'Privacy Policy', href: '/privacy' },
		{ label: 'Terms of Service', href: '/terms' },
		{ label: 'Insurance & Safety', href: '/safety' }
	];
</script>

<footer class="footer">
	<div class="footer-main">
		<div class="container">
			<div class="footer-grid">
				<!-- Brand Column -->
				<div class="footer-column brand-column">
					<div class="footer-logo">
						<Fa icon={faFire} size="2x" />
						<span>Cirque Aflame</span>
					</div>
					<p class="footer-tagline">
						Chicago's premier circus entertainment company. Bringing spectacular performances to
						events since 2010.
					</p>
					<div class="social-links">
						<a href="https://facebook.com/cirqueaflame" class="social-link" aria-label="Facebook">
							<Fa icon={faFacebook} size="1.25x" />
						</a>
						<a href="https://instagram.com/cirqueaflame" class="social-link" aria-label="Instagram">
							<Fa icon={faInstagram} size="1.25x" />
						</a>
						<a href="https://twitter.com/cirqueaflame" class="social-link" aria-label="Twitter">
							<Fa icon={faTwitter} size="1.25x" />
						</a>
					</div>
				</div>

				<!-- Quick Links -->
				<div class="footer-column">
					<h3 class="footer-heading">Quick Links</h3>
					<ul class="footer-links">
						{#each quickLinks as link}
							<li>
								<a href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Services -->
				<div class="footer-column">
					<h3 class="footer-heading">Services</h3>
					<ul class="footer-links">
						{#each services as link}
							<li>
								<a href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Contact -->
				<div class="footer-column">
					<h3 class="footer-heading">Contact Us</h3>
					<ul class="footer-contact">
						<li>
							<Fa icon={faPhone} />
							<a href="tel:2244423123">(224) 442-3123</a>
						</li>
						<li>
							<Fa icon={faEnvelope} />
							<a href="mailto:cirqueaflame@gmail.com">cirqueaflame@gmail.com</a>
						</li>
						<li>
							<Fa icon={faMapMarkerAlt} />
							<span>Chicagoland Area, IL</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="footer-bottom">
		<div class="container">
			<div class="footer-bottom-content">
				<p class="copyright">
					&copy; {currentYear} Cirque Aflame. All rights reserved. Fully insured and bonded.
				</p>
				<ul class="legal-links">
					{#each legal as link}
						<li>
							<a href={link.href}>{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-charcoal);
		color: var(--color-gray-300);
	}

	.footer-main {
		padding: var(--space-16) 0 var(--space-12);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-12);
	}

	@media (min-width: 640px) {
		.footer-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.footer-grid {
			grid-template-columns: 2fr 1fr 1fr 1.5fr;
		}
	}

	.footer-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Brand Column */
	.brand-column {
		gap: var(--space-6);
	}

	.footer-logo {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--color-flame-primary);
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
	}

	.footer-tagline {
		color: var(--color-gray-400);
		line-height: var(--leading-relaxed);
		max-width: 350px;
		margin: 0;
	}

	.social-links {
		display: flex;
		gap: var(--space-3);
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--color-gray-800);
		border-radius: var(--radius-full);
		color: var(--color-gray-300);
		text-decoration: none;
		transition: all var(--transition-base);
	}

	.social-link:hover {
		background: var(--color-flame-primary);
		color: white;
		transform: translateY(-2px);
	}

	/* Headings */
	.footer-heading {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		color: white;
		margin: 0 0 var(--space-4) 0;
	}

	/* Links */
	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.footer-links a {
		color: var(--color-gray-400);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer-links a:hover {
		color: var(--color-flame-primary);
	}

	/* Contact */
	.footer-contact {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.footer-contact li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		color: var(--color-gray-400);
	}

	.footer-contact a {
		color: var(--color-gray-400);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer-contact a:hover {
		color: var(--color-flame-primary);
	}

	/* Footer Bottom */
	.footer-bottom {
		border-top: 1px solid var(--color-gray-800);
		padding: var(--space-6) 0;
	}

	.footer-bottom-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: center;
		text-align: center;
	}

	@media (min-width: 768px) {
		.footer-bottom-content {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.copyright {
		color: var(--color-gray-500);
		font-size: var(--text-sm);
		margin: 0;
	}

	.legal-links {
		display: flex;
		gap: var(--space-6);
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.legal-links a {
		color: var(--color-gray-500);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.legal-links a:hover {
		color: var(--color-flame-primary);
	}
</style>
