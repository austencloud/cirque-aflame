import { PreviewService } from '../services';
import type { Contract } from '../../contract/index';
import type { ThemeName } from '../../theme/index';

export interface PreviewStateInterface {
	isOpen: boolean;
	zoomLevel: number;
	htmlContent: string;
	open: () => void;
	close: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: () => void;
	generatePreview: (contract: Contract, themeName: ThemeName) => void;
	print: () => void;
	downloadAsJson: (contract: Contract, filename: string) => void;
	loadFromJson: (file: File) => Promise<Contract>;
}

export function createPreviewState(): PreviewStateInterface {
	const previewService = new PreviewService();

	let isOpen = $state(false);
	let zoomLevel = $state(1);
	let htmlContent = $state('');

	return {
		get isOpen() {
			return isOpen;
		},
		get zoomLevel() {
			return zoomLevel;
		},
		get htmlContent() {
			return htmlContent;
		},
		open() {
			isOpen = true;
		},
		close() {
			isOpen = false;
		},
		zoomIn() {
			zoomLevel = Math.min(zoomLevel + 0.1, 2);
		},
		zoomOut() {
			zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
		},
		resetZoom() {
			zoomLevel = 1;
		},
		generatePreview(contract: Contract, themeName: ThemeName) {
			htmlContent = previewService.generateHtml(contract, themeName);
			isOpen = true;
		},
		print() {
			previewService.print(htmlContent);
		},
		downloadAsJson(contract: Contract, filename: string) {
			previewService.downloadAsJson(contract, filename);
		},
		async loadFromJson(file: File) {
			return previewService.loadFromJson(file);
		}
	};
}
