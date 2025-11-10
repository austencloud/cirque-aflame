<script lang="ts">
	import { createContractState } from '../state';
	import {
		ClientForm,
		ProducerForm,
		EventForm,
		FeesForm,
		ServicesForm,
		CancellationForm,
		ScheduleForm,
		ObligationsForm,
		SafetyForm
	} from './forms';
	const contractState = createContractState();
	let activeTab = $state<string>('client');
	const tabs = [
		{ id: 'client', label: 'Client' },
		{ id: 'producer', label: 'Producer' },
		{ id: 'event', label: 'Event' },
		{ id: 'fees', label: 'Fees' },
		{ id: 'services', label: 'Services' },
		{ id: 'cancellation', label: 'Cancellation' },
		{ id: 'schedule', label: 'Schedule' },
		{ id: 'obligations', label: 'Obligations' },
		{ id: 'safety', label: 'Safety' }
	];
</script>

<div class="editor">
	<div class="tabs">
		{#each tabs as tab}
			<button
				class="tab-button"
				class:active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	<div class="content">
		{#if activeTab === 'client'}
			<ClientForm bind:client={contractState.contract.client} />
		{:else if activeTab === 'producer'}
			<ProducerForm bind:producer={contractState.contract.producer} />
		{:else if activeTab === 'event'}
			<EventForm bind:contract={contractState.contract} />
		{:else if activeTab === 'fees'}
			<FeesForm bind:fees={contractState.contract.fees} />
		{:else if activeTab === 'services'}
			<ServicesForm bind:services={contractState.contract.services} />
		{:else if activeTab === 'cancellation'}
			<CancellationForm bind:cancellation={contractState.contract.cancellation} />
		{:else if activeTab === 'schedule'}
			<ScheduleForm bind:schedule={contractState.contract.schedule} />
		{:else if activeTab === 'obligations'}
			<ObligationsForm bind:obligations={contractState.contract.obligations} />
		{:else if activeTab === 'safety'}
			<SafetyForm bind:safety={contractState.contract.safety} />
		{/if}
	</div>
	<div class="status">
		<p>Valid: <strong>{contractState.isValid ? '✓' : '✗'}</strong></p>
		{#if contractState.validationErrors.length > 0}
			<div class="errors">
				<h4>Validation Errors:</h4>
				<ul>
					{#each contractState.validationErrors as error} <li>{error}</li> {/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 10px;
	}
	.tabs {
		display: flex;
		gap: 5px;
		border-bottom: 2px solid #ddd;
		overflow-x: auto;
	}
	.tab-button {
		padding: 10px 15px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 14px;
		color: #666;
		border-bottom: 3px solid transparent;
		transition: all 0.2s;
	}
	.tab-button:hover {
		color: #333;
	}
	.tab-button.active {
		color: #2196f3;
		border-bottom-color: #2196f3;
	}
	.content {
		flex: 1;
		overflow-y: auto;
		padding: 10px;
	}
	.status {
		padding: 10px;
		background: #f5f5f5;
		border-top: 1px solid #ddd;
	}
	.status p {
		margin: 0 0 10px 0;
	}
	.errors {
		background: #ffebee;
		padding: 10px;
		border-radius: 4px;
		border-left: 4px solid #f44336;
	}
	.errors h4 {
		margin: 0 0 5px 0;
		color: #c62828;
	}
	.errors ul {
		margin: 0;
		padding-left: 20px;
	}
	.errors li {
		color: #d32f2f;
		margin: 3px 0;
	}
</style>
