import { createContractState } from '../../contract/index';
import { createThemeState } from '../../theme/index';
import { createPreviewState } from '../../preview/index';
import type { AppTab } from '../domain';

export interface AppStateInterface {
	activeTab: AppTab;
	contractState: ReturnType<typeof createContractState>;
	themeState: ReturnType<typeof createThemeState>;
	previewState: ReturnType<typeof createPreviewState>;
	setActiveTab: (tab: AppTab) => void;
	generatePreview: () => void;
	saveContract: () => void;
	loadContract: (file: File) => Promise<void>;
}

export function createAppState(): AppStateInterface {
	const contractState = createContractState();
	const themeState = createThemeState();
	const previewState = createPreviewState();

	let activeTab = $state<AppTab>('editor');

	return {
		get activeTab() {
			return activeTab;
		},
		contractState,
		themeState,
		previewState,
		setActiveTab(tab: AppTab) {
			activeTab = tab;
		},
		generatePreview() {
			previewState.generatePreview(contractState.contract, themeState.currentTheme);
			activeTab = 'preview';
		},
		saveContract() {
			const json = contractState.exportToJSON();
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `contract-${Date.now()}.json`;
			link.click();
			URL.revokeObjectURL(url);
		},
		async loadContract(file: File) {
			try {
				const contract = await previewState.loadFromJson(file);
				contractState.loadContract(contract);
			} catch (error) {
				console.error('Failed to load contract:', error);
			}
		}
	};
}
