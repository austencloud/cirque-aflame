<!-- src/routes/events/[id]/components/tabs/ContractTab.svelte -->
<script lang="ts"> import { format } from 'date-fns';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte'; interface Props { event?: any; canEdit?: boolean; }

	const { event, canEdit = false }: Props = $props(); </script>

<div class="contract-" data-component="ContractTab"> <!-- Contract Information --> <div class="info-card"> <div class="card-header"> <h2 class="card-title">Contract Status</h2> {#if canEdit} <Button href="/events/{event.id}/contract" variant="outline"> {#snippet children()} <Icon name="file-text" size={16} extraClass="mr-1" /> {event.contract.url ? 'View Contract' : 'Generate Contract'} {/snippet} </Button> {/if} </div> <div class="card-content"> <div class="status-row"> <span class="status-label">Contract Sent:</span> <span class="status-value" class:success={event.contract.sent} class:warning={!event.contract.sent}> {event.contract.sent ? 'Yes' : 'No'} </span> </div> {#if event.contract.sent && event.contract.sentDate} <div class="status-row"> <span class="status-label">Date Sent:</span> <span class="status-value">{format(event.contract.sentDate, 'MMM d, yyyy')}</span> </div> {/if} <div class="status-row"> <span class="status-label">Contract Received:</span> <span class="status-value" class:success={event.contract.received} class:warning={!event.contract.received}> {event.contract.received ? 'Yes' : 'No'} </span> </div> {#if event.contract.received && event.contract.receivedDate} <div class="status-row"> <span class="status-label">Date Received:</span> <span class="status-value">{format(event.contract.receivedDate, 'MMM d, yyyy')}</span> </div> {/if} {#if event.contract.url} <div class="contract-link-section"> <a href={event.contract.url} target="_blank" rel="noopener noreferrer" class="contract-link-button" > <Icon name="file-text" size={16} extraClass="mr-2" /> View Contract </a> </div> {/if} {#if canEdit} <div class="actions-section"> <h3 class="actions-title">Contract Actions</h3> {#if !event.contract.sent} <button class="action-button primary"> <Icon name="send" size={16} extraClass="mr-2" /> Mark Contract as Sent </button> {/if} {#if event.contract.sent && !event.contract.received} <button class="action-button success"> <Icon name="check" size={16} extraClass="mr-2" /> Mark Contract as Received </button> {/if} {#if !event.contract.url} <button class="action-button secondary"> <Icon name="upload" size={16} extraClass="mr-2" /> Upload Contract </button> {/if} </div> {/if} </div> </div> <!-- Payment Information --> <div class="info-card"> <div class="card-header"> <h2 class="card-title">Payment Details</h2> {#if canEdit} <Button href="/events/{event.id}/invoice" variant="outline"> {#snippet children()} <Icon name="dollar-sign" size={16} extraClass="mr-1" /> {event.payment.paid ? 'View Invoice' : 'Generate Invoice'} {/snippet} </Button> {/if} </div> <div class="card-content"> <div class="status-row"> <span class="status-label">Total Event Value:</span> <span class="status-value amount">${event.payment.totalValue.toFixed(2)}</span> </div> <div class="status-row"> <span class="status-label">Payment Status:</span> <span class="status-value" class:success={event.payment.paid} class:warning={!event.payment.paid}> {event.payment.paid ? 'Paid' : 'Unpaid'} </span> </div> {#if event.payment.paid && event.payment.paidDate} <div class="status-row"> <span class="status-label">Date Paid:</span> <span class="status-value">{format(event.payment.paidDate, 'MMM d, yyyy')}</span> </div> {/if} {#if event.payment.paid && event.payment.method} <div class="status-row"> <span class="status-label">Payment Method:</span> <span class="status-value method">{event.payment.method}</span> </div> {/if} {#if event.deposit.required} <div class="deposit-section"> <h3 class="deposit-title">Deposit Information</h3> <div class="status-row"> <span class="status-label">Deposit Amount:</span> <span class="status-value amount">${event.deposit.amount?.toFixed(2) || 'N/A'}</span> </div> <div class="status-row"> <span class="status-label">Deposit Status:</span> <span class="status-value" class:success={event.deposit.received} class:warning={!event.deposit.received}> {event.deposit.received ? 'Received' : 'Pending'} </span> </div> {#if event.deposit.received && event.deposit.receivedDate} <div class="status-row"> <span class="status-label">Date Received:</span> <span class="status-value">{format(event.deposit.receivedDate, 'MMM d, yyyy')}</span> </div> {/if} </div> {/if} {#if canEdit} <div class="actions-section"> <h3 class="actions-title">Payment Actions</h3> {#if !event.payment.paid} <button class="action-button success"> <Icon name="check-circle" size={16} extraClass="mr-2" /> Mark as Paid </button> <button class="action-button secondary"> <Icon name="mail" size={16} extraClass="mr-2" /> Send Payment Reminder </button> {/if} {#if event.deposit.required && !event.deposit.received} <button class="action-button primary"> <Icon name="check-circle" size={16} extraClass="mr-2" /> Mark Deposit as Received </button> {/if} </div> {/if} </div> </div> </div> <style>
	.contract-grid { display: grid; gap: 1.5rem; }

	@media (min-width: 768px) { .contract-grid { grid-template-columns: repeat(2, 1fr); } }

	.info-card { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); padding: 1rem; }

	.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }

	.card-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }

	.card-content { display: flex; flex-direction: column; gap: 1rem; }

	.status-row { display: flex; align-items: center; justify-content: space-between; }

	.status-label { color: var(--text-secondary); }

	.status-value { font-weight: 500; color: var(--text-primary); }

	.status-value.success { color: var(--success-color); }

	.status-value.warning { color: var(--warning-color); }

	.status-value.amount { font-weight: 500; }

	.status-value.method { text-transform: capitalize; }

	.contract-link-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }

	.contract-link-button { display: inline-flex; align-items: center; padding: 0.5rem 1rem; border: 1px solid rgba(59, 130, 246, 0.3); font-size: 0.875rem; font-weight: 500; border-radius: var(--border-radius); color: rgb(29, 78, 216); background: rgba(59, 130, 246, 0.1); text-decoration: none; transition: background-color 0.2s; }

	.contract-link-button:hover { background: rgba(59, 130, 246, 0.15); }

	.deposit-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }

	.deposit-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); margin-bottom: 0.75rem; }

	.actions-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem; }

	.actions-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }

	.action-button { display: inline-flex; width: 100%; align-items: center; justify-content: center; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; border-radius: var(--border-radius); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }

	.action-button.primary { color: white; background: var(--primary-color); border-color: var(--primary-color); }

	.action-button.primary:hover { opacity: 0.9; }

	.action-button.success { color: white; background: var(--success-color); border-color: var(--success-color); }

	.action-button.success:hover { opacity: 0.9; }

	.action-button.secondary { color: var(--text-primary); background: var(--surface-color); border-color: var(--border-color); }

	.action-button.secondary:hover { background: var(--surface-hover); }

	:global(.dark) .info-card { background: var(--surface-color-dark); }

	:global(.dark) .card-title, :global(.dark) .status-value, :global(.dark) .deposit-title, :global(.dark) .actions-title { color: var(--text-primary-dark); }

	:global(.dark) .status-label { color: var(--text-secondary-dark); }

	:global(.dark) .contract-link-section, :global(.dark) .deposit-section, :global(.dark) .actions-section { border-color: var(--border-color-dark); }

	:global(.dark) .contract-link-button { color: rgb(147, 197, 253); background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.4); }

	:global(.dark) .contract-link-button:hover { background: rgba(59, 130, 246, 0.2); }

	:global(.dark) .action-button.secondary { color: var(--text-primary-dark); background: var(--surface-color-dark); border-color: var(--border-color-dark); }

	:global(.dark) .action-button.secondary:hover { background: var(--surface-hover-dark); }

</style>
