<script lang="ts">
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import {
		faFire,
		faUser,
		faStar,
		faCircle,
		faWind,
		faHeart
	} from '@fortawesome/free-solid-svg-icons';
	import Section from '../ui/Section.svelte';
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import { services } from '$lib/data/services';

	const iconMap: Record<string, any> = {
		Flame: faFire,
		User: faUser,
		Sparkles: faStar,
		Circle: faCircle,
		Wind: faWind,
		Heart: faHeart
	};

	let servicesGrid: HTMLElement;
	let cardsVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						cardsVisible = true;
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (servicesGrid) {
			observer.observe(servicesGrid);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<Section id="services" background="gray" padding="xl">
	<!-- Section Header -->
	<div class="section-header">
		<h2 class="section-title">Our <span class="text-gradient-flame">Spectacular</span> Services</h2>
		<p class="section-description">
			From fire performers to aerialists, we bring world-class entertainment to your event. All
			performers are fully insured, professionally trained, and ready to create unforgettable
			moments.
		</p>
	</div>

	<!-- Services Grid -->
	<div class="services-grid" bind:this={servicesGrid}>
		{#each services as service, index}
			{@const icon = iconMap[service.icon]}
			<div
				class="service-card-wrapper"
				class:visible={cardsVisible}
				style="animation-delay: {index * 0.1}s;"
			>
				<Card hover glow href="/services/{service.slug}">
					<!-- Icon -->
					<div class="service-icon">
						<Fa {icon} size="2x" />
					</div>

					<!-- Content -->
					<div class="service-content">
						<h3 class="service-title">{service.title}</h3>
						<p class="service-description">{service.shortDescription}</p>

						<!-- Features -->
						<ul class="service-features">
							{#each service.features.slice(0, 3) as feature}
								<li>{feature}</li>
							{/each}
						</ul>

						<!-- Meta Info -->
						<div class="service-meta">
							<span class="service-price">{service.priceRange}</span>
							{#if service.popular}
								<span class="service-badge">Popular</span>
							{/if}
							{#if service.bookingCount}
								<span class="service-bookings">{service.bookingCount}+ bookings</span>
							{/if}
						</div>
					</div>

					<!-- CTA -->
					<div class="service-cta">
						<span class="cta-text">Learn More</span>
						<span class="cta-arrow">→</span>
					</div>
				</Card>
			</div>
		{/each}
	</div>

	<!-- View All CTA -->
	<div class="services-cta">
		<Button variant="primary" size="lg" href="/services">View All Services</Button>
	</div>
</Section>

<style>
	/* Section Header */
	.section-header {
		text-align: center;
		max-width: 800px;
		margin: 0 auto var(--space-16);
	}

	.section-title {
		font-size: var(--text-4xl);
		font-weight: var(--weight-bold);
		margin: 0 0 var(--space-6) 0;
		line-height: var(--leading-tight);
	}

	.section-description {
		font-size: var(--text-lg);
		color: var(--text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* Services Grid */
	.services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		margin-bottom: var(--space-12);
	}

	@media (min-width: 640px) {
		.services-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.services-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Service Card Wrapper - For Animation */
	.service-card-wrapper {
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.service-card-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Service Card Content */
	.service-card-wrapper :global(.card) {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.service-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, var(--color-flame-primary), var(--color-flame-secondary));
		border-radius: var(--radius-xl);
		color: white;
		transition: transform var(--transition-bounce);
	}

	.service-card-wrapper :global(.card:hover .service-icon) {
		transform: scale(1.1) rotate(5deg);
	}

	.service-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.service-title {
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
		margin: 0;
		color: var(--text-primary);
	}

	.service-description {
		font-size: var(--text-base);
		color: var(--text-secondary);
		line-height: var(--leading-relaxed);
		margin: 0;
	}

	/* Features List */
	.service-features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.service-features li {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		padding-left: var(--space-5);
		position: relative;
	}

	.service-features li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-flame-primary);
		font-weight: var(--weight-bold);
	}

	/* Meta Info */
	.service-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.service-price {
		font-size: var(--text-lg);
		font-weight: var(--weight-bold);
		color: var(--color-flame-primary);
	}

	.service-badge {
		padding: var(--space-1) var(--space-3);
		background: var(--color-flame-primary);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.service-bookings {
		font-size: var(--text-sm);
		color: var(--text-tertiary);
	}

	/* CTA */
	.service-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-gray-300);
		font-weight: var(--weight-semibold);
		color: var(--color-flame-primary);
	}

	.cta-arrow {
		transition: transform var(--transition-base);
	}

	.service-card-wrapper :global(.card:hover .cta-arrow) {
		transform: translateX(4px);
	}

	/* Services CTA */
	.services-cta {
		display: flex;
		justify-content: center;
		margin-top: var(--space-8);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-title {
			font-size: var(--text-3xl);
		}

		.section-description {
			font-size: var(--text-base);
		}
	}
</style>
