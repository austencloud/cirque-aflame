// lib/utils/pdfGenerator.ts
import type { Contract } from '$lib/modules/contract-generator/contract';
import { generateHtmlContract } from './htmlGenerator';
import type { ThemeName } from '$lib/modules/contract-generator/theme';
import { saveAs } from 'file-saver';

export async function generateAndDownloadPdf(
	contract: Contract,
	filename: string,
	themeName: ThemeName
): Promise<void> {
	try {
		// Generate HTML
		const htmlContent = generateHtmlContract(contract, themeName);

		// Create a blob from the HTML
		const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

		// Create an iframe to render the HTML
		const iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		document.body.appendChild(iframe);

		const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
		if (!iframeDoc) {
			throw new Error('Could not access iframe document');
		}

		// Write HTML to iframe
		iframeDoc.open();
		iframeDoc.write(htmlContent);
		iframeDoc.close();

		// Wait for content to load
		await new Promise((resolve) => {
			iframe.onload = resolve;
			setTimeout(resolve, 1000); // Fallback timeout
		});

		// Use browser's print to PDF functionality
		iframe.contentWindow?.print();

		// Clean up
		setTimeout(() => {
			document.body.removeChild(iframe);
		}, 100);
	} catch (error) {
		console.error('Error generating PDF:', error);
		throw error;
	}
}

export function downloadContractAsJson(contract: Contract, filename: string): void {
	const json = JSON.stringify(contract, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	saveAs(blob, filename);
}

export function loadContractFromJson(file: File): Promise<Contract> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const json = event.target?.result as string;
				const contract = JSON.parse(json) as Contract;
				resolve(contract);
			} catch (error) {
				reject(new Error('Failed to parse JSON file'));
			}
		};
		reader.onerror = () => {
			reject(new Error('Failed to read file'));
		};
		reader.readAsText(file);
	});
}
