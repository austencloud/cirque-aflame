<script lang="ts">
	import { createAppState } from '../state/index';
	import { ContractEditor } from '../../contract/index';
	import { ThemeSelector } from '../../theme/index';
	import { PreviewWindow } from '../../preview/index';
	const appState = createAppState();
	function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			appState.loadContract(file);
		}
	}
</script>

<div class="main-window">
	<header class="header">
		<div class="header-left"><h1>Contract Generator</h1></div>
		<div class="header-right"><ThemeSelector /></div>
	</header>
	<div class="toolbar">
		<div class="button-group">
			<button onclick={() => appState.generatePreview()} class="btn-primary"> Preview </button>
			<button onclick={() => appState.saveContract()} class="btn-secondary"> Save </button>
			<label class="btn-secondary">
				Load <input type="file" accept=".json" onchange={handleFileUpload} style="display: none;" />
			</label>
		</div>
	</div>
	<div class="content">
		{#if appState.activeTab === 'editor'}
			<ContractEditor />
		{:else if appState.activeTab === 'preview'}
			<PreviewWindow
				previewState={appState.previewState}
				onClose={() => appState.setActiveTab('editor')}
			/>
		{/if}
	</div>
</div>

<style>
	.main-window {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #fafafa;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		background: white;
		border-bottom: 1px solid #ddd;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	.header-left h1 {
		margin: 0;
		font-size: 24px;
		color: #333;
	}
	.header-right {
		display: flex;
		gap: 15px;
		align-items: center;
	}
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
		background: white;
		border-bottom: 1px solid #eee;
		gap: 10px;
	}
	.button-group {
		display: flex;
		gap: 8px;
	}
	button,
	label {
		padding: 8px 16px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s;
	}
	button:hover,
	label:hover {
		background: #f5f5f5;
		border-color: #999;
	}
	.btn-primary {
		background: #2196f3;
		color: white;
		border-color: #2196f3;
	}
	.btn-primary:hover {
		background: #1976d2;
		border-color: #1976d2;
	}
	.btn-secondary {
		background: white;
		color: #333;
	}
	.content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>
