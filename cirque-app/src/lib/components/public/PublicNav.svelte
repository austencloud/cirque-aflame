<script lang="ts">
	import Fa from 'svelte-fa';
	import { faFire, faBars, faTimes, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import { navigationState, toggleMenu, closeMenu } from '$lib/state/public.svelte';

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Services', href: '/#services' },
		{ label: 'Gallery', href: '/gallery' },
		{ label: 'About', href: '/about' },
		{ label: 'Contact', href: '/#contact' }
	];

	function handleNavClick(href: string) {
		closeMenu();

		// Handle anchor links
		if (href.includes('#')) {
			const [path, hash] = href.split('#');
			if (path === '' || (path === '/' && window.location.pathname === '/')) {
				const element = document.getElementById(hash);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	}

	// Svelte 5 reactive derivation
	let isScrolled = $derived(navigationState.isScrolled);
	let isMenuOpen = $derived(navigationState.isMenuOpen);
</script>

<header class="header" class:scrolled={isScrolled}>
	<div class="container">
		<nav class="nav">
			<!-- Logo -->
			<a href="/" class="logo" on:click={() => closeMenu()}>
				<div class="logo-icon">
					<Fa icon={faFire} size="2x" />
				</div>
				<span class="logo-text">Cirque Aflame</span>
			</a>

			<!-- Desktop Navigation -->
			<ul class="nav-links desktop-only">
				{#each navItems as item}
					<li>
						<a href={item.href} class="nav-link" on:click={() => handleNavClick(item.href)}>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<!-- Contact Info & CTA -->
			<div class="nav-actions desktop-only">
				<a href="tel:2244423123" class="contact-link">
					<Fa icon={faPhone} />
					<span>(224) 442-3123</span>
				</a>
				<a href="/#booking" class="btn-primary"> Book Now </a>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="menu-toggle mobile-only"
				on:click={toggleMenu}
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
			>
				{#if isMenuOpen}
					<Fa icon={faTimes} size="lg" />
				{:else}
					<Fa icon={faBars} size="lg" />
				{/if}
			</button>
		</nav>
	</div>

	<!-- Mobile Menu Overlay -->
	{#if isMenuOpen}
		<div class="mobile-menu">
			<ul class="mobile-nav-links">
				{#each navItems as item}
					<li>
						<a href={item.href} class="mobile-nav-link" on:click={() => handleNavClick(item.href)}>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<div class="mobile-contact">
				<a href="tel:2244423123" class="mobile-contact-link">
					<Fa icon={faPhone} size="1.25x" />
					<span>(224) 442-3123</span>
				</a>
				<a href="mailto:cirqueaflame@gmail.com" class="mobile-contact-link">
					<Fa icon={faEnvelope} size="1.25x" />
					<span>cirqueaflame@gmail.com</span>
				</a>
			</div>

			<a href="/#booking" class="btn-primary-lg" on:click={() => closeMenu()}> Book Your Event </a>
		</div>
	{/if}
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: transparent;
		transition: all var(--transition-base);
	}

	.header.scrolled {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(var(--blur-base));
		box-shadow: var(--shadow-md);
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4) 0;
		transition: padding var(--transition-base);
	}

	.header.scrolled .nav {
		padding: var(--space-3) 0;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		text-decoration: none;
		transition: transform var(--transition-base);
	}

	.logo:hover {
		transform: scale(1.05);
	}

	.logo-icon {
		color: var(--color-flame-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: flame-pulse 2s ease-in-out infinite;
	}

	.logo:hover .logo-icon {
		animation: none;
		filter: drop-shadow(0 0 8px var(--color-flame-primary));
	}

	.logo-text {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
		color: var(--text-primary);
		letter-spacing: var(--tracking-tight);
	}

	/* Desktop Navigation */
	.nav-links {
		display: flex;
		list-style: none;
		gap: var(--space-8);
		margin: 0;
		padding: 0;
	}

	.nav-link {
		position: relative;
		font-size: var(--text-base);
		font-weight: var(--weight-medium);
		color: var(--text-primary);
		text-decoration: none;
		padding: var(--space-2) 0;
		transition: color var(--transition-fast);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--color-flame-primary), var(--color-flame-secondary));
		transition: width var(--transition-base);
	}

	.nav-link:hover {
		color: var(--color-flame-primary);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	/* Nav Actions */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: var(--space-6);
	}

	.contact-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--text-secondary);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.contact-link:hover {
		color: var(--color-flame-primary);
	}

	.btn-primary {
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, var(--color-flame-primary), var(--color-flame-secondary));
		color: white;
		font-weight: var(--weight-semibold);
		font-size: var(--text-base);
		border: none;
		border-radius: var(--radius-full);
		text-decoration: none;
		cursor: pointer;
		transition: all var(--transition-base);
		box-shadow: var(--shadow-md);
		position: relative;
		overflow: hidden;
	}

	.btn-primary::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--color-flame-secondary), var(--color-flame-tertiary));
		opacity: 0;
		transition: opacity var(--transition-base);
	}

	.btn-primary:hover::before {
		opacity: 1;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-flame);
	}

	/* Mobile Menu Toggle */
	.menu-toggle {
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		padding: var(--space-2);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--transition-fast);
	}

	.menu-toggle:hover {
		color: var(--color-flame-primary);
	}

	/* Mobile Menu */
	.mobile-menu {
		position: fixed;
		top: 68px;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(var(--blur-lg));
		padding: var(--space-8) var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		overflow-y: auto;
		animation: slide-down var(--transition-base);
	}

	.mobile-nav-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.mobile-nav-link {
		display: block;
		font-size: var(--text-2xl);
		font-weight: var(--weight-semibold);
		color: var(--text-primary);
		text-decoration: none;
		padding: var(--space-4);
		border-radius: var(--radius-base);
		transition: all var(--transition-fast);
	}

	.mobile-nav-link:hover {
		background: var(--bg-secondary);
		color: var(--color-flame-primary);
		transform: translateX(8px);
	}

	.mobile-contact {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-6);
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
	}

	.mobile-contact-link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--text-primary);
		text-decoration: none;
		font-weight: var(--weight-medium);
	}

	.btn-primary-lg {
		padding: var(--space-4) var(--space-8);
		background: linear-gradient(135deg, var(--color-flame-primary), var(--color-flame-secondary));
		color: white;
		font-weight: var(--weight-bold);
		font-size: var(--text-lg);
		text-align: center;
		border-radius: var(--radius-full);
		text-decoration: none;
		box-shadow: var(--shadow-lg);
	}

	/* Responsive */
	.desktop-only {
		display: none;
	}

	.mobile-only {
		display: flex;
	}

	@media (min-width: 768px) {
		.desktop-only {
			display: flex;
		}

		.mobile-only {
			display: none;
		}
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
