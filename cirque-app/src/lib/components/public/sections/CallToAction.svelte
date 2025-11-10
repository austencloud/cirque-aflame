<script lang="ts">
	import Fa from 'svelte-fa';
	import { faEnvelope, faPhone, faCalendar } from '@fortawesome/free-solid-svg-icons';
	import Section from '../ui/Section.svelte';
	import Button from '../ui/Button.svelte';
</script>

<Section id="contact" background="gradient" padding="xl">
	<div class="cta-container">
		<div class="cta-content">
			<h2 class="cta-title">
				Ready to Create an <span class="text-gradient-flame">Unforgettable</span> Event?
			</h2>
			<p class="cta-description">
				Let's bring your vision to life with world-class circus entertainment. Get a free quote and
				start planning your spectacular event today.
			</p>

			<div class="cta-actions">
				<Button variant="primary" size="lg" href="/#booking">
					<Fa icon={faCalendar} size="1.25x" />
					Book Your Event
				</Button>
				<Button variant="outline" size="lg" href="tel:2244423123">
					<Fa icon={faPhone} size="1.25x" />
					(224) 442-3123
				</Button>
			</div>

			<div class="cta-contact-methods">
				<div class="contact-method">
					<Fa icon={faPhone} size="1.25x" />
					<div>
						<div class="method-label">Call Us</div>
						<a href="tel:2244423123" class="method-value">(224) 442-3123</a>
					</div>
				</div>

				<div class="contact-method">
					<Fa icon={faEnvelope} size="1.25x" />
					<div>
						<div class="method-label">Email Us</div>
						<a href="mailto:cirqueaflame@gmail.com" class="method-value">cirqueaflame@gmail.com</a>
					</div>
				</div>
			</div>

			<p class="cta-guarantee">
				<strong>100% Satisfaction Guaranteed</strong> • Fully Insured • Professional Performers
			</p>
		</div>
	</div>
</Section>

<style>
	.cta-container {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	.cta-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-8);
	}

	.cta-title {
		font-size: var(--text-5xl);
		font-weight: var(--weight-black);
		line-height: var(--leading-tight);
		margin: 0;
		color: white;
	}

	.cta-description {
		font-size: var(--text-xl);
		line-height: var(--leading-relaxed);
		color: var(--color-gray-300);
		max-width: 700px;
		margin: 0;
	}

	.cta-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		justify-content: center;
		margin-top: var(--space-4);
	}

	.cta-contact-methods {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-8);
		justify-content: center;
		margin-top: var(--space-8);
		padding: var(--space-8);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(var(--blur-base));
	}

	.contact-method {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		color: white;
	}

	.contact-method :global(svg) {
		color: var(--color-flame-primary);
		flex-shrink: 0;
	}

	.method-label {
		font-size: var(--text-sm);
		color: var(--color-gray-400);
		margin-bottom: var(--space-1);
	}

	.method-value {
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		color: white;
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.method-value:hover {
		color: var(--color-flame-primary);
	}

	.cta-guarantee {
		font-size: var(--text-base);
		color: var(--color-gray-400);
		margin: 0;
		padding-top: var(--space-6);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cta-guarantee strong {
		color: white;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.cta-title {
			font-size: var(--text-3xl);
		}

		.cta-description {
			font-size: var(--text-lg);
		}

		.cta-actions {
			flex-direction: column;
			width: 100%;
			max-width: 300px;
		}

		.cta-contact-methods {
			flex-direction: column;
			gap: var(--space-6);
			text-align: left;
		}
	}
</style>
