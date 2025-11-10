<!-- src/routes/events/[id]/components/tabs/PerformersTab.svelte -->
<script lang="ts"> import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte'; interface Props { event?: any; eventPerformers?: any[]; canEdit?: boolean; }

	const { event, eventPerformers = [], canEdit = false }: Props = $props();
</script>

<div class="performers-container" data-component="PerformersTab"> <div class="performers-header"> <h2 class="performers-title">Performers ({eventPerformers.length})</h2> {#if canEdit} <Button href="/events/{event.id}/add-performer"> {#snippet children()} <Icon name="plus" size={16} extraClass="mr-1" /> Add Performer {/snippet} </Button> {/if} </div> {#if eventPerformers.length === 0} <div class="empty-state"> <p class="empty-text">No performers assigned to this event yet.</p> {#if canEdit} <Button href="/events/{event.id}/add-performer" class="empty-button"> {#snippet children()}Add Performer{/snippet} </Button> {/if} </div> {:else} <div class="performers-"> {#each eventPerformers as performer} <div class="performer-card"> <div class="card-content"> <div class="performer-header"> <div class="performer-info"> <h3 class="performer-name">{performer.name}</h3> </div> </div> <div class="contact-info"> <div class="contact-item"> <Icon name="mail" size={14} extraClass="contact-icon" /> <a href="mailto:{performer.email}" class="contact-link"> {performer.email} </a> </div> <div class="contact-item"> <Icon name="phone" size={14} extraClass="contact-icon" /> <a href="tel:{performer.phone}" class="contact-link"> {performer.phone} </a> </div> </div> {#if performer.skills && performer.skills.length > 0} <div class="skills-section"> <h4 class="skills-label">Skills</h4> <div class="skills-container"> {#each performer.skills as skill} <span class="skill-tag"> {skill.category} </span> {/each} </div> </div> {/if} </div> {#if canEdit} <div class="card-actions"> <button class="action-link view"> View Profile </button> <button class="action-link remove"> Remove </button> </div> {/if} </div> {/each} </div> {/if}
</div> <style>
	.performers-container { display: flex; flex-direction: column; gap: 1rem; }

	.performers-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }

	.performers-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }

	.empty-state { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

	.empty-text { color: var(--text-secondary); }

	.performers-grid { display: grid; gap: 1rem; }

	@media (min-width: 640px) { .performers-grid { grid-template-columns: repeat(2, 1fr); } }

	@media (min-width: 1024px) { .performers-grid { grid-template-columns: repeat(3, 1fr); } }

	.performer-card { background: var(--surface-color); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); overflow: hidden; }

	.card-content { padding: 1rem; }

	.performer-header { display: flex; justify-content: space-between; align-items: flex-start; }

	.performer-info { flex: 1; }

	.performer-name { font-weight: 500; color: var(--text-primary); }

	.contact-info { margin-top: 0.75rem; font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.25rem; }

	.contact-item { display: flex; align-items: center; gap: 0.5rem; }

	:global(.contact-icon) { color: var(--text-tertiary); }

	.contact-link { color: var(--primary-color); text-decoration: none; }

	.contact-link:hover { text-decoration: underline; }

	.skills-section { margin-top: 0.75rem; }

	.skills-label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 0.25rem; }

	.skills-container { display: flex; flex-wrap: wrap; gap: 0.25rem; }

	.skill-tag { display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 9999px; background: rgba(168, 85, 247, 0.1); color: rgb(107, 33, 168); }

	.card-actions { background: var(--surface-secondary); padding: 0.75rem 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; }

	.action-link { font-size: 0.875rem; background: none; border: none; cursor: pointer; text-decoration: none; padding: 0; }

	.action-link.view { color: var(--primary-color); }

	.action-link.view:hover { text-decoration: underline; }

	.action-link.remove { color: var(--error-color); }

	.action-link.remove:hover { text-decoration: underline; }

	:global(.dark) .performers-title, :global(.dark) .performer-name { color: var(--text-primary-dark); }

	:global(.dark) .empty-state, :global(.dark) .performer-card { background: var(--surface-color-dark); }

	:global(.dark) .empty-text { color: var(--text-secondary-dark); }

	:global(.dark) .skills-label { color: var(--text-secondary-dark); }

	:global(.dark) .skill-tag { background: rgba(168, 85, 247, 0.2); color: rgb(216, 180, 254); }

	:global(.dark) .card-actions { background: var(--surface-secondary-dark); border-color: var(--border-color-dark); }

</style>
