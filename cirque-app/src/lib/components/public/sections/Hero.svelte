<script lang="ts">
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { faChevronDown, faFire, faShield, faStar } from '@fortawesome/free-solid-svg-icons';
	import Button from '../ui/Button.svelte';

	let heroRef: HTMLElement;
	let isVisible = $state(false);

	onMount(() => {
		// Trigger animation on mount
		setTimeout(() => {
			isVisible = true;
		}, 100);

		// Parallax scroll effect
		const handleScroll = () => {
			if (heroRef) {
				const scrollY = window.scrollY;
				const heroContent = heroRef.querySelector('.hero-content') as HTMLElement;
				const heroBackground = heroRef.querySelector('.hero-background') as HTMLElement;

				if (heroContent) {
					heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
					heroContent.style.opacity = `${1 - scrollY / 600}`;
				}

				if (heroBackground) {
					heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
				}
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function scrollToServices() {
		const servicesSection = document.getElementById('services');
		if (servicesSection) {
			servicesSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section class="hero" bind:this={heroRef}>
	<!-- Background with gradient overlay -->
	<div class="hero-background">
		<div class="hero-gradient" />
	</div>

	<!-- Content -->
	<div class="hero-content" class:visible={isVisible}>
		<div class="container">
			<div class="hero-inner">
				<!-- Headline -->
				<h1 class="hero-headline">
					<span class="headline-line-1">Ignite Your</span>
					<span class="headline-line-2 text-gradient-flame">Imagination!</span>
				</h1>

				<!-- Subheadline -->
				<p class="hero-subheadline">
					Chicago's Premier Circus Entertainment<br />
					Fully Insured Professional Performers
				</p>

				<!-- Trust Badges -->
				<div class="trust-badges">
					<div class="badge">
						<Fa icon={faShield} size="1.25x" />
						<span>Fully Insured</span>
					</div>
					<div class="badge">
						<Fa icon={faFire} size="1.25x" />
						<span>500+ Events</span>
					</div>
					<div class="badge">
						<Fa icon={faStar} size="1.25x" />
						<span>5-Star Reviews</span>
					</div>
				</div>

				<!-- CTAs -->
				<div class="hero-actions">
					<Button variant="primary" size="lg" href="/#booking">Book Your Event</Button>
					<Button variant="outline" size="lg" onclick={scrollToServices}>View Performances</Button>
				</div>
			</div>
		</div>

		<!-- Scroll Indicator -->
		<button class="scroll-indicator" onclick={scrollToServices} aria-label="Scroll to services">
			<Fa icon={faChevronDown} size="2x" />
		</button>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--color-charcoal);
	}

	/* Background */
	.hero-background {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #1a1a1a 0%, #2b2b2b 100%);
		background-attachment: fixed;
		will-change: transform;
	}

	.hero-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(10, 10, 10, 0.85) 0%,
			rgba(26, 26, 26, 0.7) 50%,
			rgba(10, 10, 10, 0.85) 100%
		);
	}

	/* Content */
	.hero-content {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: var(--space-20) 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;
	}

	.hero-content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-8);
	}

	/* Headline */
	.hero-headline {
		font-size: var(--text-6xl);
		font-weight: var(--weight-black);
		line-height: var(--leading-tight);
		letter-spacing: var(--tracking-tighter);
		margin: 0;
		color: white;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.headline-line-1 {
		opacity: 0;
		transform: translateY(20px);
		animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
	}

	.headline-line-2 {
		opacity: 0;
		transform: translateY(20px);
		animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
	}

	@keyframes slide-up {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Subheadline */
	.hero-subheadline {
		font-size: var(--text-xl);
		font-weight: var(--weight-medium);
		color: var(--color-gray-300);
		line-height: var(--leading-relaxed);
		max-width: 600px;
		margin: 0;
		opacity: 0;
		animation: fade-in 0.8s ease-out 0.6s forwards;
	}

	/* Trust Badges */
	.trust-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		justify-content: center;
		opacity: 0;
		animation: fade-in 0.8s ease-out 0.8s forwards;
	}

	.badge {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(var(--blur-base));
		border-radius: var(--radius-full);
		color: white;
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.badge :global(svg) {
		color: var(--color-flame-primary);
	}

	/* CTAs */
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		justify-content: center;
		opacity: 0;
		animation: fade-in 0.8s ease-out 1s forwards;
	}

	/* Scroll Indicator */
	.scroll-indicator {
		position: absolute;
		bottom: var(--space-8);
		left: 50%;
		transform: translateX(-50%);
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		animation: float 3s ease-in-out infinite;
		transition: color var(--transition-fast);
		padding: var(--space-2);
	}

	.scroll-indicator:hover {
		color: var(--color-flame-primary);
	}

	@keyframes float {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(10px);
		}
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			min-height: 100svh;
		}

		.hero-headline {
			font-size: var(--text-4xl);
		}

		.hero-subheadline {
			font-size: var(--text-lg);
		}

		.trust-badges {
			flex-direction: column;
			gap: var(--space-3);
		}

		.hero-actions {
			flex-direction: column;
			width: 100%;
			max-width: 300px;
		}

		.hero-actions :global(button),
		.hero-actions :global(a) {
			width: 100%;
		}
	}
</style>
