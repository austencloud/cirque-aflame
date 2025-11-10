<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import PWAInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
	import MobileNavigation from '$lib/components/navigation/MobileNavigation.svelte';
	import DesktopSidebar from '$lib/components/navigation/DesktopSidebar.svelte';
	import { circusSyncModules, type ModuleId } from '$lib/components/navigation/types';
	import { theme } from '$lib/state/theme.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { authState, signOut } from '$lib/services/auth.svelte';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import '../app.css';

	const { children, data }: { children: Snippet; data: any } = $props();

	let showMobileMenu = $state(false);
	let showUserMenu = $state(false);
	let currentModule = $state<ModuleId>('dashboard');
	let currentSection = $state<string>('overview');

	// Desktop nav items (for header) - kept for potential use
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: 'home', color: 'flame' },
		{ href: '/events', label: 'Events', icon: 'calendar', color: 'royal' },
		{ href: '/clients', label: 'Clients', icon: 'users', color: 'cyan' },
		{ href: '/performers', label: 'Performers', icon: 'star', color: 'gold' },
		{ href: '/agents', label: 'Agents', icon: 'briefcase', color: 'purple' },
		{ href: '/contracts', label: 'Contracts', icon: 'file-text', color: 'green' },
		{ href: '/tasks', label: 'Tasks', icon: 'check-square', color: 'blue' }
	];

	// Simple mobile nav items (no sub-sections)
	const mobileNavItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: 'home', color: 'flame' },
		{ id: 'events', label: 'Events', icon: 'calendar', color: 'royal' },
		{ id: 'clients', label: 'Clients', icon: 'users', color: 'cyan' },
		{ id: 'performers', label: 'Performers', icon: 'star', color: 'gold' },
		{ id: 'agents', label: 'Agents', icon: 'briefcase', color: 'purple' },
		{ id: 'contracts', label: 'Contracts', icon: 'file-text', color: 'green' },
		{ id: 'tasks', label: 'Tasks', icon: 'check-square', color: 'blue' }
	];

	// Get current pathname - use SvelteKit's afterNavigate for proper updates
	let currentPath = $state(typeof window !== 'undefined' ? window.location.pathname : '/');

	function getIsActive(href: string) {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath?.startsWith(href);
	}

	// Update current module and section based on path
	$effect(() => {
		if (currentPath === '/') {
			currentModule = 'dashboard';
		} else if (currentPath.startsWith('/events')) {
			currentModule = 'events';
		} else if (currentPath.startsWith('/clients/active')) {
			currentModule = 'clients';
			currentSection = 'active';
		} else if (currentPath.startsWith('/clients/archived')) {
			currentModule = 'clients';
			currentSection = 'archived';
		} else if (currentPath.startsWith('/clients')) {
			currentModule = 'clients';
			currentSection = 'all-clients';  // Main page corresponds to "All Clients"
		} else if (currentPath.startsWith('/performers/skills')) {
			currentModule = 'performers';
			currentSection = 'skills';
		} else if (currentPath.startsWith('/performers')) {
			currentModule = 'performers';
			currentSection = 'roster';  // Main page corresponds to "Roster"
		} else if (currentPath.startsWith('/agents')) {
			currentModule = 'agents';
			currentSection = 'all-agents';  // Main page corresponds to "All Agents"
		} else if (currentPath.startsWith('/contracts/pending')) {
			currentModule = 'contracts';
			currentSection = 'pending';
		} else if (currentPath.startsWith('/contracts/templates')) {
			currentModule = 'contracts';
			currentSection = 'templates';
		} else if (currentPath.startsWith('/contracts')) {
			currentModule = 'contracts';
			currentSection = 'active-contracts';  // Main page corresponds to "Active"
		} else if (currentPath.startsWith('/tasks/completed')) {
			currentModule = 'tasks';
			currentSection = 'completed';
		} else if (currentPath.startsWith('/tasks')) {
			currentModule = 'tasks';
			currentSection = 'my-tasks';  // Main page corresponds to "My Tasks"
		}
	});

	// Update current path when navigation happens using SvelteKit's afterNavigate
	afterNavigate((navigation) => {
		currentPath = navigation.to?.url.pathname || '/';
		showMobileMenu = false;
	});

	// Initialize theme on mount
	$effect(() => {
		theme.init();
	});

	// Settings navigation
	function openSettings() {
		goto('/settings');
		showUserMenu = false;
	}

	// Auth handlers
	async function handleSignOut() {
		const result = await signOut();
		if (result.success) {
			goto('/login');
		}
		showUserMenu = false;
	}

	// Navigation handlers
	function handleModuleChange(moduleId: ModuleId) {
		currentModule = moduleId;
		// Navigate to the module's base route
		const moduleRoutes: Record<string, string> = {
			dashboard: '/',
			events: '/events',
			clients: '/clients',
			performers: '/performers',
			agents: '/agents',
			contracts: '/contracts',
			tasks: '/tasks',
		};
		goto(moduleRoutes[moduleId] || '/');
	}

	function handleSectionChange(sectionId: string) {
		currentSection = sectionId;

		// Navigate to the section's route based on current module and section ID
		const sectionRoutes: Record<string, Record<string, string>> = {
			dashboard: {},
			events: {},
			clients: {
				'all-clients': '/clients',  // Route to main ClientsPage
				active: '/clients/active',
				archived: '/clients/archived',
			},
			performers: {
				roster: '/performers',  // Route to main PerformersPage
				skills: '/performers/skills',
			},
			agents: {
				'all-agents': '/agents',  // Route to main AgentsPage
			},
			contracts: {
				'active-contracts': '/contracts',  // Route to main ContractsPage
				pending: '/contracts/pending',
				templates: '/contracts/templates',
			},
			tasks: {
				'my-tasks': '/tasks',  // Route to main TasksPage
				completed: '/tasks/completed',
			},
		};

		const route = sectionRoutes[currentModule]?.[sectionId];
		if (route) {
			goto(route);
		}
	}

	function closeMobileMenu() {
		showMobileMenu = false;
	}

	function handleMobileNavigate(moduleId: string) {
		currentModule = moduleId as ModuleId;
		const moduleRoutes: Record<string, string> = {
			dashboard: '/',
			events: '/events',
			clients: '/clients',
			performers: '/performers',
			agents: '/agents',
			contracts: '/contracts',
			tasks: '/tasks',
		};
		goto(moduleRoutes[moduleId] || '/');
	}

	function openSettingsModal() {
		goto('/settings');
	}
</script>

<svelte:head>
	<title>CircusSync - Production Company Management</title>
	<meta name="description" content="Manage your entertainment production company with CircusSync" />

	<!-- PWA Meta Tags -->
	<meta name="theme-color" content="#8B5CF6" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="CircusSync" />

	<!-- Icons -->
	<link rel="icon" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="mask-icon" href="/icon-512.png" color="#8B5CF6" />

	<!-- Manifest -->
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<div class="app-layout" data-component="layout">
	<div class="app-header">
		<div class="header-container">
			<div class="header-content">
				<div class="header-left">
					<div class="mobile-menu-section">
						<button
						 	class="mobile-menu-button" 
							onclick={() => (showMobileMenu = !showMobileMenu)}
							aria-label="Toggle menu"
							aria-expanded={showMobileMenu}
						>
							<span class="sr-only">Open main menu</span>
							<Icon name={showMobileMenu ? 'times' : 'bars'} extraClass="menu-icon" />
						</button>

						<a href="/" class="logo-link">
							<span class="logo-badge">CS</span>
							<span class="logo-text">CircusSync</span>
						</a>
					</div>

					<div class="desktop-nav">
						{#each navItems as item}
							<a
								href={item.href}
								class="nav-link {getIsActive(item.href) ? 'nav-link-active' : ''}"
								data-color={item.color}
								aria-current={getIsActive(item.href) ? 'page' : undefined}
							>
								<Icon
									name={item.icon}
									size={16}
									extraClass="nav-icon nav-icon-{item.color}"
								/>
								{item.label}
							</a>
						{/each}
					</div>
				</div>

				<!-- User Menu & Settings -->
				<div class="header-right">
					{#if authState.currentUser}
						<div class="user-menu-container">
							<button
								type="button"
								class="user-button"
								onclick={() => (showUserMenu = !showUserMenu)}
								aria-label="User menu"
								title="User menu"
							>
								<div class="user-avatar">
									{authState.userProfile?.displayName?.[0]?.toUpperCase() ||
										authState.currentUser?.email?.[0]?.toUpperCase() ||
										'U'}
								</div>
								<span class="user-name">
									{authState.userProfile?.displayName ||
										authState.currentUser?.email ||
										'User'}
								</span>
								<Icon name="chevron-down" size={16} />
							</button>

							{#if showUserMenu}
								<div class="user-dropdown">
									<div class="user-dropdown-header">
										<div class="user-dropdown-email">{authState.currentUser.email}</div>
										<div class="user-dropdown-role">
											{authState.userProfile?.role || 'viewer'}
										</div>
									</div>
									<div class="user-dropdown-divider"></div>
									<button type="button" class="user-dropdown-item" onclick={openSettings}>
										<Icon name="cog" size={16} />
										Settings
									</button>
									<button
										type="button"
										class="user-dropdown-item danger"
										onclick={handleSignOut}
									>
										<Icon name="log-out" size={16} />
										Sign Out
									</button>
								</div>
							{/if}
						</div>
					{:else}
						<button
							type="button"
							class="settings-button"
							onclick={openSettings}
							aria-label="Open settings"
							title="Settings"
						>
							<Icon name="cog" size={20} />
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<main class="app-main">
		{@render children()}
	</main>

	<footer class="app-footer">
		© {new Date().getFullYear()} CircusSync. All rights reserved.
	</footer>
</div>

<!-- Desktop Sidebar - 2026 Style (hidden on mobile) -->
<div class="desktop-sidebar-wrapper">
	<DesktopSidebar
		currentModule={currentModule}
		currentSection={currentSection}
		modules={circusSyncModules}
		onModuleChange={handleModuleChange}
		onSectionChange={handleSectionChange}
		onSettingsClick={openSettingsModal}
	/>
</div>

<!-- Mobile Navigation - Simple Panel -->
<MobileNavigation
	isOpen={showMobileMenu}
	currentModule={currentModule}
	navItems={mobileNavItems}
	onNavigate={handleMobileNavigate}
	onClose={closeMobileMenu}
/>

<!-- PWA Install Prompt -->
<PWAInstallPrompt />

<style>
	/* ============================================================================
	   DESKTOP SIDEBAR WRAPPER
	   ============================================================================ */
	.desktop-sidebar-wrapper {
		display: none;
	}

	@media (min-width: 1024px) {
		.desktop-sidebar-wrapper {
			display: block;
		}
	}

	/* ============================================================================
	   APP LAYOUT
	   ============================================================================ */
	.app-layout {
		min-height: 100vh;
		background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
		display: flex;
		flex-direction: column;
		transition: background-color var(--transition-base);
	}

	@media (min-width: 1024px) {
		.app-layout {
			margin-left: 280px; /* Width of sidebar */
		}
	}

	:global(.dark) .app-layout {
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
	}

	/* Header */
	.app-header {
		background: white;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 30;
		transition: background-color var(--transition-base);
	}

	/* Hide header on desktop when sidebar is visible */
	@media (min-width: 1024px) {
		.app-header {
			display: none;
		}
	}

	:global(.dark) .app-header {
		background: rgba(17, 24, 39, 0.95);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(249, 115, 22, 0.2);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.4),
			0 0 40px rgba(249, 115, 22, 0.05);
	}

	.header-container {
		max-width: none;
		margin: 0 auto;
		padding: 0 0.5rem;
	}

	@media (min-width: 640px) {
		.header-container {
			padding: 0 1rem;
		}
	}

	@media (min-width: 1024px) {
		.header-container {
			padding: 0 2rem;
		}
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		height: 4rem;
	}

	.header-left {
		display: flex;
	}

	.mobile-menu-section {
		display: flex;
		align-items: center;
	}

	/* Mobile Menu Button */
	.mobile-menu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: var(--radius-md);
		color: var(--color-gray-600);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mobile-menu-button:hover {
		color: var(--color-gray-900);
		background: var(--color-gray-100);
	}

	:global(.dark) .mobile-menu-button {
		color: var(--color-gray-300);
	}

	:global(.dark) .mobile-menu-button:hover {
		color: white;
		background: var(--color-gray-700);
	}

	.mobile-menu-button:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--color-royal-500);
	}

	@media (min-width: 1024px) {
		.mobile-menu-button {
			display: none;
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	:global(.menu-icon) {
		display: block;
		height: 1.5rem;
		width: 1.5rem;
	}

	/* Logo */
	.logo-link {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		margin-left: 0.5rem;
		text-decoration: none;
	}

	@media (min-width: 1024px) {
		.logo-link {
			margin-left: 0;
		}
	}

	.logo-badge {
		height: 2rem;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		background: var(--color-royal-600);
		color: white;
		font-weight: 700;
		font-size: 0.875rem;
		transition: all var(--transition-base);
	}

	:global(.dark) .logo-badge {
		background: linear-gradient(135deg, var(--color-flame-600), var(--color-royal-600));
		box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
	}

	.logo-text {
		margin-left: 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-gray-900);
		display: none;
		transition: color var(--transition-base);
	}

	:global(.dark) .logo-text {
		color: white;
	}

	@media (min-width: 640px) {
		.logo-text {
			display: inline;
		}
	}

	/* Desktop Navigation - Now hidden since we have sidebar on desktop */
	.desktop-nav {
		display: none;
		margin-left: 1.5rem;
		gap: 0.25rem;
	}

	/* Keeping this commented out since sidebar replaces desktop nav */
	/* @media (min-width: 1024px) {
		.desktop-nav {
			display: flex;
		}
	} */

	.nav-link {
		display: flex;
		align-items: center;
		margin: auto 0;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		color: var(--color-gray-700);
		transition: all var(--transition-fast);
	}

	:global(.dark) .nav-link {
		color: #f3f4f6;
		font-weight: 600;
	}

	.nav-link:hover {
		color: var(--color-gray-900);
		background: var(--color-gray-50);
	}

	:global(.dark) .nav-link:hover {
		color: white;
		background: rgba(249, 115, 22, 0.1);
	}

	.nav-link-active {
		background: var(--color-royal-50);
		color: var(--color-royal-700);
	}

	:global(.dark) .nav-link-active {
		background: rgba(249, 115, 22, 0.2);
		color: white;
		box-shadow: 0 0 10px rgba(249, 115, 22, 0.2);
	}

	/* Colorful Navigation Icons */
	:global(.nav-icon) {
		margin-right: 0.375rem;
		flex-shrink: 0;
		transition: all var(--transition-fast);
	}

	/* Icon Colors - Light Mode */
	:global(.nav-icon-flame) {
		color: var(--color-flame-600);
	}
	:global(.nav-icon-royal) {
		color: var(--color-royal-600);
	}
	:global(.nav-icon-cyan) {
		color: #06b6d4;
	}
	:global(.nav-icon-gold) {
		color: var(--color-gold-600);
	}
	:global(.nav-icon-purple) {
		color: #a855f7;
	}
	:global(.nav-icon-green) {
		color: #10b981;
	}
	:global(.nav-icon-blue) {
		color: #3b82f6;
	}

	/* Icon Colors - Dark Mode (brighter variants) */
	:global(.dark) :global(.nav-icon-flame) {
		color: var(--color-flame-400);
	}
	:global(.dark) :global(.nav-icon-royal) {
		color: var(--color-royal-400);
	}
	:global(.dark) :global(.nav-icon-cyan) {
		color: #22d3ee;
	}
	:global(.dark) :global(.nav-icon-gold) {
		color: var(--color-gold-400);
	}
	:global(.dark) :global(.nav-icon-purple) {
		color: #c084fc;
	}
	:global(.dark) :global(.nav-icon-green) {
		color: #34d399;
	}
	:global(.dark) :global(.nav-icon-blue) {
		color: #60a5fa;
	}

	/* Glow effect on hover */
	.nav-link:hover :global(.nav-icon-flame) {
		filter: drop-shadow(0 0 4px var(--color-flame-500));
	}
	.nav-link:hover :global(.nav-icon-royal) {
		filter: drop-shadow(0 0 4px var(--color-royal-500));
	}
	.nav-link:hover :global(.nav-icon-cyan) {
		filter: drop-shadow(0 0 4px #06b6d4);
	}
	.nav-link:hover :global(.nav-icon-gold) {
		filter: drop-shadow(0 0 4px var(--color-gold-500));
	}
	.nav-link:hover :global(.nav-icon-purple) {
		filter: drop-shadow(0 0 4px #a855f7);
	}
	.nav-link:hover :global(.nav-icon-green) {
		filter: drop-shadow(0 0 4px #10b981);
	}
	.nav-link:hover :global(.nav-icon-blue) {
		filter: drop-shadow(0 0 4px #3b82f6);
	}

	/* Header Right - User Menu */
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user-menu-container {
		position: relative;
	}

	.user-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		background: transparent;
		border: 1px solid var(--color-gray-300);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	:global(.dark) .user-button {
		border-color: rgba(255, 255, 255, 0.1);
	}

	.user-button:hover {
		background: var(--color-gray-100);
		border-color: var(--color-royal-400);
	}

	:global(.dark) .user-button:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--color-royal-400);
	}

	.user-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-royal-600), var(--color-flame-600));
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.user-name {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-700);
	}

	:global(.dark) .user-name {
		color: var(--color-gray-200);
	}

	.user-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		width: 240px;
		background: white;
		border: 1px solid var(--color-gray-200);
		border-radius: var(--radius-lg);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		z-index: 50;
	}

	:global(.dark) .user-dropdown {
		background: var(--color-gray-800);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.user-dropdown-header {
		padding: 1rem;
	}

	.user-dropdown-email {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .user-dropdown-email {
		color: white;
	}

	.user-dropdown-role {
		font-size: 0.75rem;
		color: var(--color-gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.user-dropdown-divider {
		height: 1px;
		background: var(--color-gray-200);
		margin: 0.5rem 0;
	}

	:global(.dark) .user-dropdown-divider {
		background: rgba(255, 255, 255, 0.1);
	}

	.user-dropdown-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		text-align: left;
		font-size: 0.875rem;
		color: var(--color-gray-700);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	:global(.dark) .user-dropdown-item {
		color: var(--color-gray-300);
	}

	.user-dropdown-item:hover {
		background: var(--color-gray-50);
		color: var(--color-gray-900);
	}

	:global(.dark) .user-dropdown-item:hover {
		background: rgba(255, 255, 255, 0.05);
		color: white;
	}

	.user-dropdown-item.danger {
		color: #ef4444;
	}

	.user-dropdown-item.danger:hover {
		background: rgba(239, 68, 68, 0.1);
	}

	.settings-button {
		padding: 0.5rem;
		color: var(--color-gray-600);
		background: transparent;
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.settings-button:hover {
		color: var(--color-gray-900);
		background: var(--color-gray-100);
		transform: rotate(90deg);
	}

	:global(.dark) .settings-button {
		color: var(--color-gray-300);
	}

	:global(.dark) .settings-button:hover {
		color: white;
		background: var(--color-gray-700);
		transform: rotate(90deg);
	}

	.settings-button:focus {
		outline: none;
		box-shadow:
			0 0 0 2px var(--color-royal-500),
			0 0 0 4px var(--color-gray-800);
	}

	:global(.dark) .settings-button:focus {
		box-shadow:
			0 0 0 2px var(--color-royal-500),
			0 0 0 4px var(--color-gray-800);
	}


	/* Main Content */
	.app-main {
		flex-grow: 1;
	}

	/* Footer */
	.app-footer {
		padding: 1rem 0;
		text-align: center;
		font-size: 0.75rem;
		color: var(--color-gray-500);
		transition: color var(--transition-base);
	}

	:global(.dark) .app-footer {
		color: var(--color-gray-400);
	}
</style>
