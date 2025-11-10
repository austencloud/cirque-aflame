import type { Contract } from '../../../contract/index';
import type { ThemeName } from '../../../theme/index';

export interface IPreviewService {
	generateHtml(contract: Contract, themeName: ThemeName): string;
	print(htmlContent: string): void;
	downloadAsJson(contract: Contract, filename: string): void;
	loadFromJson(file: File): Promise<Contract>;
}
