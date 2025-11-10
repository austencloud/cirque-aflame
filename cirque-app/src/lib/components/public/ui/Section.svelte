<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    background?: 'white' | 'gray' | 'dark' | 'gradient';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    children: Snippet;
  }

  let {
    id,
    background = 'white',
    padding = 'lg',
    containerSize = 'xl',
    children
  }: Props = $props();

  const sectionClasses = $derived(`section section-bg-${background} section-padding-${padding}`);
  const containerClasses = $derived(`container ${containerSize !== 'full' ? `container-${containerSize}` : ''}`);
</script>

<section {id} class={sectionClasses}>
  <div class={containerClasses}>
    {@render children()}
  </div>
</section>

<style>
  .section {
    position: relative;
  }

  /* Background Variants */
  .section-bg-white {
    background: var(--bg-primary);
  }

  .section-bg-gray {
    background: var(--bg-secondary);
  }

  .section-bg-dark {
    background: var(--color-charcoal);
    color: var(--color-white);
  }

  .section-bg-gradient {
    background: linear-gradient(
      135deg,
      var(--color-charcoal) 0%,
      var(--color-gray-900) 50%,
      var(--color-charcoal) 100%
    );
    color: var(--color-white);
  }

  /* Padding Variants */
  .section-padding-sm {
    padding: var(--space-12) 0;
  }

  .section-padding-md {
    padding: var(--space-16) 0;
  }

  .section-padding-lg {
    padding: var(--space-20) 0;
  }

  .section-padding-xl {
    padding: var(--space-32) 0;
  }

  @media (max-width: 768px) {
    .section-padding-sm {
      padding: var(--space-8) 0;
    }

    .section-padding-md {
      padding: var(--space-12) 0;
    }

    .section-padding-lg {
      padding: var(--space-16) 0;
    }

    .section-padding-xl {
      padding: var(--space-20) 0;
    }
  }
</style>
