<script lang="ts">
	import type { PreviewStateInterface } from '../state';
	interface Props {
		previewState: PreviewStateInterface;
		onClose?: () => void;
	}
	const { previewState, onClose }: Props = $props();
</script>

{#if previewState.isOpen}
	<div class="preview-window">
		<div class="toolbar">
			<div class="zoom-controls">
				<button onclick={() => previewState.zoomOut()}>−</button>
				<button onclick={() => previewState.resetZoom()}
					>{Math.round(previewState.zoomLevel * 100)}%</button
				> <button onclick={() => previewState.zoomIn()}>+</button>
			</div>
			<div class="action-buttons">
				<button onclick={() => previewState.print()}>Print</button>
				<button
					onclick={() => {
						previewState.close();
						onClose?.();
					}}
				>
					Close
				</button>
			</div>
		</div>
		<div class="preview-content" style="transform: scale({previewState.zoomLevel})">
			{@html previewState.htmlContent}
		</div>
	</div>
{/if}

<style>
	.preview-window {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #f5f5f5;
	}
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background-color: #fff;
		border-bottom: 1px solid #ddd;
		gap: 20px;
	}
	.zoom-controls,
	.action-buttons {
		display: flex;
		gap: 5px;
	}
	button {
		padding: 6px 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #fff;
		cursor: pointer;
		font-size: 14px;
	}
	button:hover {
		background-color: #f0f0f0;
	}
	button:active {
		background-color: #e0e0e0;
	}
	.preview-content {
		flex: 1;
		overflow: auto;
		padding: 20px;
		transform-origin: top center;
	}
	:global(.preview-content .container) {
		background-color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
</style>
