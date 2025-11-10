/**
 * Preview Service Implementation
 * Handles contract preview generation, printing, and file operations
 */

import type { IPreviewService } from '../contracts/IPreviewService';
import type { Contract } from '../../../contract';
import type { ThemeName } from '../../../theme';
import { THEMES } from '../../../theme';
import { saveAs } from 'file-saver';

export class PreviewService implements IPreviewService {
	/**
	 * Generate HTML preview of contract with theme
	 */
	generateHtml(contract: Contract, themeName: ThemeName): string {
		const theme = THEMES[themeName] || THEMES.Professional;
		const colors = theme.colors;

		return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${contract.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: ${colors.text};
            background-color: ${colors.background};
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: ${colors.primary};
            text-align: center;
            border-bottom: 3px solid ${colors.accent};
            padding-bottom: 10px;
        }
        h2 {
            color: ${colors.secondary};
            margin-top: 30px;
            border-left: 4px solid ${colors.accent};
            padding-left: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .subtitle {
            color: ${colors.secondary};
            font-size: 14px;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: ${colors.primary};
        }
        .field-value {
            margin-left: 20px;
            white-space: pre-wrap;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid ${colors.border};
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: ${colors.primary};
            color: white;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid ${colors.text};
            margin-top: 50px;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${contract.title}</h1>
            <div class="subtitle">${contract.subtitle}</div>
            <div class="subtitle">Effective Date: ${contract.effective_date}</div>
        </div>

        <h2>Parties</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Performer:</div>
                <div class="field-value">${contract.performer_name}</div>
            </div>
            <div class="field">
                <div class="field-label">Client:</div>
                <div class="field-value">
                    ${contract.client.name}<br>
                    ${contract.client.title}<br>
                    Email: ${contract.client.email}<br>
                    Phone: ${contract.client.phone}
                </div>
            </div>
            <div class="field">
                <div class="field-label">Producer:</div>
                <div class="field-value">
                    ${contract.producer.name}<br>
                    ${contract.producer.company}<br>
                    Email: ${contract.producer.email}<br>
                    Phone: ${contract.producer.phone}
                </div>
            </div>
        </div>

        <h2>Event Details</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Location:</div>
                <div class="field-value">${contract.event.location}</div>
            </div>
            <div class="field">
                <div class="field-label">Date:</div>
                <div class="field-value">${contract.event.date}</div>
            </div>
        </div>

        <h2>Services</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Performance Type:</div>
                <div class="field-value">${contract.services.performance_type}</div>
            </div>
            <div class="field">
                <div class="field-label">Duration:</div>
                <div class="field-value">${contract.services.duration_minutes} minutes</div>
            </div>
            <div class="field">
                <div class="field-label">Performance Time:</div>
                <div class="field-value">${
									contract.services.time_tbd ? 'TBD' : contract.services.performance_time
								}</div>
            </div>
            <div class="field">
                <div class="field-label">Costume:</div>
                <div class="field-value">${contract.services.costume}</div>
            </div>
            <div class="field">
                <div class="field-label">Music Provided By:</div>
                <div class="field-value">${contract.services.music_provided_by}</div>
            </div>
            ${
							contract.services.music_notes
								? `
            <div class="field">
                <div class="field-label">Music Notes:</div>
                <div class="field-value">${contract.services.music_notes}</div>
            </div>
            `
								: ''
						}
            ${
							contract.services.additional_services
								? `
            <div class="field">
                <div class="field-label">Additional Services:</div>
                <div class="field-value">${contract.services.additional_services}</div>
            </div>
            `
								: ''
						}
        </div>

        <h2>Fees and Payment</h2>
        <div class="section">
            <table>
                <tr>
                    <th>Item</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>Total Fee</td>
                    <td>$${contract.fees.total_fee.toFixed(2)}</td>
                </tr>
                ${
									contract.fees.requires_deposit
										? `
                <tr>
                    <td>Deposit Required</td>
                    <td>$${contract.fees.deposit_amount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Balance Due</td>
                    <td>$${contract.fees.balance.toFixed(2)}</td>
                </tr>
                `
										: ''
								}
            </table>
            <div class="field">
                <div class="field-label">Payment Methods:</div>
                <div class="field-value">${contract.fees.payment_methods}</div>
            </div>
            <div class="field">
                <div class="field-label">Payment Terms:</div>
                <div class="field-value">${contract.fees.payment_terms}</div>
            </div>
        </div>

        <h2>Schedule</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Arrival Time:</div>
                <div class="field-value">${
									contract.schedule.arrival_minutes_before
								} minutes before performance</div>
            </div>
            <div class="field">
                <div class="field-label">Setup Time:</div>
                <div class="field-value">${contract.schedule.setup_minutes} minutes</div>
            </div>
            <div class="field">
                <div class="field-label">Late Policy:</div>
                <div class="field-value">${contract.schedule.late_policy}</div>
            </div>
            <div class="field">
                <div class="field-label">Changes Policy:</div>
                <div class="field-value">${contract.schedule.changes_policy}</div>
            </div>
        </div>

        <h2>Obligations</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Producer Obligations:</div>
                <div class="field-value">${contract.obligations.producer_obligations}</div>
            </div>
            <div class="field">
                <div class="field-label">Client Obligations:</div>
                <div class="field-value">${contract.obligations.client_obligations}</div>
            </div>
            <div class="field">
                <div class="field-label">Venue Requirements:</div>
                <div class="field-value">${contract.obligations.venue_requirements}</div>
            </div>
        </div>

        <h2>Cancellation Policy</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">Client Cancellation:</div>
                <div class="field-value">${contract.cancellation.client_policy}</div>
            </div>
            <div class="field">
                <div class="field-label">Producer Cancellation:</div>
                <div class="field-value">${contract.cancellation.producer_policy}</div>
            </div>
            <div class="field">
                <div class="field-label">Force Majeure:</div>
                <div class="field-value">${contract.cancellation.force_majeure}</div>
            </div>
        </div>

        <h2>Safety and Liability</h2>
        <div class="section">
            <div class="field">
                <div class="field-label">General Safety Policy:</div>
                <div class="field-value">${contract.safety.general_safety_policy}</div>
            </div>
            <div class="field">
                <div class="field-label">Specific Requirements:</div>
                <div class="field-value">${contract.safety.specific_requirements}</div>
            </div>
            <div class="field">
                <div class="field-label">Liability Terms:</div>
                <div class="field-value">${contract.safety.liability_terms}</div>
            </div>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line">
                    Performer Signature
                </div>
                <div style="margin-top: 10px;">Date: _____________</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">
                    Client Signature
                </div>
                <div style="margin-top: 10px;">Date: _____________</div>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
	}

	/**
	 * Print the HTML content
	 */
	print(htmlContent: string): void {
		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			throw new Error('Could not open print window. Please check popup blocker settings.');
		}

		printWindow.document.write(htmlContent);
		printWindow.document.close();

		// Wait for content to load before printing
		printWindow.onload = () => {
			printWindow.print();
		};
	}

	/**
	 * Download contract as JSON file
	 */
	downloadAsJson(contract: Contract, filename: string): void {
		const json = JSON.stringify(contract, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		saveAs(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
	}

	/**
	 * Load contract from JSON file
	 */
	async loadFromJson(file: File): Promise<Contract> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const content = e.target?.result as string;
					const contract = JSON.parse(content) as Contract;
					resolve(contract);
				} catch (error) {
					reject(new Error('Invalid JSON file format'));
				}
			};

			reader.onerror = () => {
				reject(new Error('Failed to read file'));
			};

			reader.readAsText(file);
		});
	}
}
