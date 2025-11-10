<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    onclick?: () => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    onclick,
    children
  }: Props = $props();

  const classes = $derived(
    `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${disabled || loading ? 'btn-disabled' : ''}`
  );
</script>

{#if href && !disabled}
  <a {href} class={classes} role="button">
    {#if loading}
      <span class="btn-spinner"></span>
    {/if}
    {@render children()}
  </a>
{:else}
  <button {type} class={classes} {disabled} {onclick}>
    {#if loading}
      <span class="btn-spinner"></span>
    {/if}
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    font-family: var(--font-sans);
  }

  /* Sizes */
  .btn-sm {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
  }

  .btn-md {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-base);
  }

  .btn-lg {
    padding: var(--space-4) var(--space-8);
    font-size: var(--text-lg);
  }

  /* Variants */
  .btn-primary {
    background: linear-gradient(135deg, var(--color-flame-primary), var(--color-flame-secondary));
    color: white;
    box-shadow: var(--shadow-md);
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--color-flame-secondary), var(--color-flame-tertiary));
    opacity: 0;
    transition: opacity var(--transition-base);
    z-index: -1;
  }

  .btn-primary:hover:not(.btn-disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-flame);
  }

  .btn-primary:hover:not(.btn-disabled)::before {
    opacity: 1;
  }

  .btn-secondary {
    background: var(--color-gray-800);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .btn-secondary:hover:not(.btn-disabled) {
    background: var(--color-gray-700);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    color: var(--color-flame-primary);
    border: 2px solid var(--color-flame-primary);
  }

  .btn-outline:hover:not(.btn-disabled) {
    background: var(--color-flame-primary);
    color: white;
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-primary);
  }

  .btn-ghost:hover:not(.btn-disabled) {
    background: var(--bg-secondary);
  }

  /* States */
  .btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-full-width {
    width: 100%;
  }

  /* Loading Spinner */
  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Active state */
  .btn:active:not(.btn-disabled) {
    transform: translateY(0);
  }

  /* Focus state */
  .btn:focus-visible {
    outline: 2px solid var(--color-flame-primary);
    outline-offset: 2px;
  }
</style>
