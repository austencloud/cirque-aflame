<!-- src/lib/components/ui/Button.svelte -->
<script lang="ts"> interface Props { variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; color?: 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'flame' | 'gold' | 'royal' | 'cyan'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; loading?: boolean; href?: string | null; type?: 'button' | 'submit' | 'reset'; fullWidth?: boolean; class?: string; onclick?: (e: MouseEvent) => void; onmouseenter?: (e: MouseEvent) => void; onmouseleave?: (e: MouseEvent) => void; children?: import('svelte').Snippet; }

	const { variant = 'primary', color = 'flame', size = 'md', disabled = false, loading = false, href = null, type = 'button', fullWidth = false, class: className = '', onclick, onmouseenter, onmouseleave, children }: Props = $props();
</script>

{#if href} <a {href} class="btn {variant} {color} {size} {fullWidth ? 'full' : ''} {className}" class:disabled class:loading role="button" aria-disabled={disabled} data-component="Button" data-variant={variant} data-color={color} {onclick} {onmouseenter} {onmouseleave} > {#if loading} <span class="spinner"></span> {/if} {#if children} {@render children()} {/if} </a>
{:else} <button {type} class="btn {variant} {color} {size} {fullWidth ? 'full' : ''} {className}" class:loading disabled={disabled || loading} data-component="Button" data-variant={variant} data-color={color} {onclick} {onmouseenter} {onmouseleave} > {#if loading} <span class="spinner"></span> {/if} {#if children} {@render children()} {/if} </button>
{/if} <style>
	/* Base button styles */ .btn { display: inline-flex; align-items: center; justify-content: center; font-weight: 600; border-radius: var(--radius-lg); border: 1px solid transparent; transition: all var(--transition-base); cursor: pointer; font-family: 'Inter', sans-serif; }

	.btn:focus { outline: 2px solid var(--color-flame-500); outline-offset: 2px; }

	.btn:not(:disabled):not(.loading):hover { transform: scale(1.05); }

	.btn:not(:disabled):not(.loading):active { transform: scale(0.95); }

	.btn:disabled, .btn.disabled { opacity: 0.5; cursor: not-allowed; }

	.btn.loading { opacity: 0.7; cursor: wait; }

	.btn.full { width: 100%; } /* Sizes */ .btn.sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }

	.btn.md { padding: 0.625rem 1.25rem; font-size: 0.875rem; }

	.btn.lg { padding: 0.75rem 1.75rem; font-size: 1rem; } /* Primary variant */ .btn.primary { color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }

	.btn.primary:hover:not(:disabled):not(.loading) { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); }

	.btn.primary.flame { background: linear-gradient(to right, var(--color-flame-500), var(--color-flame-600)); }

	.btn.primary.flame:hover:not(:disabled):not(.loading) { background: linear-gradient(to right, var(--color-flame-600), var(--color-flame-700)); box-shadow: var(--shadow-glow); }

	.btn.primary.gold { background: linear-gradient(to right, var(--color-gold-500), var(--color-gold-600)); }

	.btn.primary.gold:hover:not(:disabled):not(.loading) { background: linear-gradient(to right, var(--color-gold-600), var(--color-gold-700)); box-shadow: var(--shadow-gold-glow); }

	.btn.primary.royal { background: linear-gradient(to right, var(--color-royal-500), var(--color-royal-600)); }

	.btn.primary.royal:hover:not(:disabled):not(.loading) { background: linear-gradient(to right, var(--color-royal-600), var(--color-royal-700)); box-shadow: var(--shadow-royal-glow); }

	.btn.primary.cyan { background: linear-gradient(to right, var(--color-cyan-500), var(--color-cyan-600)); }

	.btn.primary.cyan:hover:not(:disabled):not(.loading) { background: linear-gradient(to right, var(--color-cyan-600), #0e7490); }

	.btn.primary.blue { background: #2563eb; }

	.btn.primary.blue:hover:not(:disabled):not(.loading) { background: #1d4ed8; }

	.btn.primary.green { background: var(--color-green-500); }

	.btn.primary.green:hover:not(:disabled):not(.loading) { background: var(--color-green-400); }

	.btn.primary.red { background: var(--color-red-500); }

	.btn.primary.red:hover:not(:disabled):not(.loading) { background: var(--color-red-400); } /* Secondary variant (big gradients) */ .btn.secondary { color: white; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); position: relative; overflow: hidden; }

	.btn.secondary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent); transform: translateX(-200%); transition: transform 0.6s ease; }

	.btn.secondary:hover::before { transform: translateX(200%); }

	.btn.secondary.flame { background: linear-gradient(to bottom right, var(--color-flame-400), var(--color-flame-500), var(--color-flame-600)); }

	.btn.secondary.flame:hover:not(:disabled):not(.loading) { box-shadow: var(--shadow-glow-lg); }

	.btn.secondary.gold { background: linear-gradient(to bottom right, var(--color-gold-400), var(--color-gold-500), var(--color-gold-600)); }

	.btn.secondary.royal { background: linear-gradient(to bottom right, var(--color-royal-400), var(--color-royal-500), var(--color-royal-600)); } /* Outline variant */ .btn.outline { background: white; border-width: 2px; }

	.btn.outline.flame { color: var(--color-flame-700); border-color: var(--color-flame-300); }

	.btn.outline.flame:hover:not(:disabled):not(.loading) { background: var(--color-flame-50); border-color: var(--color-flame-400); }

	.btn.outline.gold { color: var(--color-gold-700); border-color: var(--color-gold-300); }

	.btn.outline.gold:hover:not(:disabled):not(.loading) { background: var(--color-gold-50); }

	.btn.outline.royal { color: var(--color-royal-700); border-color: var(--color-royal-300); }

	.btn.outline.royal:hover:not(:disabled):not(.loading) { background: var(--color-royal-50); }

	.btn.outline.blue { color: #1d4ed8; border-color: #93c5fd; }

	.btn.outline.blue:hover:not(:disabled):not(.loading) { background: #eff6ff; }

	.btn.outline.green { color: #16a34a; border-color: #86efac; }

	.btn.outline.green:hover:not(:disabled):not(.loading) { background: #f0fdf4; }

	.btn.outline.red { color: #dc2626; border-color: #fca5a5; }

	.btn.outline.red:hover:not(:disabled):not(.loading) { background: #fef2f2; } /* Ghost variant (no background) */ .btn.ghost { background: transparent; border-color: transparent; }

	.btn.ghost.flame { color: var(--color-flame-700); }

	.btn.ghost.flame:hover:not(:disabled):not(.loading) { background: var(--color-flame-50); }

	.btn.ghost.gold { color: var(--color-gold-700); }

	.btn.ghost.gold:hover:not(:disabled):not(.loading) { background: var(--color-gold-50); }

	.btn.ghost.royal { color: var(--color-royal-700); }

	.btn.ghost.royal:hover:not(:disabled):not(.loading) { background: var(--color-royal-50); } /* Loading spinner */ .spinner { display: inline-block; width: 1rem; height: 1rem; margin-right: 0.5rem; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }

</style>
