<!-- Desktop Navigation Sidebar - Modern 2026-style sidebar for desktop -->
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import type { ModuleDefinition, Section, ModuleId } from './types';

  let {
    currentModule,
    currentSection,
    modules = [],
    onModuleChange,
    onSectionChange,
    onSettingsClick,
  } = $props<{
    currentModule: string;
    currentSection: string;
    modules: ModuleDefinition[];
    onModuleChange?: (moduleId: ModuleId) => void | Promise<void>;
    onSectionChange?: (sectionId: string) => void;
    onSettingsClick?: () => void;
  }>();

  // Track which modules are expanded
  let expandedModules = $state<Set<string>>(new Set([currentModule]));

  // Check if we're on the settings page
  let isSettingsActive = $derived(($page.url.pathname as string).startsWith('/settings'));

  // Ensure current module is always expanded
  $effect(() => {
    if (currentModule && !expandedModules.has(currentModule)) {
      expandedModules = new Set([...expandedModules, currentModule]);
    }
  });

  function toggleModuleExpansion(moduleId: string) {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    expandedModules = newExpanded;
  }

  function handleModuleTap(moduleId: string, hasSections: boolean) {
    // If module has no sections, navigate directly to it
    if (!hasSections) {
      onModuleChange?.(moduleId as ModuleId);
    } else {
      // Module buttons with sections only toggle expansion
      toggleModuleExpansion(moduleId);
    }
  }

  function handleSectionTap(moduleId: string, section: Section) {
    if (!section.disabled) {
      // Switch to the section's module if we're not already on it
      if (moduleId !== currentModule) {
        onModuleChange?.(moduleId as ModuleId);
      }

      // Then switch to the section
      onSectionChange?.(section.id);

      // Ensure the module is expanded after navigation
      expandedModules = new Set([...expandedModules, moduleId]);
    }
  }

  function handleSettingsTap() {
    onSettingsClick?.();
  }
</script>

<nav class="desktop-navigation-sidebar">
  <!-- Sidebar Header/Branding -->
  <div class="sidebar-header">
    <div class="studio-logo">
      <span class="logo-badge">CS</span>
      <span class="studio-name">CircusSync</span>
    </div>
  </div>

  <!-- Modules List -->
  <div class="modules-container">
    {#each modules.filter((m) => m.isMain) as module}
      {@const isActive = currentModule === module.id}
      {@const isExpanded = expandedModules.has(module.id)}
      {@const hasSections = module.sections && module.sections.length > 0}

      <div class="module-group">
        <!-- Module Button -->
        <button
          class="module-button"
          class:expanded={isExpanded}
          onclick={() => handleModuleTap(module.id, hasSections)}
          aria-label={module.label}
          aria-expanded={hasSections ? isExpanded : undefined}
        >
          <span class="module-icon" data-color={module.color}>
            <Icon name={module.icon} size={20} />
          </span>
          <span class="module-label">{module.label}</span>
          {#if hasSections}
            <span class="expand-icon">
              <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} />
            </span>
          {/if}
        </button>

        <!-- Module Sections/Tabs (collapsible) -->
        {#if isExpanded && module.sections.length > 0}
          <div class="sections-list" transition:slide={{ duration: 200 }}>
            {#each module.sections as section}
              {@const isSectionActive = currentSection === section.id && isActive}

              <button
                class="section-button"
                class:active={isSectionActive}
                class:disabled={section.disabled}
                onclick={() => handleSectionTap(module.id, section)}
                disabled={section.disabled}
                aria-label={section.label}
                style="--section-color: {section.color || 'var(--color-gray-400)'}; --section-gradient: {section.gradient || section.color || 'var(--color-gray-400)'};"
              >
                <span class="section-icon">
                  <Icon name={section.icon} size={16} />
                </span>
                <span class="section-label">{section.label}</span>
                {#if isSectionActive}
                  <span class="active-indicator"></span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Sidebar Footer -->
  <div class="sidebar-footer">
    <button
      class="footer-button settings-button"
      class:active={isSettingsActive}
      onclick={handleSettingsTap}
      aria-label="Settings"
    >
      <Icon name="cog" size={18} />
      <span>Settings</span>
    </button>
  </div>
</nav>

<style>
  /* ============================================================================
     DESKTOP NAVIGATION SIDEBAR - 2026 MODERN DESIGN
     ============================================================================ */
  .desktop-navigation-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    display: flex;
    flex-direction: column;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 150;
    overflow: hidden;

    /* Safe area support */
    padding-left: env(safe-area-inset-left);
  }

  :global(.dark) .desktop-navigation-sidebar {
    background: rgba(10, 10, 15, 0.95);
    border-right-color: rgba(249, 115, 22, 0.15);
  }

  /* ============================================================================
     SIDEBAR HEADER
     ============================================================================ */
  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: linear-gradient(
      135deg,
      rgba(103, 126, 234, 0.08) 0%,
      rgba(118, 75, 162, 0.08) 100%
    );
  }

  :global(.dark) .sidebar-header {
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
  }

  .studio-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.95);
  }

  .logo-badge {
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

  :global(.dark) .logo-badge {
    background: linear-gradient(135deg, var(--color-flame-600), var(--color-royal-600));
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }

  .studio-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.75) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ============================================================================
     MODULES CONTAINER
     ============================================================================ */
  .modules-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 12px;

    /* Custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .modules-container::-webkit-scrollbar {
    width: 6px;
  }

  .modules-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .modules-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .modules-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  /* ============================================================================
     MODULE GROUP
     ============================================================================ */
  .module-group {
    margin-bottom: 8px;
  }

  .module-group:last-child {
    margin-bottom: 0;
  }

  /* ============================================================================
     MODULE BUTTON
     ============================================================================ */
  .module-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .module-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.05);
    opacity: 0;
    transition: opacity 0.25s ease;
    border-radius: 12px;
  }

  .module-button:hover::before {
    opacity: 1;
  }

  .module-button:hover {
    color: rgba(255, 255, 255, 0.95);
    transform: translateX(2px);
  }

  .module-button.expanded {
    color: rgba(255, 255, 255, 0.85);
  }

  .module-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    transition: transform 0.25s ease;
  }

  /* Icon colors */
  .module-icon[data-color="flame"] :global(svg) {
    color: var(--color-flame-500);
  }
  .module-icon[data-color="royal"] :global(svg) {
    color: var(--color-royal-500);
  }
  .module-icon[data-color="cyan"] :global(svg) {
    color: #06b6d4;
  }
  .module-icon[data-color="gold"] :global(svg) {
    color: var(--color-gold-500);
  }
  .module-icon[data-color="purple"] :global(svg) {
    color: #a855f7;
  }
  .module-icon[data-color="green"] :global(svg) {
    color: #10b981;
  }
  .module-icon[data-color="blue"] :global(svg) {
    color: #3b82f6;
  }

  .module-button:hover .module-icon {
    transform: scale(1.05);
  }

  .module-label {
    flex: 1;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .expand-icon {
    opacity: 0.5;
    transition: all 0.25s ease;
  }

  .module-button.expanded .expand-icon {
    opacity: 0.8;
  }

  .module-button:hover .expand-icon {
    opacity: 1;
  }

  /* ============================================================================
     SECTIONS LIST
     ============================================================================ */
  .sections-list {
    margin-top: 4px;
    padding-left: 12px;
    border-left: 2px solid rgba(255, 255, 255, 0.06);
    margin-left: 28px;
  }

  /* ============================================================================
     SECTION BUTTON
     ============================================================================ */
  .section-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    margin-bottom: 2px;
  }

  .section-button:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    transform: translateX(2px);
  }

  .section-button.active {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.08);
  }

  .section-button.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  /* Style icons with gradient colors */
  .section-icon :global(svg) {
    color: var(--section-color);
    filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
  }

  .section-button:not(.active) .section-icon :global(svg) {
    opacity: 0.7;
  }

  .section-button:hover .section-icon :global(svg) {
    opacity: 1;
  }

  .section-button.active .section-icon :global(svg) {
    opacity: 1;
    filter: drop-shadow(0 0 10px var(--section-color)) brightness(1.1);
  }

  .section-label {
    flex: 1;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.005em;
  }

  .active-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--section-gradient);
    box-shadow: 0 0 8px var(--section-color);
    flex-shrink: 0;
  }

  /* ============================================================================
     SIDEBAR FOOTER
     ============================================================================ */
  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      transparent 100%
    );
  }

  .footer-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 15px;
    font-weight: 500;
  }

  .footer-button:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.95);
    transform: translateX(2px);
  }

  .footer-button.active {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
  }

  /* ============================================================================
     ANIMATIONS & TRANSITIONS
     ============================================================================ */
  @media (prefers-reduced-motion: reduce) {
    .desktop-navigation-sidebar * {
      transition: none !important;
      animation: none !important;
    }
  }

  /* ============================================================================
     ACCESSIBILITY
     ============================================================================ */
  @media (prefers-contrast: high) {
    .desktop-navigation-sidebar {
      background: rgba(0, 0, 0, 0.95);
      border-right: 2px solid white;
    }

    .section-button.active {
      background: rgba(255, 255, 255, 0.25);
      outline: 2px solid white;
    }
  }

  /* Focus styles for keyboard navigation */
  .module-button:focus-visible,
  .section-button:focus-visible,
  .footer-button:focus-visible {
    outline: 2px solid rgba(102, 126, 234, 0.6);
    outline-offset: 2px;
  }

  :global(.dark) .module-button:focus-visible,
  :global(.dark) .section-button:focus-visible,
  :global(.dark) .footer-button:focus-visible {
    outline-color: rgba(249, 115, 22, 0.6);
  }
</style>
