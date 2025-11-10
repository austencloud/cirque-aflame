// lib/utils/htmlGenerator.ts
import type { Contract } from '$lib/modules/contract-generator/contract';
import type { ThemeName } from '$lib/modules/contract-generator/theme';
import { THEMES } from '$lib/modules/contract-generator/theme';

function getThemeColors(themeName: ThemeName) {
	return THEMES[themeName]?.colors || THEMES.Professional.colors;
}

export function generateHtmlContract(contract: Contract, themeName: ThemeName): string {
	const colors = getThemeColors(themeName);

	const html = `
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
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: ${colors.primary};
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${contract.title}</h1>
                <div class="subtitle">${contract.subtitle}</div>
                <div style="margin-top: 10px; font-size: 12px;">
                    Effective Date: ${contract.effective_date}
                </div>
            </div>
            
            <h2>Parties to the Agreement</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Performer:</span>
                    <div class="field-value">${contract.performer_name}</div>
                </div>
                <div class="field">
                    <span class="field-label">Client:</span>
                    <div class="field-value">
                        ${contract.client.name}<br>
                        ${contract.client.title}<br>
                        Phone: ${contract.client.phone}<br>
                        Email: ${contract.client.email}
                    </div>
                </div>
                <div class="field">
                    <span class="field-label">Producer:</span>
                    <div class="field-value">
                        ${contract.producer.name}<br>
                        ${contract.producer.company}<br>
                        Phone: ${contract.producer.phone}<br>
                        Email: ${contract.producer.email}
                    </div>
                </div>
            </div>
            
            <h2>Event Details</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Location:</span>
                    <div class="field-value">${contract.event.location}</div>
                </div>
                <div class="field">
                    <span class="field-label">Date:</span>
                    <div class="field-value">${contract.event.date}</div>
                </div>
            </div>
            
            <h2>Services</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Performance Type:</span>
                    <div class="field-value">${contract.services.performance_type}</div>
                </div>
                <div class="field">
                    <span class="field-label">Duration:</span>
                    <div class="field-value">${contract.services.duration_minutes} minutes</div>
                </div>
                <div class="field">
                    <span class="field-label">Performance Time:</span>
                    <div class="field-value">${contract.services.performance_time}</div>
                </div>
                <div class="field">
                    <span class="field-label">Costume:</span>
                    <div class="field-value">${contract.services.costume}</div>
                </div>
                <div class="field">
                    <span class="field-label">Music Provided By:</span>
                    <div class="field-value">${contract.services.music_provided_by}</div>
                </div>
                ${
									contract.services.music_notes
										? `<div class="field"><span class="field-label">Music Notes:</span><div class="field-value">${contract.services.music_notes}</div></div>`
										: ''
								}
                ${
									contract.services.additional_services
										? `<div class="field"><span class="field-label">Additional Services:</span><div class="field-value">${contract.services.additional_services}</div></div>`
										: ''
								}
            </div>
            
            <h2>Fees</h2>
            <div class="section">
                <table>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                    <tr>
                        <td>Total Fee</td>
                        <td>$${contract.fees.total_fee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Deposit Required</td>
                        <td>${contract.fees.requires_deposit ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <td>Deposit Amount</td>
                        <td>$${contract.fees.deposit_amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Remaining Balance</td>
                        <td>$${contract.fees.balance.toFixed(2)}</td>
                    </tr>
                </table>
                <div class="field">
                    <span class="field-label">Payment Methods:</span>
                    <div class="field-value">${contract.fees.payment_methods}</div>
                </div>
                <div class="field">
                    <span class="field-label">Payment Terms:</span>
                    <div class="field-value">${contract.fees.payment_terms}</div>
                </div>
            </div>
            
            <h2>Schedule</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Performer Arrival:</span>
                    <div class="field-value">${
											contract.schedule.arrival_minutes_before
										} minutes before performance</div>
                </div>
                <div class="field">
                    <span class="field-label">Setup Time Required:</span>
                    <div class="field-value">${contract.schedule.setup_minutes} minutes</div>
                </div>
                <div class="field">
                    <span class="field-label">Late Arrival Policy:</span>
                    <div class="field-value">${contract.schedule.late_policy}</div>
                </div>
                <div class="field">
                    <span class="field-label">Schedule Changes Policy:</span>
                    <div class="field-value">${contract.schedule.changes_policy}</div>
                </div>
            </div>
            
            <h2>Cancellation Policy</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Client Cancellation:</span>
                    <div class="field-value">${contract.cancellation.client_policy}</div>
                </div>
                <div class="field">
                    <span class="field-label">Producer Cancellation:</span>
                    <div class="field-value">${contract.cancellation.producer_policy}</div>
                </div>
                <div class="field">
                    <span class="field-label">Force Majeure:</span>
                    <div class="field-value">${contract.cancellation.force_majeure}</div>
                </div>
            </div>
            
            <h2>Obligations</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">Producer Obligations:</span>
                    <div class="field-value">${contract.obligations.producer_obligations}</div>
                </div>
                <div class="field">
                    <span class="field-label">Client Obligations:</span>
                    <div class="field-value">${contract.obligations.client_obligations}</div>
                </div>
                <div class="field">
                    <span class="field-label">Venue Requirements:</span>
                    <div class="field-value">${contract.obligations.venue_requirements}</div>
                </div>
            </div>
            
            <h2>Health & Safety</h2>
            <div class="section">
                <div class="field">
                    <span class="field-label">General Safety Policy:</span>
                    <div class="field-value">${contract.safety.general_safety_policy}</div>
                </div>
                <div class="field">
                    <span class="field-label">Specific Safety Requirements:</span>
                    <div class="field-value">${contract.safety.specific_requirements}</div>
                </div>
                <div class="field">
                    <span class="field-label">Liability Terms:</span>
                    <div class="field-value">${contract.safety.liability_terms}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

	return html;
}
