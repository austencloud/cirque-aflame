<script lang="ts">
	interface Props {
		formData: any;
	}
	let { formData = $bindable() }: Props = $props();
</script>

<div class="management-container" data-component="ManagementSection">
	<h3 class="management-title">Management</h3>
	<div class="form-grid">
		<div class="input-group">
			<label for="clientLiaison" class="form-label">
				Client Liaison (Main Contact)
			</label>
			<input
				type="text"
				id="clientLiaison"
				bind:value={formData.clientLiaison}
				class="form-input"
			/>
		</div>
		<div class="input-group">
			<label for="gigManager" class="form-label">
				Gig Manager (Team Lead)
			</label>
			<input
				type="text"
				id="gigManager"
				bind:value={formData.gigManager}
				class="form-input"
			/>
		</div>
	</div>
</div>

<style>
	.management-container {
		padding: 0;
	}
	.management-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-gray-900);
		margin-bottom: 1rem;
	}
	:global(.dark) .management-title {
		color: var(--color-gray-100);
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	@media (min-width: 768px) {
		.form-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.input-group {
		display: flex;
		flex-direction: column;
	}
</style>
