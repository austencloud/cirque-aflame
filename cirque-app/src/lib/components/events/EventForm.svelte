<script lang="ts">
	import { format } from 'date-fns';
	import { clients } from '$lib/state/clients.svelte';
	import { performers } from '$lib/state/performers.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Client, Event, Performer } from '$lib/types';
	
	// Import section components
	import BasicInfoSection from './sections/BasicInfoSection.svelte';
	import PerformanceDetailsSection from './sections/PerformanceDetailsSection.svelte';
	import ServicesSection from './sections/ServicesSection.svelte';
	import EquipmentSection from './sections/EquipmentSection.svelte';
	import PerformersSection from './sections/PerformersSection.svelte';
	import ContractSection from './sections/ContractSection.svelte';
	import PaymentSection from './sections/PaymentSection.svelte';
	import NotesSection from './sections/NotesSection.svelte';
	import ManagementSection from './sections/ManagementSection.svelte';

	interface Props {
		event?: Event | null;
		submitLabel?: string;
		isLoading?: boolean;
		showCancelButton?: boolean;
		preselectedClientId?: string | null;
		preselectedPerformerId?: string | null;
		onsubmit?: (data: Partial<Event>) => void;
		oncancel?: () => void;
	}

	const {
		event = null,
		submitLabel = 'Create Event',
		isLoading = false,
		showCancelButton = true,
		preselectedClientId = null,
		preselectedPerformerId = null,
		onsubmit,
		oncancel
	}: Props = $props();

	// Form state initialization - Make reactive with $state
	let formData = $state({
		name: event?.name || '',
		date: event?.date ? format(new Date(event.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
		client: event?.client || preselectedClientId || '',
		location: {
			address: event?.location?.address || '',
			notes: event?.location?.notes || '',
			mapLink: event?.location?.mapLink || ''
		},
		status: event?.status || 'inquiry',
		performers: event?.performers || [],
		services: event?.services || [],
		performanceTime: {
			start: event?.performanceTime?.start || '18:00',
			end: event?.performanceTime?.end || '20:00'
		},
		callTime: event?.callTime || '17:00',
		costume: event?.costume || '',
		equipmentNeeded: event?.equipmentNeeded || [],
		contract: {
			sent: event?.contract?.sent || false,
			sentDate: event?.contract?.sentDate || null,
			received: event?.contract?.received || false,
			receivedDate: event?.contract?.receivedDate || null,
			url: event?.contract?.url || ''
		},
		deposit: {
			required: event?.deposit?.required || false,
			amount: event?.deposit?.amount || 0,
			received: event?.deposit?.received || false,
			receivedDate: event?.deposit?.receivedDate || null
		},
		payment: {
			totalValue: event?.payment?.totalValue || 0,
			paid: event?.payment?.paid || false,
			paidDate: event?.payment?.paidDate || null,
			method: event?.payment?.method || ''
		},
		notes: event?.notes || '',
		clientLiaison: event?.clientLiaison || '',
		gigManager: event?.gigManager || ''
	});

	// Form references and selects
	let clientsList = $state<Client[]>([]);
	let performersList = $state<Performer[]>([]);

	// Options for selects
	const statusOptions = [
		{ value: 'inquiry', label: 'Inquiry' },
		{ value: 'confirmed', label: 'Confirmed' },
		{ value: 'deposit-received', label: 'Deposit Received' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	const serviceOptions = [
		'Fire Performance',
		'Juggling',
		'Stilt Walking',
		'Aerial Performance',
		'Balloon Art',
		'Magic',
		'LED Performance',
		'Ambient Entertainment',
		'Choreographed Show',
		'Interactive Workshop'
	];

	const paymentMethodOptions = [
		{ value: 'check', label: 'Check' },
		{ value: 'cash', label: 'Cash' },
		{ value: 'transfer', label: 'Bank Transfer' },
		{ value: 'credit-card', label: 'Credit Card' }
	];

	// Load data when component mounts
	$effect(() => {
		async function loadData() {
			try {
				// Load clients
				await clients.loadClients();
				clientsList = clients.clients || [];

				// Load performers
				await performers.loadPerformers();
				performersList = performers.performers || [];

				// If we have a preselected performer, add them to the event
				if (preselectedPerformerId) {
					const performer = performersList.find((p: Performer) => p.id === preselectedPerformerId);
					if (performer) {
						// You'll need to implement this later
						// addPerformerToEvent(performer);
					}
				}
			} catch (error) {
				console.error('Error loading form data:', error);
			}
		}

		loadData();
	});

	// Form validation
	function validateForm() {
		if (!formData.name) {
			alert('Event name is required');
			return false;
		}
		if (!formData.date) {
			alert('Event date is required');
			return false;
		}
		if (!formData.client) {
			alert('Please select a client');
			return false;
		}
		if (!formData.location.address) {
			alert('Event location is required');
			return false;
		}
		return true;
	}

	// Handle form submission
	function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		// Convert string dates to Date objects
		const submissionData = {
			...formData,
			date: new Date(formData.date),
			contract: {
				...formData.contract,
				sentDate: formData.contract.sentDate ? new Date(formData.contract.sentDate) : null,
				receivedDate: formData.contract.received && formData.contract.receivedDate
					? new Date(formData.contract.receivedDate)
					: null
			},
			deposit: {
				...formData.deposit,
				receivedDate: formData.deposit.received && formData.deposit.receivedDate
					? new Date(formData.deposit.receivedDate)
					: null
			},
			payment: {
				...formData.payment,
				paidDate: formData.payment.paid && formData.payment.paidDate
					? new Date(formData.payment.paidDate)
					: null
			}
		};

		onsubmit?.(submissionData as Partial<Event>);
	}

	// Handle cancel button
	function handleCancel() {
		oncancel?.();
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="event-form"
	data-component="EventForm"
>
	<div class="form-container">
		<BasicInfoSection bind:formData clients={clientsList} {statusOptions} />

		<PerformanceDetailsSection bind:formData />

		<div class="sections-group">
			<ServicesSection bind:formData {serviceOptions} />
			<EquipmentSection bind:formData />
		</div>

		<PerformersSection bind:formData performers={performersList} />

		<div class="grid-layout">
			<ContractSection bind:formData />
			<PaymentSection bind:formData {paymentMethodOptions} />
		</div>

		<NotesSection bind:formData />

		<ManagementSection bind:formData />

		<div class="form-actions">
			{#if showCancelButton}
				<Button
					type="button"
					variant="outline"
					color="gray"
					onclick={handleCancel}
					disabled={isLoading}
				>
					{#snippet children()}Cancel{/snippet}
				</Button>
			{/if}
			<Button type="submit" loading={isLoading} disabled={isLoading}>
				{#snippet children()}{submitLabel}{/snippet}
			</Button>
		</div>
	</div>
</form>

<style>
	.event-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-container {
		max-width: 56rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.sections-group {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.grid-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.grid-layout {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	:global(.dark) .form-actions {
		border-color: var(--border-color-dark);
	}
</style>
