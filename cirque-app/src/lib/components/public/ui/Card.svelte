<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    hover?: boolean;
    glow?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    href?: string;
    onclick?: () => void;
    children: Snippet;
  }

  let {
    hover = false,
    glow = false,
    padding = 'md',
    href,
    onclick,
    children
  }: Props = $props();

  const classes = $derived(
    `card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} card-padding-${padding}`
  );
</script>

{#if href}
  <a {href} class={classes}>
    {@render children()}
  </a>
{:else if onclick}
  <button class={classes} {onclick}>
    {@render children()}
  </button>
{:else}
  <div class={classes}>
    {@render children()}
  </div>
{/if}

<style>
  .card {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-base);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }

  a.card,
  button.card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font: inherit;
  }

  /* Padding Variants */
  .card-padding-sm {
    padding: var(--space-4);
  }

  .card-padding-md {
    padding: var(--space-6);
  }

  .card-padding-lg {
    padding: var(--space-8);
  }

  /* Hover Effect */
  .card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-xl);
  }

  /* Glow Effect */
  .card-glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, var(--color-flame-primary), var(--color-flame-secondary));
    border-radius: inherit;
    opacity: 0;
    transition: opacity var(--transition-base);
    filter: blur(20px);
    z-index: -1;
  }

  .card-glow:hover::before {
    opacity: 0.7;
    animation: flame-pulse 1.5s ease-in-out infinite;
  }

  /* Focus state for interactive cards */
  a.card:focus-visible,
  button.card:focus-visible {
    outline: 2px solid var(--color-flame-primary);
    outline-offset: 2px;
  }

  @keyframes flame-pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.9;
    }
  }
</style>
