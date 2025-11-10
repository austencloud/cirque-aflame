<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faMicrophone,
		faMicrophoneSlash,
		faSpinner,
		faCheckCircle,
		faTimesCircle,
		faUpload
	} from '@fortawesome/free-solid-svg-icons';
	import { db } from '$lib/firebase';
	import { collection, doc, setDoc } from 'firebase/firestore';
	interface ParsedEntities {
		clients?: Array<{
			type: 'organization' | 'individual';
			name: string;
			email?: string | null;
			phone?: string | null;
			address?: string | null;
			notes?: string;
		}>;
		performers?: Array<{
			name: string;
			email?: string | null;
			phone?: string | null;
			skills?: string[];
			rate?: number | null;
			availability?: string;
			notes?: string;
		}>;
		agents?: Array<{
			name: string;
			email?: string | null;
			phone?: string | null;
			commission?: number;
			notes?: string;
		}>;
		events?: Array<{
			title: string;
			type?: string;
			date: string;
			location?: string;
			fee?: number;
			clientName?: string;
			performerNames?: string[];
			status?: string;
			notes?: string;
		}>;
		contracts?: Array<{
			clientName?: string;
			performerNames?: string[];
			startDate: string;
			endDate?: string | null;
			fee?: number;
			terms?: string;
			status?: string;
		}>;
	}
	let isRecording = $state(false);
	let isProcessing = $state(false);
	let isUploading = $state(false);
	let transcript = $state('');
	let parsedEntities: ParsedEntities | null = $state(null);
	let error = $state('');
	let success = $state('');
	let recognition: any = null;

	// Check for browser support - only in browser to avoid SSR issues
	const speechRecognitionSupported =
		typeof window !== 'undefined' &&
		('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

	function startRecording() {
		if (!speechRecognitionSupported) {
			error = 'Speech recognition is not supported in your browser. Try Chrome or Edge.';
			return;
		}

		error = '';
		success = '';
		parsedEntities = null;
		transcript = '';

		// @ts-ignore - SpeechRecognition types
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onstart = () => {
			isRecording = true;
		};

		recognition.onresult = (event) => {
			let interimTranscript = '';
			let finalTranscript = '';

			for (let i = 0; i < event.results.length; i++) {
				const transcriptPiece = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					finalTranscript += transcriptPiece + ' ';
				} else {
					interimTranscript += transcriptPiece;
				}
			}

			transcript = (finalTranscript + interimTranscript).trim();
		};

		recognition.onerror = (event) => {
			console.error('Speech recognition error:', event.error);
			error = `Recognition error: ${event.error}`;
			isRecording = false;
		};

		recognition.onend = () => {
			isRecording = false;
		};

		recognition.start();
	}

	function stopRecording() {
		if (recognition) {
			recognition.stop();
			isRecording = false;
		}
	}

	async function processTranscript() {
		if (!transcript.trim()) {
			error = 'No transcript to process';
			return;
		}

		isProcessing = true;
		error = '';
		success = '';
		parsedEntities = null;

		try {
			const response = await fetch('/api/import-natural-language', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: transcript })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to process transcript');
			}

			parsedEntities = data.entities;
			success = 'Successfully parsed your input!';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process transcript';
			console.error('Error processing transcript:', err);
		} finally {
			isProcessing = false;
		}
	}

	async function uploadToFirebase() {
		if (!parsedEntities) return;

		isUploading = true;
		error = '';
		success = '';

		try {
			const clientsByName = new Map<string, string>();
			const performersByName = new Map<string, string>();
			let totalWritten = 0;

			const createId = (type: string) =>
				`${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
			const now = new Date().toISOString();

			// Create clients
			if (parsedEntities.clients?.length) {
				for (const item of parsedEntities.clients) {
					const id = createId('client');
					const entity = {
						id,
						type: item.type || 'organization',
						name: item.name,
						email: item.email || null,
						phone: item.phone || null,
						address: item.address || null,
						notes: item.notes || '',
						createdAt: now,
						updatedAt: now
					};
					await setDoc(doc(db, 'clients', id), entity);
					clientsByName.set(item.name.toLowerCase(), id);
					totalWritten++;
				}
			}

			// Create performers
			if (parsedEntities.performers?.length) {
				for (const item of parsedEntities.performers) {
					const id = createId('performer');
					const entity = {
						id,
						name: item.name,
						email: item.email || null,
						phone: item.phone || null,
						skills: item.skills || [],
						rate: item.rate || null,
						availability: item.availability || 'available',
						notes: item.notes || '',
						createdAt: now,
						updatedAt: now
					};
					await setDoc(doc(db, 'performers', id), entity);
					performersByName.set(item.name.toLowerCase(), id);
					totalWritten++;
				}
			}

			// Create agents
			if (parsedEntities.agents?.length) {
				for (const item of parsedEntities.agents) {
					const id = createId('agent');
					const entity = {
						id,
						name: item.name,
						email: item.email || null,
						phone: item.phone || null,
						commission: item.commission || 15,
						notes: item.notes || '',
						createdAt: now,
						updatedAt: now
					};
					await setDoc(doc(db, 'agents', id), entity);
					totalWritten++;
				}
			}

			// Create events with relationships
			if (parsedEntities.events?.length) {
				for (const item of parsedEntities.events) {
					const id = createId('event');
					const entity = {
						id,
						title: item.title,
						type: item.type || 'performance',
						date: item.date,
						location: item.location || '',
						fee: item.fee || 0,
						clientId: item.clientName
							? clientsByName.get(item.clientName.toLowerCase()) || null
							: null,
						performerIds: item.performerNames
							? item.performerNames
									.map((name) => performersByName.get(name.toLowerCase()))
									.filter(Boolean)
							: [],
						status: item.status || 'completed',
						notes: item.notes || '',
						createdAt: now,
						updatedAt: now
					};
					await setDoc(doc(db, 'events', id), entity);
					totalWritten++;
				}
			}

			// Create contracts with relationships
			if (parsedEntities.contracts?.length) {
				for (const item of parsedEntities.contracts) {
					const id = createId('contract');
					const entity = {
						id,
						clientId: item.clientName
							? clientsByName.get(item.clientName.toLowerCase()) || null
							: null,
						performerIds: item.performerNames
							? item.performerNames
									.map((name) => performersByName.get(name.toLowerCase()))
									.filter(Boolean)
							: [],
						startDate: item.startDate,
						endDate: item.endDate || null,
						fee: item.fee || 0,
						terms: item.terms || '',
						status: item.status || 'draft',
						createdAt: now,
						updatedAt: now
					};
					await setDoc(doc(db, 'contracts', id), entity);
					totalWritten++;
				}
			}

			success = `Successfully added ${totalWritten} items to your database!`;

			setTimeout(() => {
				transcript = '';
				parsedEntities = null;
				success = '';
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to upload to Firebase';
			console.error('Error uploading to Firebase:', err);
		} finally {
			isUploading = false;
		}
	}

	function clear() {
		transcript = '';
		parsedEntities = null;
		error = '';
		success = '';
	}

	$effect(() => {
		if (parsedEntities) {
			const total =
				(parsedEntities.clients?.length || 0) +
				(parsedEntities.performers?.length || 0) +
				(parsedEntities.agents?.length || 0) +
				(parsedEntities.events?.length || 0) +
				(parsedEntities.contracts?.length || 0);
		}
	});
</script>

<div class="voice-import-widget">
	<div class="header">
		<h3>🎤 Voice Data Import</h3>
		<p class="subtitle">Speak naturally about your clients, performers, and events</p>
	</div>
	<!-- Recording Controls -->
	<div class="controls">
		{#if !isRecording}
			<button onclick={startRecording} class="btn-mic" disabled={isProcessing || isUploading}>
				<Fa icon={faMicrophone} size="lg" /> <span>Start Recording</span>
			</button>
		{:else}
			<button onclick={stopRecording} class="btn-mic recording">
				<Fa icon={faMicrophoneSlash} size="lg" /> <span>Stop Recording</span>
			</button>
		{/if}
		{#if transcript && !isRecording}
			<button
				onclick={processTranscript}
				class="btn-process"
				disabled={isProcessing || isUploading}
			>
				{#if isProcessing}
					<Fa icon={faSpinner} class="spinner" spin /> <span>Processing...</span>
				{:else}
					<span>Process with AI</span>
				{/if}
			</button>
		{/if}
		{#if transcript}
			<button onclick={clear} class="btn-clear" disabled={isProcessing || isUploading}>
				Clear
			</button>
		{/if}
	</div>
	<!-- Transcript Display -->
	{#if transcript}
		<div class="transcript">
			<h4>📝 Transcript</h4>
			<div class="transcript-text">{transcript}</div>
		</div>
	{/if}
	<!-- Status Messages -->
	{#if error}
		<div class="message error"><Fa icon={faTimesCircle} /> <span>{error}</span></div>
	{/if}
	{#if success}
		<div class="message success"><Fa icon={faCheckCircle} /> <span>{success}</span></div>
	{/if}
	<!-- Parsed Data Preview -->
	{#if parsedEntities}
		<div class="parsed-data">
			<div class="parsed-header">
				<h4>✨ AI Extracted Data</h4>
				<button onclick={uploadToFirebase} class="btn-upload" disabled={isUploading}>
					{#if isUploading}
						<Fa icon={faSpinner} class="spinner" spin /> <span>Uploading...</span>
					{:else}
						<Fa icon={faUpload} /> <span>Add to Database</span>
					{/if}
				</button>
			</div>
			<div class="entity-">
				{#if parsedEntities.clients?.length}
					<div class="entity-card">
						<h5>👥 Clients ({parsedEntities.clients.length})</h5>
						<ul>
							{#each parsedEntities.clients as client}
								<li>
									<strong>{client.name}</strong>
									{#if client.email}<br /><small>{client.email}</small>{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if parsedEntities.performers?.length}
					<div class="entity-card">
						<h5>🎭 Performers ({parsedEntities.performers.length})</h5>
						<ul>
							{#each parsedEntities.performers as performer}
								<li>
									<strong>{performer.name}</strong>
									{#if performer.skills?.length}
										<br /><small>{performer.skills.join(', ')}</small>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if parsedEntities.agents?.length}
					<div class="entity-card">
						<h5>💼 Agents ({parsedEntities.agents.length})</h5>
						<ul>
							{#each parsedEntities.agents as agent}
								<li>
									<strong>{agent.name}</strong> <small>({agent.commission}% commission)</small>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if parsedEntities.events?.length}
					<div class="entity-card">
						<h5>🎪 Events ({parsedEntities.events.length})</h5>
						<ul>
							{#each parsedEntities.events as event}
								<li>
									<strong>{event.title}</strong> <br /><small
										>{new Date(event.date).toLocaleDateString()}</small
									>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if parsedEntities.contracts?.length}
					<div class="entity-card">
						<h5>📄 Contracts ({parsedEntities.contracts.length})</h5>
						<ul>
							{#each parsedEntities.contracts as contract}
								<li>
									<strong>{contract.clientName || 'Unknown'}</strong>
									<small>({contract.status})</small>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if !speechRecognitionSupported}
		<div class="message warning">
			<span>⚠️ Speech recognition is not supported in your browser. Please use Chrome or Edge.</span
			>
		</div>
	{/if}
</div>

<style>
	.voice-import-widget {
		position: relative;
		background: white;
		border-radius: var(--radius-2xl);
		padding: 2rem;
		box-shadow: var(--shadow-soft-lg);
		border: 1px solid var(--color-gray-200);
		overflow: hidden;
		transition: all var(--transition-base);
	}
	:global(.dark) .voice-import-widget {
		background: var(--color-gray-100);
		border-color: var(--color-gray-200);
	}
	.voice-import-widget::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			to right,
			var(--color-royal-500),
			var(--color-flame-500),
			var(--color-gold-500)
		);
	}
	.header {
		margin-bottom: 1.5rem;
	}
	.header h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--color-gray-900);
	}
	:global(.dark) .header h3 {
		color: var(--color-gray-900);
	}
	.subtitle {
		color: var(--color-gray-600);
		font-size: 0.875rem;
		margin: 0;
		line-height: 1.5;
	}
	:global(.dark) .subtitle {
		color: var(--color-gray-700);
	}
	.controls {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}
	.btn-mic {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: 0.875rem 1.75rem;
		border: none;
		border-radius: var(--radius-xl);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-base);
		background: linear-gradient(135deg, var(--color-royal-500) 0%, var(--color-royal-600) 100%);
		color: white;
		box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
		font-family: 'Inter', sans-serif;
	}
	.btn-mic:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-royal-glow);
	}
	.btn-mic.recording {
		background: linear-gradient(135deg, var(--color-flame-500) 0%, var(--color-flame-600) 100%);
		box-shadow: var(--shadow-glow);
		animation: pulse 2s infinite;
	}
	.btn-mic.recording:hover:not(:disabled) {
		box-shadow: var(--shadow-glow-lg);
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}
	.btn-process {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: 0.875rem 1.75rem;
		border: 2px solid var(--color-royal-500);
		border-radius: var(--radius-xl);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-base);
		background: white;
		color: var(--color-royal-500);
		font-family: 'Inter', sans-serif;
	}
	:global(.dark) .btn-process {
		background: var(--color-gray-100);
		border-color: var(--color-royal-400);
		color: var(--color-royal-400);
	}
	.btn-process:hover:not(:disabled) {
		background: var(--color-royal-500);
		color: white;
		box-shadow: var(--shadow-royal-glow);
		transform: translateY(-2px);
	}
	.btn-clear {
		padding: 0.875rem 1.75rem;
		border: 1px solid var(--color-gray-300);
		border-radius: var(--radius-xl);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		background: white;
		color: var(--color-gray-600);
		transition: all var(--transition-base);
		font-family: 'Inter', sans-serif;
	}
	:global(.dark) .btn-clear {
		background: var(--color-gray-100);
		border-color: var(--color-gray-200);
		color: var(--color-gray-700);
	}
	.btn-clear:hover:not(:disabled) {
		background: var(--color-gray-100);
		border-color: var(--color-gray-400);
		transform: translateY(-1px);
	}
	.btn-upload {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: var(--radius-lg);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		background: linear-gradient(135deg, var(--color-green-500) 0%, #059669 100%);
		color: white;
		transition: all var(--transition-base);
		box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
		font-family: 'Inter', sans-serif;
	}
	.btn-upload:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	:global(.spinner) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.transcript {
		background: var(--color-gray-50);
		border: 1px solid var(--color-gray-200);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
		margin-bottom: var(--spacing-lg);
		transition: all var(--transition-base);
	}
	:global(.dark) .transcript {
		background: var(--color-gray-50);
		border-color: var(--color-gray-200);
	}
	.transcript:hover {
		border-color: var(--color-royal-300);
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
	}
	.transcript h4 {
		font-size: 0.875rem;
		font-weight: 700;
		margin: 0 0 0.75rem 0;
		color: var(--color-gray-800);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	:global(.dark) .transcript h4 {
		color: var(--color-gray-800);
	}
	.transcript-text {
		color: var(--color-gray-900);
		line-height: 1.7;
		max-height: 200px;
		overflow-y: auto;
		font-size: 0.9375rem;
	}
	:global(.dark) .transcript-text {
		color: var(--color-gray-900);
	} /* Custom scrollbar for transcript */
	.transcript-text::-webkit-scrollbar {
		width: 0.5rem;
	}
	.transcript-text::-webkit-scrollbar-track {
		background: var(--color-gray-100);
		border-radius: var(--radius-full);
	}
	.transcript-text::-webkit-scrollbar-thumb {
		background: var(--color-royal-300);
		border-radius: var(--radius-full);
	}
	.transcript-text::-webkit-scrollbar-thumb:hover {
		background: var(--color-royal-400);
	}
	.message {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: 1rem 1.25rem;
		border-radius: var(--radius-lg);
		margin-bottom: var(--spacing-lg);
		font-weight: 500;
		font-size: 0.9375rem;
		animation: slideIn 0.3s ease-out;
	}
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.message.error {
		background: linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
		border: 1px solid var(--color-red-400);
		color: var(--color-red-500);
	}
	:global(.dark) .message.error {
		background: linear-gradient(to right, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08));
	}
	.message.success {
		background: linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
		border: 1px solid var(--color-green-400);
		color: var(--color-green-500);
	}
	:global(.dark) .message.success {
		background: linear-gradient(to right, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.08));
	}
	.message.warning {
		background: linear-gradient(to right, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
		border: 1px solid var(--color-amber-400);
		color: var(--color-amber-500);
	}
	:global(.dark) .message.warning {
		background: linear-gradient(to right, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
	}
	.parsed-data {
		background: linear-gradient(to bottom, var(--color-gray-50), white);
		border: 2px solid var(--color-gray-200);
		border-radius: var(--radius-xl);
		padding: 1.5rem;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
		animation: slideIn 0.3s ease-out;
	}
	:global(.dark) .parsed-data {
		background: linear-gradient(to bottom, var(--color-gray-50), var(--color-gray-100));
		border-color: var(--color-gray-200);
	}
	.parsed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--color-gray-200);
	}
	:global(.dark) .parsed-header {
		border-bottom-color: var(--color-gray-200);
	}
	.parsed-header h4 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-gray-900);
		background: linear-gradient(135deg, var(--color-royal-500), var(--color-flame-500));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.entity-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--spacing-lg);
	}
	.entity-card {
		background: white;
		border: 1px solid var(--color-gray-200);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
		transition: all var(--transition-base);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}
	:global(.dark) .entity-card {
		background: var(--color-gray-100);
		border-color: var(--color-gray-200);
	}
	.entity-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-soft);
		border-color: var(--color-royal-300);
	}
	.entity-card h5 {
		font-size: 0.875rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		color: var(--color-gray-800);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-gray-100);
	}
	:global(.dark) .entity-card h5 {
		color: var(--color-gray-800);
		border-bottom-color: var(--color-gray-200);
	}
	.entity-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.entity-card li {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-gray-100);
		transition: background-color var(--transition-fast);
	}
	:global(.dark) .entity-card li {
		border-bottom-color: var(--color-gray-200);
	}
	.entity-card li:hover {
		background-color: var(--color-gray-50);
		margin: 0 -0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		border-radius: var(--radius-sm);
	}
	.entity-card li:last-child {
		border-bottom: none;
	}
	.entity-card strong {
		color: var(--color-gray-900);
		font-weight: 600;
	}
	:global(.dark) .entity-card strong {
		color: var(--color-gray-900);
	}
	.entity-card small {
		color: var(--color-gray-600);
		font-size: 0.8125rem;
		line-height: 1.5;
	}
	:global(.dark) .entity-card small {
		color: var(--color-gray-700);
	} /* Responsive adjustments */
	@media (max-width: 640px) {
		.voice-import-widget {
			padding: 1.25rem;
		}
		.header h3 {
			font-size: 1.25rem;
		}
		.subtitle {
			font-size: 0.8125rem;
		}
		.controls {
			gap: var(--spacing-sm);
		}
		.btn-mic,
		.btn-process,
		.btn-clear {
			padding: 0.75rem 1.25rem;
			font-size: 0.9375rem;
		}
		.entity-grid {
			grid-template-columns: 1fr;
		}
		.parsed-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-md);
		}
		.btn-upload {
			width: 100%;
			justify-content: center;
		}
	} /* Medium screens */
	@media (min-width: 641px) and (max-width: 1024px) {
		.entity-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	} /* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.voice-import-widget::before,
		.btn-mic,
		.btn-process,
		.btn-clear,
		.btn-upload,
		.transcript,
		.entity-card,
		.message {
			animation: none !important;
			transition: none !important;
		}
	} /* Focus visible styles for keyboard navigation */
	.btn-mic:focus-visible,
	.btn-process:focus-visible,
	.btn-clear:focus-visible,
	.btn-upload:focus-visible {
		outline: 3px solid var(--color-royal-400);
		outline-offset: 2px;
	} /* Loading state overlay */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	} /* Pulse effect enhancement */
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			box-shadow: var(--shadow-glow);
		}
		50% {
			opacity: 0.85;
			box-shadow: var(--shadow-glow-lg);
		}
	} /* Print styles */
	@media print {
		.voice-import-widget {
			box-shadow: none;
			border: 1px solid var(--color-gray-300);
		}
		.controls,
		.btn-upload {
			display: none;
		}
	}
</style>
