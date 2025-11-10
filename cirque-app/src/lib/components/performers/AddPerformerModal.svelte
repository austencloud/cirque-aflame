<!-- src/lib/components/performers/AddPerformerModal.svelte -->
<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import PerformerForm from './PerformerForm.svelte';
	import { performers } from '$lib/state/performers.svelte';
	import type { Performer } from '$lib/types';

	interface Props {
		isOpen?: boolean;
		onclose?: () => void;
		onadded?: (performer: Performer) => void;
	}

	const { isOpen = false, onclose, onadded }: Props = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	function closeModal() {
		onclose?.();
	}

	async function handleSubmit(performerData: Partial<Performer>) {
		try {
			isSubmitting = true;
			errorMessage = '';

			// Create a valid performer object with all required fields
			const data = {
				name: performerData.name || '',
				email: performerData.email || '',
				phone: performerData.phone || '',
				address: performerData.address || '',
				profilePhoto: performerData.profilePhoto || '',
				skills: performerData.skills || [],
				payRate: performerData.payRate || [],
				notes: performerData.notes || '',
				pay: performerData.pay || 0,
				availability: performerData.availability || [],
				events: performerData.events || []
			};

			const newPerformerId = await performers.addPerformer(data);

			// Reload performers to ensure store is updated
			await performers.loadPerformers();

			// Get the performers from the store
			const performersList = performers.performers || [];
			const newPerformer = performersList.find((p) => p.id === newPerformerId);

			if (newPerformer) {
				onadded?.(newPerformer);
			}

			closeModal();
		} catch (error: any) {
			console.error('Error adding performer:', error);
			errorMessage = error.message || 'Failed to add performer';
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<Modal onclose={closeModal} size="xl">
		{#snippet children()}
			<div class="add-performer-modal" data-component="AddPerformerModal">
				<h2 class="modal-title">Add New Performer</h2>

				{#if errorMessage}
					<div class="error-alert">
						{errorMessage}
					</div>
				{/if}

				<PerformerForm
					onsubmit={handleSubmit}
					oncancel={closeModal}
					isLoading={isSubmitting}
					submitLabel="Add Performer"
					showCancelButton={true}
				/>
			</div>
		{/snippet}
	</Modal>
{/if}

<style>
	.add-performer-modal {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0;
	}

	:global(.dark) .modal-title {
		color: var(--color-text-primary-dark, #f9fafb);
	}

	.error-alert {
		padding: 0.75rem;
		background-color: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	:global(.dark) .error-alert {
		background-color: #7f1d1d;
		border-color: #991b1b;
		color: #fecaca;
	}
</style>
