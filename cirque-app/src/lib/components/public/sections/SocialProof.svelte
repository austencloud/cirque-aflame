<script lang="ts">
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import {
		faCalendar,
		faUsers,
		faShield,
		faStar,
		faQuoteLeft
	} from '@fortawesome/free-solid-svg-icons';
	import Section from '../ui/Section.svelte';
	import { statsState, markStatsAsAnimated } from '$lib/state/public.svelte';

	const iconMap: Record<string, any> = {
		Calendar: faCalendar,
		Users: faUsers,
		Shield: faShield,
		Star: faStar
	};

	let statsRef: HTMLElement;
	let animatedStats = $state<Record<string, number>>({});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !statsState.hasAnimated) {
						animateStats();
						markStatsAsAnimated();
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (statsRef) {
			observer.observe(statsRef);
		}

		return () => {
			observer.disconnect();
		};
	});

	function animateStats() {
		statsState.stats.forEach((stat) => {
			animateValue(stat.label, 0, stat.value, 2000);
		});
	}

	function animateValue(key: string, start: number, end: number, duration: number) {
		const startTime = performance.now();

		function update(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function for smooth animation
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			const current = start + (end - start) * easeOutQuart;

			animatedStats[key] = current;

			if (progress < 1) {
				requestAnimationFrame(update);
			} else {
				animatedStats[key] = end;
			}
		}

		requestAnimationFrame(update);
	}

	function formatValue(stat: any): string {
		const value = animatedStats[stat.label] || 0;
		const displayValue = stat.label.includes('Rating') ? value.toFixed(1) : Math.floor(value);
		return `${stat.prefix || ''}${displayValue}${stat.suffix || ''}`;
	}

	// Sample testimonials
	const testimonials = [
		{
			id: '1',
			clientName: 'Sarah Johnson',
			eventType: 'Corporate Event',
			quote:
				'Cirque Aflame transformed our company gala into an unforgettable experience. The fire performers were absolutely mesmerizing!',
			rating: 5
		},
		{
			id: '2',
			clientName: 'Michael Chen',
			eventType: 'Wedding',
			quote:
				'Our wedding guests are still talking about the stilt walkers months later. Professional, punctual, and absolutely magical.',
			rating: 5
		},
		{
			id: '3',
			clientName: 'Emily Rodriguez',
			eventType: 'Festival',
			quote:
				'Working with Cirque Aflame was seamless from start to finish. Their LED dancers brought our nighttime festival to life!',
			rating: 5
		}
	];
</script>

<Section background="dark" padding="xl">
	<!-- Stats Counter -->
	<div class="stats-container" bind:this={statsRef}>
		<div class="stats-grid">
			{#each statsState.stats as stat}
				{@const icon = iconMap[stat.icon || '']}
				<div class="stat-card">
					{#if icon}
						<div class="stat-icon">
							<Fa {icon} size="2x" />
						</div>
					{/if}
					<div class="stat-value">{formatValue(stat)}</div>
					<div class="stat-label">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Testimonials -->
	<div class="testimonials-section">
		<h2 class="section-title">What Our <span class="text-gradient-flame">Clients</span> Say</h2>

		<div class="testimonials-grid">
			{#each testimonials as testimonial}
				<div class="testimonial-card">
					<div class="quote-icon">
						<Fa icon={faQuoteLeft} size="2x" />
					</div>

					<div class="testimonial-content">
						<p class="testimonial-quote">{testimonial.quote}</p>

						<div class="testimonial-rating">
							{#each Array(testimonial.rating) as _}
								<Fa icon={faStar} />
							{/each}
						</div>

						<div class="testimonial-author">
							<div class="author-name">{testimonial.clientName}</div>
							<div class="author-event">{testimonial.eventType}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	/* Stats Container */
	.stats-container {
		margin-bottom: var(--space-20);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat-card {
		text-align: center;
		padding: var(--space-8);
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-xl);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(var(--blur-base));
		transition: all var(--transition-base);
	}

	.stat-card:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.1);
	}

	.stat-icon {
		color: var(--color-flame-primary);
		margin-bottom: var(--space-4);
		display: flex;
		justify-content: center;
	}

	.stat-value {
		font-size: var(--text-5xl);
		font-weight: var(--weight-black);
		color: white;
		margin-bottom: var(--space-2);
		line-height: 1;
	}

	.stat-label {
		font-size: var(--text-base);
		color: var(--color-gray-400);
		font-weight: var(--weight-medium);
	}

	/* Testimonials */
	.testimonials-section {
		margin-top: var(--space-20);
	}

	.section-title {
		font-size: var(--text-4xl);
		font-weight: var(--weight-bold);
		text-align: center;
		margin: 0 0 var(--space-16) 0;
		color: white;
	}

	.testimonials-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 768px) {
		.testimonials-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.testimonial-card {
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(var(--blur-base));
		position: relative;
		transition: all var(--transition-base);
	}

	.testimonial-card:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.1);
	}

	.quote-icon {
		color: var(--color-flame-primary);
		opacity: 0.3;
		margin-bottom: var(--space-4);
	}

	.testimonial-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.testimonial-quote {
		font-size: var(--text-base);
		line-height: var(--leading-relaxed);
		color: var(--color-gray-300);
		margin: 0;
		font-style: italic;
	}

	.testimonial-rating {
		display: flex;
		gap: var(--space-1);
		color: var(--color-gold);
	}

	.testimonial-author {
		padding-top: var(--space-4);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.author-name {
		font-weight: var(--weight-semibold);
		color: white;
		margin-bottom: var(--space-1);
	}

	.author-event {
		font-size: var(--text-sm);
		color: var(--color-gray-400);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-title {
			font-size: var(--text-3xl);
		}

		.stat-value {
			font-size: var(--text-4xl);
		}
	}
</style>
