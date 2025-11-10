<!-- src/routes/performers/+page.svelte -->
<script lang="ts"> import { goto } from '$app/navigation';
	import { performers } from '$lib/state/performers.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import PerformerForm from '$lib/components/performers/PerformerForm.svelte';
	import type { PerformerSkillCategory } from '$lib/types';

	const { page } = $props<{ page: any }>();

	// State variables
	let loading = $state(true);

	let searchTerm = $state('');

	let skillFilter: PerformerSkillCategory | 'all' = $state('all');

	let showAddPerformerModal = $state(false);

	let showFilterPanel = $state(false);

	// All functionality is now accessible without authentication
	const canAddPerformer = true;

	// Get URL query parameters
	const urlFilter = $derived(page.url.searchParams.get('skill') || 'all');

	// Skill filter options
	const skillOptions: { value: PerformerSkillCategory | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Skills' },
		{ value: 'fire', label: 'Fire Performance' },
		{ value: 'balloon', label: 'Balloon Art' },
		{ value: 'stilt', label: 'Stilt Walking' },
		{ value: 'juggle', label: 'Juggling' },
		{ value: 'aerial', label: 'Aerial Arts' },
		{ value: 'magic', label: 'Magic' },
		{ value: 'other', label: 'Other Skills' }
	];

	// Fix: Only assign urlFilter to skillFilter if it matches PerformerSkillCategory or 'all'
	const validSkillFilters: (PerformerSkillCategory | 'all')[] = [
		'all',
		'fire',
		'balloon',
		'stilt',
		'juggle',
		'aerial',
		'magic',
		'other'
	];

	$effect(() => {
		async function loadData() {
			try {
				if (urlFilter && validSkillFilters.includes(urlFilter as PerformerSkillCategory | 'all')) {
					skillFilter = urlFilter as PerformerSkillCategory | 'all';
				}

				if (skillFilter !== 'all') {
					await performers.loadPerformersBySkill(skillFilter);
				} else {
					await performers.loadPerformers();
				}
			} catch (error) {
				console.error('Error loading performers:', error);
			} finally {
				loading = false;
			}
		}

		loadData();
	});

	// Filter performers based on search term
	const filteredPerformers = $derived(
		performers.performers.filter((performer) => {
			if (!searchTerm) {
				return true;
			}

			const search = searchTerm.toLowerCase();
			return (
				performer.name.toLowerCase().includes(search) ||
				performer.email.toLowerCase().includes(search) ||
				performer.phone.toLowerCase().includes(search) ||
				performer.skills.some(
					(skill) =>
						skill.category.toLowerCase().includes(search) ||
						skill.props.some((prop) => prop.toLowerCase().includes(search)) ||
						skill.acts.some((act) => act.toLowerCase().includes(search))
				)
			);
		})
	);

	// Sort performers alphabetically
	const sortedPerformers = $derived([...filteredPerformers].sort((a, b) => a.name.localeCompare(b.name)));

	// Handle search
	function handleSearch() {
		// Filter is done reactively, no additional action needed
	}

	// Handle filter change
	async function handleFilterChange() {
		loading = true;
		try {
			// Update URL query parameter
			goto(`/performers?skill=${skillFilter}`, { replaceState: true });

			// Load performers based on filter
			if (skillFilter !== 'all') {
				await performers.loadPerformersBySkill(skillFilter);
			} else {
				await performers.loadPerformers();
			}
		} catch (error) {
			console.error('Error filtering performers:', error);
		} finally {
			loading = false;
			showFilterPanel = false; // Close filter panel on mobile
		}
	}

	// Toggle mobile filter panel
	function toggleFilterPanel() {
		showFilterPanel = !showFilterPanel;
	}

	// Handle performer add
	async function handleAddPerformer(performerData: any) {
		try {
			const performerId = await performers.addPerformer(performerData);
			showAddPerformerModal = false;
			// Navigate to the new performer
			goto(`/performers/${performerId}`);
		} catch (error) {
			console.error('Error adding performer:', error);
		}
	}

	// Get color for skill category badge
	function getColorForSkill(
		category: string
	): 'red' | 'purple' | 'green' | 'blue' | 'amber' | 'gray' {
		switch (category) {
			case 'fire':
				return 'red';
			case 'balloon':
				return 'purple';
			case 'stilt':
				return 'green';
			case 'juggle':
				return 'blue';
			case 'aerial':
				return 'amber';
			case 'magic':
				return 'blue';
			default:
				return 'gray';
		}
	}

	// Get color for skill level badge
	function getColorForLevel(level: string): 'blue' | 'amber' | 'green' | 'gray' {
		switch (level) {
			case 'beginner':
				return 'blue';
			case 'intermediate':
				return 'amber';
			case 'expert':
				return 'green';
			default:
				return 'gray';
		}
	}

	// Format skill category for display
	function formatSkillCategory(category: string): string {
		switch (category) {
			case 'fire':
				return 'Fire Performance';
			case 'balloon':
				return 'Balloon Art';
			case 'stilt':
				return 'Stilt Walking';
			case 'juggle':
				return 'Juggling';
			case 'aerial':
				return 'Aerial Arts';
			case 'magic':
				return 'Magic';
			default:
				return 'Other';
		}
	}
</script>

<svelte:head>
	<title>Performers | CircusSync</title>
</svelte:head>

<div class="bg-white"> <div class="sm: lg:"> <div class="-col md:"> <h1 >Performers</h1> <div class="md: -col"> <!-- Filter button (mobile) --> <button type="button" class="sm: - bg-white hover:" onclick={toggleFilterPanel} > <Icon name="filter" size={18} extraClass="mr-1" /> Filter by Skill </button> {#if canAddPerformer} <Button onclick={() => (showAddPerformerModal = true)}> {#snippet children()} <Icon name="plus" size={18} extraClass="mr-1" /> Add Performer {/snippet} </Button> {/if} </div> </div> </div>
</div> <div class="sm: lg:"> <div class="-col"> <!-- Search --> <div class="sm: -1"> <form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} > <div class="-grow"> <div class="inset-y-0"> <Icon name="search" size={18} extraClass="text-gray-400" /> </div> <input type="text" bind:value={searchTerm} class="leading-5 bg-white placeholder-gray-500 focus:placeholder-gray-400 focus: sm:" placeholder="Search performers..." /> </div> <Button type="submit" variant="outline"> {#snippet children()}Search{/snippet} </Button> </form> </div> <!-- Skill filter (desktop) --> <div class="sm:"> <select bind:value={skillFilter} onchange={handleFilterChange} class="focus: sm:" > {#each skillOptions as option} <option value={option.value}>{option.label}</option> {/each} </select> </div> </div> <!-- Mobile filter panel --> {#if showFilterPanel} <div class="sm:"> <h3 >Filters</h3> <div > <label for="mobile-skill-filter" > Skill Type </label> <select id="mobile-skill-filter" bind:value={skillFilter} class="focus: sm:" > {#each skillOptions as option} <option value={option.value}>{option.label}</option> {/each} </select> </div> <div > <Button size="sm" onclick={handleFilterChange}> {#snippet children()}Apply Filters{/snippet} </Button> </div> </div> {/if} {#if loading} <div > <LoadingSpinner size="lg" /> </div> {:else if sortedPerformers.length === 0} <div class="bg-white"> <Icon name="user" size={48} extraClass="mx-auto text-gray-400 mb-4" /> <h3 >No performers found</h3> <p > {searchTerm ? `No performers matching "${searchTerm}"` : skillFilter !== 'all' ? `No performers with ${formatSkillCategory(skillFilter)} skills found` : 'You have no performers yet'} </p> {#if canAddPerformer} <Button onclick={() => (showAddPerformerModal = true)} > {#snippet children()} <Icon name="plus" size={18} extraClass="mr-1" /> Add Your First Performer {/snippet} </Button> {/if} </div> {:else} <div class="-cols-1"> {#each sortedPerformers as performer (performer.id)} <div class="bg-white overflow-"> <div class="sm:"> <div > <h3 > {performer.name} </h3> {#if performer.skills && performer.skills.length > 0} <Badge color={getColorForSkill(performer.skills[0].category)}> {#snippet children()}{formatSkillCategory(performer.skills[0].category)}{/snippet} </Badge> {/if} </div> {#if performer.email || performer.phone} <div > {#if performer.email} <div > <Icon name="mail" size={16} extraClass="flex-shrink-0 mr-1.5 text-gray-400" /> <a href="mailto:{performer.email}" > {performer.email} </a> </div> {/if} {#if performer.phone} <div > <Icon name="phone" size={16} extraClass="flex-shrink-0 mr-1.5 text-gray-400" /> <a href="tel:{performer.phone}" > {performer.phone} </a> </div> {/if} </div> {/if} </div> {#if performer.skills && performer.skills.length > 0} <div class="-t sm:"> <h4 class="tracking-wide"> Skills </h4> <div class="-wrap"> {#each performer.skills as skill} <div > <span class="{`bg-${getColorForSkill( skill.category )}-100 text-${getColorForSkill(skill.category)}-800`}" > {formatSkillCategory(skill.category)} </span> {#if skill.level} <span class="{`bg-${getColorForLevel( skill.level )}-100 text-${getColorForLevel(skill.level)}-800`}" > {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)} </span> {/if} </div> {/each} </div> </div> {/if} <div class="-t sm:"> <a href="/performers/{performer.id}" class="hover:" > View Profile <Icon name="arrow-right" size={16} extraClass="ml-1" /> </a> </div> </div> {/each} </div> {/if}
</div> <!-- Add Performer Modal -->
{#if showAddPerformerModal} <Modal title="Add New Performer" size="lg" onclose={() => (showAddPerformerModal = false)}> {#snippet children()} <PerformerForm onsubmit={handleAddPerformer} oncancel={() => (showAddPerformerModal = false)} /> {/snippet} </Modal>
{/if}
