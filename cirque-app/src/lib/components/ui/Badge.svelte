<!-- src/lib/components/ui/Badge.svelte -->
<script lang="ts"> interface Props { color?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'gray' | 'flame' | 'gold' | 'royal' | 'cyan'; variant?: 'solid' | 'outline' | 'secondary'; size?: 'sm' | 'md' | 'lg'; class?: string; children?: import('svelte').Snippet; }

	const { color = 'flame', variant = 'solid', size = 'sm', class: className = '', children }: Props = $props();
</script>

<span class="badge {variant} {color} {size} {className}" data-component="Badge" data-variant={variant} data-color={color}
> {#if children} {@render children()} {/if}
</span> <style>
	.badge { display: inline-flex; align-items: center; font-weight: 600; border-radius: var(--radius-full); transition: all var(--transition-base); } /* Sizes */ .badge.sm { padding: 0.125rem 0.625rem; font-size: 0.75rem; }

	.badge.md { padding: 0.25rem 0.75rem; font-size: 0.875rem; }

	.badge.lg { padding: 0.375rem 1rem; font-size: 1rem; } /* Solid variant */ .badge.solid.flame { background: var(--color-flame-100); color: var(--color-flame-800); }

	.badge.solid.gold { background: var(--color-gold-100); color: var(--color-gold-800); }

	.badge.solid.royal { background: var(--color-royal-100); color: var(--color-royal-800); }

	.badge.solid.cyan { background: var(--color-cyan-100); color: var(--color-cyan-800); }

	.badge.solid.blue { background: #dbeafe; color: #1e40af; }

	.badge.solid.green { background: #dcfce7; color: #166534; }

	.badge.solid.red { background: #fee2e2; color: #991b1b; }

	.badge.solid.amber { background: #fef3c7; color: #92400e; }

	.badge.solid.purple { background: #f3e8ff; color: #6b21a8; }

	.badge.solid.gray { background: var(--color-gray-100); color: var(--color-gray-800); } /* Secondary variant (gradient) */ .badge.secondary { color: white; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }

	.badge.secondary.flame { background: linear-gradient(to right, var(--color-flame-500), var(--color-flame-600)); box-shadow: var(--shadow-glow-sm); }

	.badge.secondary.gold { background: linear-gradient(to right, var(--color-gold-500), var(--color-gold-600)); }

	.badge.secondary.royal { background: linear-gradient(to right, var(--color-royal-500), var(--color-royal-600)); }

	.badge.secondary.cyan { background: linear-gradient(to right, var(--color-cyan-500), var(--color-cyan-600)); }

	.badge.secondary.blue { background: linear-gradient(to right, #3b82f6, #2563eb); }

	.badge.secondary.green { background: linear-gradient(to right, var(--color-green-500), #10b981); }

	.badge.secondary.red { background: linear-gradient(to right, var(--color-red-500), #f43f5e); }

	.badge.secondary.amber { background: linear-gradient(to right, var(--color-amber-500), #f97316); }

	.badge.secondary.purple { background: linear-gradient(to right, #a855f7, #8b5cf6); }

	.badge.secondary.gray { background: linear-gradient(to right, #6b7280, #4b5563); } /* Outline variant */ .badge.outline { background: white; border: 1px solid; }

	.badge.outline.flame { color: var(--color-flame-700); border-color: var(--color-flame-300); }

	.badge.outline.gold { color: var(--color-gold-700); border-color: var(--color-gold-300); }

	.badge.outline.royal { color: var(--color-royal-700); border-color: var(--color-royal-300); }

	.badge.outline.cyan { color: var(--color-cyan-700); border-color: var(--color-cyan-300); }

	.badge.outline.blue { color: #1d4ed8; border-color: #93c5fd; }

	.badge.outline.green { color: #16a34a; border-color: #86efac; }

	.badge.outline.red { color: #dc2626; border-color: #fca5a5; }

</style>
