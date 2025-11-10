<!-- src/routes/events/[id]/components/tabs/ClientInfoTab.svelte -->
<script lang="ts"> import { format } from 'date-fns';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte'; interface Props { client?: any; canEdit?: boolean; }

	const { client, canEdit = false }: Props = $props(); </script>

{#if client} <div class="client-info-card" data-component="ClientInfoTab"> <div class="card-header"> <h2 class="card-title">Client Information</h2> {#if canEdit} <Button href="/clients/{client.id}" variant="outline"> {#snippet children()} <Icon name="external-link" size={16} extraClass="mr-1" /> View Full Profile {/snippet} </Button> {/if} </div> <div class="info-"> <div class="info-section"> <div class="contact-info"> <h3 class="section-label">Contact Information</h3> <div class="contact-details"> <p class="client-name">{client.name}</p> <p class="contact-person">Contact: {client.contactPerson}</p> <div class="contact-methods"> <div class="contact-item"> <Icon name="mail" size={14} extraClass="contact-icon" /> <a href="mailto:{client.email}" class="contact-link"> {client.email} </a> </div> <div class="contact-item"> <Icon name="phone" size={14} extraClass="contact-icon" /> <a href="tel:{client.phone}" class="contact-link"> {client.phone} </a> </div> <div class="contact-item"> <Icon name="map-pin" size={14} extraClass="contact-icon-top" /> <p class="address">{client.address}</p> </div> </div> </div> </div> <div class="history-info"> <h3 class="section-label">History & Status</h3> <div class="history-details"> <div class="history-row"> <span class="history-label">Client Status:</span> <span class="history-value status">{client.status}</span> </div> {#if client.lastPerformed} <div class="history-row"> <span class="history-label">Last Event:</span> <span class="history-value">{format(client.lastPerformed, 'MMM d, yyyy')}</span> </div> {/if} {#if client.lastContacted} <div class="history-row"> <span class="history-label">Last Contacted:</span> <span class="history-value">{format(client.lastContacted, 'MMM d, yyyy')}</span> </div> {/if} </div> </div> </div> <div class="info-section"> {#if client.eventTypes && client.eventTypes.length > 0} <div class="tags-section"> <h3 class="section-label">Event Types</h3> <div class="tags-container"> {#each client.eventTypes as eventType} <span class="tag event-tag"> {eventType} </span> {/each} </div> </div> {/if} {#if client.servicesUsed && client.servicesUsed.length > 0} <div class="tags-section"> <h3 class="section-label">Services Used</h3> <div class="tags-container"> {#each client.servicesUsed as service} <span class="tag service-tag"> {service} </span> {/each} </div> </div> {/if} {#if client.nextFollowUp && client.nextFollowUp.task} <div class="tags-section"> <h3 class="section-label">Follow-Up</h3> <div class="follow-up-box"> <div class="follow-up-content"> <Icon name="bell" size={16} extraClass="follow-up-icon" /> <div class="follow-up-text"> <p class="follow-up-task">{client.nextFollowUp.task}</p> {#if client.nextFollowUp.date} <p class="follow-up-date"> Follow up by: {format(client.nextFollowUp.date, 'MMM d, yyyy')} </p> {/if} </div> </div> </div> </div> {/if} </div> </div> {#if client.notes} <div class="notes-section"> <h3 class="section-label">Client Notes</h3> <div class="notes-content"> {client.notes} </div> </div> {/if} </div> {:else} <div class="empty-state" data-component="ClientInfoTab"> <p class="empty-message">No client information available for this event.</p> </div> {/if} <style>
	.client-info-card { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); padding: 1rem; }

	.empty-state { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); padding: 2rem; text-align: center; }

	.empty-message { color: var(--text-secondary); }

	.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }

	.card-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }

	.info-grid { display: grid; gap: 1.5rem; }

	@media (min-width: 768px) { .info-grid { grid-template-columns: repeat(2, 1fr); } }

	.info-section { display: flex; flex-direction: column; gap: 1rem; }

	.section-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }

	.contact-info { margin-bottom: 1rem; }

	.contact-details { margin-top: 0.5rem; }

	.client-name { font-weight: 500; font-size: 1.125rem; color: var(--text-primary); }

	.contact-person { color: var(--text-primary); margin-top: 0.25rem; }

	.contact-methods { margin-top: 0.75rem; font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem; }

	.contact-item { display: flex; align-items: center; gap: 0.5rem; }

	:global(.contact-icon) { color: var(--text-tertiary); }

	:global(.contact-icon-top) { color: var(--text-tertiary); margin-top: 0.25rem; align-self: flex-start; }

	.contact-link { color: var(--primary-color); text-decoration: none; }

	.contact-link:hover { text-decoration: underline; }

	.address { flex: 1; color: var(--text-primary); }

	.history-details { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem; }

	.history-row { display: flex; justify-content: space-between; }

	.history-label { color: var(--text-secondary); }

	.history-value { font-weight: 500; color: var(--text-primary); }

	.history-value.status { text-transform: capitalize; }

	.tags-section { margin-bottom: 1rem; }

	.tags-container { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem; }

	.tag { display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 9999px; }

	.event-tag { background: rgba(59, 130, 246, 0.1); color: rgb(30, 64, 175); }

	.service-tag { background: rgba(34, 197, 94, 0.1); color: rgb(21, 128, 61); }

	.follow-up-box { margin-top: 0.5rem; padding: 0.75rem; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--border-radius); }

	.follow-up-content { display: flex; align-items: flex-start; gap: 0.5rem; }

	:global(.follow-up-icon) { color: rgb(180, 83, 9); margin-top: 0.25rem; }

	.follow-up-text { flex: 1; }

	.follow-up-task { font-weight: 500; color: rgb(146, 64, 14); }

	.follow-up-date { font-size: 0.875rem; color: rgb(161, 98, 7); margin-top: 0.25rem; }

	.notes-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }

	.notes-content { margin-top: 0.5rem; padding: 0.75rem; background: var(--surface-secondary); border-radius: var(--border-radius); white-space: pre-line; color: var(--text-primary); }

	:global(.dark) .client-info-card, :global(.dark) .empty-state { background: var(--surface-color-dark); }

	:global(.dark) .card-title, :global(.dark) .client-name, :global(.dark) .contact-person, :global(.dark) .address, :global(.dark) .history-value, :global(.dark) .notes-content { color: var(--text-primary-dark); }

	:global(.dark) .section-label, :global(.dark) .history-label, :global(.dark) .empty-message { color: var(--text-secondary-dark); }

	:global(.dark) .notes-section { border-color: var(--border-color-dark); }

	:global(.dark) .notes-content { background: var(--surface-secondary-dark); }

	:global(.dark) .event-tag { background: rgba(59, 130, 246, 0.2); color: rgb(147, 197, 253); }

	:global(.dark) .service-tag { background: rgba(34, 197, 94, 0.2); color: rgb(134, 239, 172); }

	:global(.dark) .follow-up-box { background: rgba(251, 191, 36, 0.15); border-color: rgba(251, 191, 36, 0.4); }

	:global(.dark) .follow-up-task { color: rgb(252, 211, 77); }

	:global(.dark) .follow-up-date { color: rgb(250, 204, 21); }

</style>
