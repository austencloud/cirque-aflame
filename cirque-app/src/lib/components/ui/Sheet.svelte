<!-- src/lib/components/ui/Sheet.svelte -->
<!-- Reusable slide-over panel/bottom sheet component following 2025 UX best practices -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen?: boolean;
		onclose?: () => void;
		title?: string;
		size?: 'small' | 'medium' | 'large' | 'full';
		showDragHandle?: boolean;
		preventBodyScroll?: boolean;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		isOpen = false,
		onclose,
		title = '',
		size = 'medium',
		showDragHandle = true,
		preventBodyScroll = true,
		children,
		header,
		footer
	}: Props = $props();

	// Detect if mobile for different slide direction
	let isMobile = $state(false);
	let dragStartY = $state(0);
	let dragCurrentY = $state(0);
	let isDragging = $state(false);
	let dragStartTime = 0;
	let sheetPanelElement: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (typeof window !== 'undefined') {
			const checkMobile = () => {
				isMobile = window.innerWidth < 768;
			};
			checkMobile();
			window.addEventListener('resize', checkMobile);
			return () => window.removeEventListener('resize', checkMobile);
		}
	});

	// Prevent body scroll when sheet is open
	$effect(() => {
		if (isOpen && preventBodyScroll && typeof document !== 'undefined') {
			const originalOverflow = document.body.style.overflow;
			const originalPosition = document.body.style.position;
			const originalTouchAction = document.body.style.touchAction;
			
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.touchAction = 'none';
			
			return () => {
				document.body.style.overflow = originalOverflow;
				document.body.style.position = originalPosition;
				document.body.style.touchAction = originalTouchAction;
			};
		}
	});

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close();
		}
	}

	function close() {
		isOpen = false;
		onclose?.();
	}

	// Mobile swipe to dismiss
	function handleTouchStart(event: TouchEvent) {
		isDragging = true;
		dragStartY = event.touches[0].clientY;
		dragCurrentY = dragStartY;
		dragStartTime = Date.now();
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging) return;
		
		dragCurrentY = event.touches[0].clientY;
		const deltaY = dragCurrentY - dragStartY;
		
		// Only allow downward swipes on mobile
		if (isMobile && deltaY > 0) {
			// Prevent scrolling when dragging down
			if (Math.abs(deltaY) > 25) {
				event.preventDefault();
			}
		}
	}

	function handleTouchEnd() {
		if (!isDragging) return;

		const deltaY = dragCurrentY - dragStartY;
		const threshold = 100;
		const maxDuration = 500;
		const duration = Date.now() - dragStartTime;
		const distance = Math.abs(deltaY);

		// Dismiss if dragged past threshold or fast swipe
		if (distance > threshold || (distance > 50 && duration < maxDuration)) {
			close();
		}

		isDragging = false;
		dragStartY = 0;
		dragCurrentY = 0;
	}

	// Mouse handlers for desktop drag support
	let isMouseDragging = $state(false);

	function handleMouseDown(event: MouseEvent) {
		isMouseDragging = true;
		isDragging = true;
		dragStartY = event.clientY;
		dragCurrentY = dragStartY;
		dragStartTime = Date.now();
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isMouseDragging) return;
		dragCurrentY = event.clientY;
	}

	function handleMouseUp() {
		if (!isMouseDragging) return;
		isMouseDragging = false;
		handleTouchEnd(); // Reuse same dismissal logic
	}

	// Setup non-passive touch listeners on entire sheet panel
	$effect(() => {
		if (isOpen && sheetPanelElement) {
			const options = { passive: false };
			
			sheetPanelElement.addEventListener('touchstart', handleTouchStart as any);
			sheetPanelElement.addEventListener('touchmove', handleTouchMove as any, options);
			sheetPanelElement.addEventListener('touchend', handleTouchEnd as any);
			
			// Mouse handlers for desktop
			sheetPanelElement.addEventListener('mousedown', handleMouseDown as any);
			
			return () => {
				sheetPanelElement.removeEventListener('touchstart', handleTouchStart as any);
				sheetPanelElement.removeEventListener('touchmove', handleTouchMove as any);
				sheetPanelElement.removeEventListener('touchend', handleTouchEnd as any);
				sheetPanelElement.removeEventListener('mousedown', handleMouseDown as any);
			};
		}
	});

	// Global mouse handlers for dragging
	$effect(() => {
		if (isMouseDragging && typeof window !== 'undefined') {
			window.addEventListener('mousemove', handleMouseMove as any);
			window.addEventListener('mouseup', handleMouseUp as any);
			
			return () => {
				window.removeEventListener('mousemove', handleMouseMove as any);
				window.removeEventListener('mouseup', handleMouseUp as any);
			};
		}
	});

	// Focus management for accessibility
	let sheetElement = $state<HTMLDivElement>();
	let dragHandleElement = $state<HTMLDivElement>();
	let firstFocusableElement = $state<HTMLElement>();
	let lastFocusableElement = $state<HTMLElement>();

	function trapFocus(event: KeyboardEvent) {
		if (event.key !== 'Tab') {
			return;
		}

		if (event.shiftKey) {
			if (document.activeElement === firstFocusableElement) {
				event.preventDefault();
				lastFocusableElement?.focus();
			}
		} else {
			if (document.activeElement === lastFocusableElement) {
				event.preventDefault();
				firstFocusableElement?.focus();
			}
		}
	}

	$effect(() => {
		if (isOpen && sheetPanelElement) {
			// Set up focus trap
			const focusableElements = sheetPanelElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			firstFocusableElement = focusableElements[0] as HTMLElement;
			lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

			// Focus the first element
			setTimeout(() => firstFocusableElement?.focus(), 100);
		}
	});

	// Size configurations
	const sizeClasses = {
		small: 'max-w-sm',
		medium: 'max-w-md',
		large: 'max-w-2xl',
		full: 'max-w-full'
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		class="sheet-backdrop"
		onclick={handleBackdropClick}
		onkeydown={trapFocus}
		in:fade={{ duration: 250 }}
		out:fade={{ duration: 200 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'sheet-title' : undefined}
		tabindex="-1"
		data-component="Sheet"
	>
		<div
			bind:this={sheetPanelElement}
			class="sheet-panel {sizeClasses[size]}"
			class:dragging={isDragging}
			style:transform={isDragging ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)` : ''}
			in:fly={{
				x: isMobile ? 0 : 400,
				y: isMobile ? 400 : 0,
				duration: 300,
				easing: cubicOut
			}}
			out:fly={{
				x: isMobile ? 0 : 400,
				y: isMobile ? 400 : 0,
				duration: 250,
				easing: cubicOut
			}}
		>
			<!-- Mobile drag handle (minimum 48px touch target) -->
			{#if showDragHandle}
				<div bind:this={dragHandleElement} class="drag-handle-container" aria-label="Drag to close">
					<div class="drag-handle"></div>
				</div>
			{/if}

			<!-- Header slot or default header -->
			{#if header}
				{@render header()}
			{:else if title}
				<div class="sheet-header">
					<h2 id="sheet-title" class="sheet-title">{title}</h2>
					<button type="button" class="close-button" onclick={close} aria-label="Close">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Content slot -->
			<div class="sheet-content">
				{#if children}
					{@render children()}
				{/if}
			</div>

			<!-- Footer slot -->
			{#if footer}
				<div class="sheet-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Backdrop */
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		touch-action: none;
	}

	:global(.dark) .sheet-backdrop {
		background: rgba(0, 0, 0, 0.7);
	}

	/* Panel base styles */
	.sheet-panel {
		position: fixed;
		/* Glass effect for light mode */
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow:
			-4px 0 20px rgba(0, 0, 0, 0.15),
			-2px 0 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		touch-action: none;
		user-select: none;
	}

	.sheet-panel.dragging {
		transition: none;
	}

	:global(.dark) .sheet-panel {
		/* Glass effect for dark mode - dark background with transparency */
		background: rgba(17, 24, 39, 0.98);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-left: 1px solid rgba(249, 115, 22, 0.15);
		box-shadow:
			-4px 0 20px rgba(0, 0, 0, 0.6),
			-2px 0 10px rgba(0, 0, 0, 0.4),
			0 0 40px rgba(249, 115, 22, 0.08);
	}

	/* Desktop: Slide from right */
	@media (min-width: 768px) {
		.sheet-panel {
			top: 0;
			right: 0;
			bottom: 0;
			width: 100%;
		}

		.sheet-panel.max-w-sm {
			max-width: 24rem;
		}

		.sheet-panel.max-w-md {
			max-width: 28rem;
		}

		.sheet-panel.max-w-2xl {
			max-width: 42rem;
		}

		.sheet-panel.max-w-full {
			max-width: 100%;
		}
	}

	/* Mobile: Slide from bottom */
	@media (max-width: 767px) {
		.sheet-panel {
			bottom: 0;
			left: 0;
			right: 0;
			max-height: 90vh;
			border-top-left-radius: 1.5rem;
			border-top-right-radius: 1.5rem;
		}
	}

	/* Drag handle - Minimum 48px touch target per accessibility guidelines */
	.drag-handle-container {
		width: 100%;
		min-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
		flex-shrink: 0;
		touch-action: none;
		background: rgba(249, 250, 251, 0.5);
	}

	:global(.dark) .drag-handle-container {
		background: rgba(0, 0, 0, 0.3);
	}

	.drag-handle-container:active {
		cursor: grabbing;
	}

	.drag-handle {
		width: 2.5rem;
		height: 0.25rem;
		background: linear-gradient(135deg, var(--color-gray-300), var(--color-gray-400));
		border-radius: 9999px;
	}

	:global(.dark) .drag-handle {
		background: linear-gradient(135deg, var(--color-gray-600), var(--color-gray-500));
	}

	/* Header */
	.sheet-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-gray-200);
		flex-shrink: 0;
		background: rgba(249, 250, 251, 0.5);
	}

	:global(.dark) .sheet-header {
		background: rgba(0, 0, 0, 0.3);
		border-bottom-color: rgba(249, 115, 22, 0.15);
	}

	.sheet-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-gray-900);
		margin: 0;
	}

	:global(.dark) .sheet-title {
		background: linear-gradient(135deg, var(--color-flame-500), var(--color-royal-500));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.close-button {
		padding: 0.5rem;
		color: var(--color-gray-600);
		background: none;
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-base);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.dark) .close-button {
		color: var(--color-gray-400);
	}

	.close-button:hover {
		color: var(--color-flame-600);
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.08));
		transform: scale(1.05);
	}

	:global(.dark) .close-button:hover {
		color: var(--color-flame-400);
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(168, 85, 247, 0.12));
	}

	/* Content */
	.sheet-content {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
		/* Smooth scrolling */
		-webkit-overflow-scrolling: touch;
		/* Allow scrolling in content area */
		touch-action: pan-y;
		user-select: text;
		/* Subtle background for better readability */
		background: rgba(249, 250, 251, 0.5);
	}

	:global(.dark) .sheet-content {
		background: rgba(0, 0, 0, 0.2);
	}

	/* Footer */
	.sheet-footer {
		padding: 1rem 1.5rem;
		background: var(--color-gray-50);
		border-top: 1px solid var(--color-gray-200);
		flex-shrink: 0;
	}

	:global(.dark) .sheet-footer {
		background: rgba(0, 0, 0, 0.2);
		border-top-color: rgba(255, 255, 255, 0.1);
	}

	/* Width utilities */
	.max-w-sm {
		max-width: 24rem;
	}

	.max-w-md {
		max-width: 28rem;
	}

	.max-w-2xl {
		max-width: 42rem;
	}

	.max-w-full {
		max-width: 100%;
	}
</style>
