<script lang="ts">
  let {
    title,
    description,
    futureContent,
  } = $props<{
    title: string;
    description: string;
    futureContent: string;
  }>();
</script>

<div class="section-container">
  <div class="section-header">
    <h1 class="section-title">{title}</h1>
    <p class="section-description">{description}</p>
  </div>

  <div class="placeholder-content">
    <div class="placeholder-card">
      <h2>{title}</h2>
      <p>This is a placeholder for the {title.toLowerCase()} section.</p>
      <p class="future-content">Future content: {futureContent}</p>
    </div>
  </div>
</div>

<style>
  .section-container {
    padding: 2rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin-bottom: 0.5rem;
  }

  :global(.dark) .section-title {
    color: white;
  }

  .section-description {
    font-size: 1rem;
    color: var(--color-gray-600);
  }

  :global(.dark) .section-description {
    color: var(--color-gray-400);
  }

  .placeholder-content {
    display: grid;
    gap: 1.5rem;
  }

  .placeholder-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .placeholder-card {
    background: var(--color-gray-800);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .placeholder-card h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 1rem;
  }

  :global(.dark) .placeholder-card h2 {
    color: white;
  }

  .placeholder-card p {
    color: var(--color-gray-600);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  :global(.dark) .placeholder-card p {
    color: var(--color-gray-400);
  }

  .future-content {
    font-style: italic;
    opacity: 0.8;
  }
</style>
