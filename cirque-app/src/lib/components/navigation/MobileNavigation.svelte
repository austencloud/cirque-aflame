<!-- Simple mobile navigation panel - 2026 style -->
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Icon from '$lib/components/ui/Icon.svelte';

  interface NavItem {
    id: string;
    label: string;
    icon: string;
    color?: string;
  }

  let {
    isOpen = false,
    currentModule,
    navItems = [],
    onNavigate,
    onClose,
  } = $props<{
    isOpen: boolean;
    currentModule: string;
    navItems: NavItem[];
    onNavigate?: (moduleId: string) => void | Promise<void>;
    onClose?: () => void;
  }>();

  // Touch gesture handling
  let touchStartY = $state(0);
  let touchCurrentY = $state(0);
  let isDragging = $state(false);
  let panelElement = $state<HTMLElement | null>(null);

  function handleNavItemTap(moduleId: string) {
    triggerHaptic('selection');
    onNavigate?.(moduleId);

    // Close menu after a short delay
    setTimeout(() => {
      onClose?.();
    }, 150);
  }

  function handleClose() {
    triggerHaptic('selection');
    onClose?.();
  }

  // Touch gesture handlers
  function handleTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
    touchCurrentY = touchStartY;
    isDragging = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;

    touchCurrentY = e.touches[0].clientY;
    const deltaY = touchCurrentY - touchStartY;

    // Only allow downward dragging
    if (deltaY > 0 && panelElement) {
      panelElement.style.transform = `translateY(${deltaY}px)`;
    }
  }

  function handleTouchEnd() {
    if (!isDragging) return;

    const deltaY = touchCurrentY - touchStartY;
    isDragging = false;

    if (panelElement) {
      panelElement.style.transform = '';
    }

    // Close if dragged down more than 100px
    if (deltaY > 100) {
      handleClose();
    }
  }

  // Haptic feedback helper
  function triggerHaptic(type: 'selection' | 'impact' = 'selection') {
    if ('vibrate' in navigator) {
      if (type === 'selection') {
        navigator.vibrate(10);
      } else {
        navigator.vibrate(20);
      }
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="mobile-nav-backdrop"
    onclick={handleClose}
    transition:fade={{ duration: 250 }}
    role="presentation"
  ></div>

  <!-- Navigation Panel -->
  <div
    bind:this={panelElement}
    class="mobile-nav-panel"
    transition:fly={{ y: 600, duration: 350, easing: cubicOut }}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    role="dialog"
    aria-modal="true"
    aria-label="Mobile navigation"
  >
    <!-- Drag Handle -->
    <div class="drag-handle"></div>

    <!-- Panel Header -->
    <div class="panel-header">
      <div class="header-brand">
        <span class="brand-badge">CS</span>
        <span class="brand-name">CircusSync</span>
      </div>
      <button
        class="close-button"
        onclick={handleClose}
        aria-label="Close navigation"
      >
        <Icon name="times" size={20} />
      </button>
    </div>

    <!-- Navigation Items -->
    <div class="nav-container">
      {#each navItems as item}
        {@const isActive = currentModule === item.id}

        <button
          class="nav-button"
          class:active={isActive}
          onclick={() => handleNavItemTap(item.id)}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
        >
          <span class="nav-icon" data-color={item.color}>
            <Icon name={item.icon} size={22} />
          </span>
          <span class="nav-label">{item.label}</span>
          {#if isActive}
            <span class="active-dot"></span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* ============================================================================
     BACKDROP
     ============================================================================ */
  .mobile-nav-backdrop {
    position: fixed;
    inset: 0;
    z-index: 998;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px) saturate(150%);
    -webkit-backdrop-filter: blur(8px) saturate(150%);
  }

  /* ============================================================================
     NAVIGATION PANEL
     ============================================================================ */
  .mobile-nav-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    box-shadow:
      0 -20px 60px rgba(0, 0, 0, 0.15),
      0 -5px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    /* Safe area support */
    padding-bottom: env(safe-area-inset-bottom);
  }

  :global(.dark) .mobile-nav-panel {
    background: rgba(17, 24, 39, 0.95);
    border-top: 1px solid rgba(249, 115, 22, 0.2);
    box-shadow:
      0 -20px 60px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(249, 115, 22, 0.1);
  }

  /* ============================================================================
     DRAG HANDLE
     ============================================================================ */
  .drag-handle {
    width: 48px;
    height: 4px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 9999px;
    margin: 12px auto 8px;
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  :global(.dark) .drag-handle {
    background: rgba(255, 255, 255, 0.2);
  }

  /* ============================================================================
     PANEL HEADER
     ============================================================================ */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background: linear-gradient(
      135deg,
      rgba(103, 126, 234, 0.06) 0%,
      rgba(118, 75, 162, 0.06) 100%
    );
    flex-shrink: 0;
  }

  :global(.dark) .panel-header {
    border-bottom-color: rgba(255, 255, 255, 0.08);
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.08) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-badge {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 700;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  :global(.dark) .brand-badge {
    background: linear-gradient(135deg, var(--color-flame-600), var(--color-royal-600));
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }

  .brand-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-gray-900);
  }

  :global(.dark) .brand-name {
    color: white;
  }

  .close-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    border-radius: 50%;
    color: var(--color-gray-600);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-gray-900);
    transform: scale(1.05);
  }

  .close-button:active {
    transform: scale(0.95);
  }

  :global(.dark) .close-button {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-gray-300);
  }

  :global(.dark) .close-button:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  /* ============================================================================
     NAVIGATION CONTAINER
     ============================================================================ */
  .nav-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    /* iOS momentum scrolling */
    -webkit-overflow-scrolling: touch;

    /* Custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  }

  .nav-container::-webkit-scrollbar {
    width: 6px;
  }

  .nav-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .nav-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  :global(.dark) .nav-container {
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  :global(.dark) .nav-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ============================================================================
     NAV BUTTON
     ============================================================================ */
  .nav-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    /* Minimum touch target */
    min-height: 60px;
  }

  .nav-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(103, 126, 234, 0.06) 0%,
      rgba(118, 75, 162, 0.06) 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
    border-radius: 16px;
  }

  .nav-button:active {
    transform: scale(0.98);
  }

  .nav-button:active::before {
    opacity: 1;
  }

  .nav-button.active {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(103, 126, 234, 0.2);
    box-shadow: 0 4px 12px rgba(103, 126, 234, 0.1);
  }

  .nav-button.active::before {
    opacity: 0.7;
  }

  :global(.dark) .nav-button {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  :global(.dark) .nav-button::before {
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.08) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
  }

  :global(.dark) .nav-button.active {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(249, 115, 22, 0.25);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    transition: transform 0.25s ease;
  }

  /* Icon colors */
  .nav-icon[data-color="flame"] :global(svg) {
    color: var(--color-flame-600);
  }
  .nav-icon[data-color="royal"] :global(svg) {
    color: var(--color-royal-600);
  }
  .nav-icon[data-color="cyan"] :global(svg) {
    color: #06b6d4;
  }
  .nav-icon[data-color="gold"] :global(svg) {
    color: var(--color-gold-600);
  }
  .nav-icon[data-color="purple"] :global(svg) {
    color: #a855f7;
  }
  .nav-icon[data-color="green"] :global(svg) {
    color: #10b981;
  }
  .nav-icon[data-color="blue"] :global(svg) {
    color: #3b82f6;
  }

  :global(.dark) .nav-icon[data-color="flame"] :global(svg) {
    color: var(--color-flame-400);
  }
  :global(.dark) .nav-icon[data-color="royal"] :global(svg) {
    color: var(--color-royal-400);
  }
  :global(.dark) .nav-icon[data-color="cyan"] :global(svg) {
    color: #22d3ee;
  }
  :global(.dark) .nav-icon[data-color="gold"] :global(svg) {
    color: var(--color-gold-400);
  }
  :global(.dark) .nav-icon[data-color="purple"] :global(svg) {
    color: #c084fc;
  }
  :global(.dark) .nav-icon[data-color="green"] :global(svg) {
    color: #34d399;
  }
  :global(.dark) .nav-icon[data-color="blue"] :global(svg) {
    color: #60a5fa;
  }

  .nav-button:active .nav-icon {
    transform: scale(0.95);
  }

  .nav-button.active .nav-icon :global(svg) {
    filter: drop-shadow(0 0 8px currentColor);
  }

  .nav-label {
    flex: 1;
    text-align: left;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--color-gray-900);
  }

  .nav-button.active .nav-label {
    font-weight: 700;
  }

  :global(.dark) .nav-label {
    color: rgba(255, 255, 255, 0.9);
  }

  :global(.dark) .nav-button.active .nav-label {
    color: white;
  }

  .active-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
    flex-shrink: 0;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  :global(.dark) .active-dot {
    background: linear-gradient(135deg, var(--color-flame-500), var(--color-royal-500));
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* ============================================================================
     ACCESSIBILITY & ANIMATIONS
     ============================================================================ */
  @media (prefers-reduced-motion: reduce) {
    .mobile-nav-panel,
    .mobile-nav-panel * {
      transition: none !important;
      animation: none !important;
    }
  }

  /* Focus styles for keyboard navigation */
  .nav-button:focus-visible,
  .close-button:focus-visible {
    outline: 3px solid rgba(102, 126, 234, 0.6);
    outline-offset: 2px;
  }

  :global(.dark) .nav-button:focus-visible,
  :global(.dark) .close-button:focus-visible {
    outline-color: rgba(249, 115, 22, 0.6);
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .mobile-nav-panel {
      background: white;
      border: 2px solid black;
    }

    :global(.dark) .mobile-nav-panel {
      background: black;
      border-color: white;
    }

    .nav-button.active {
      outline: 2px solid currentColor;
    }
  }
</style>
