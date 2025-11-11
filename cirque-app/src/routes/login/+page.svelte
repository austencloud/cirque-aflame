<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn, resetPassword, authState } from '$lib/services/auth.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let showResetPassword = $state(false);
	let resetEmailSent = $state(false);

	// AUTHENTICATION DISABLED - Redirect disabled for development
	// $effect(() => {
	// 	if (authState.currentUser && !authState.loading) {
	// 		goto('/');
	// 	}
	// });

	async function handleSubmit() {
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		loading = true;
		error = null;

		const result = await signIn(email, password);

		if (result.success) {
			// Redirect to home page
			goto('/');
		} else {
			error = result.error || 'Failed to sign in';
			loading = false;
		}
	}

	async function handleResetPassword() {
		if (!email) {
			error = 'Please enter your email address';
			return;
		}

		loading = true;
		error = null;

		const result = await resetPassword(email);

		if (result.success) {
			resetEmailSent = true;
			showResetPassword = false;
		} else {
			error = result.error || 'Failed to send reset email';
		}

		loading = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (showResetPassword) {
				handleResetPassword();
			} else {
				handleSubmit();
			}
		}
	}
</script>

<svelte:head>
	<title>Login - Ringmaster</title>
</svelte:head>

<div class="login-page">
	<div class="login-container">
		<div class="login-card">
			<!-- Logo/Brand -->
			<div class="brand">
				<Icon name="Sparkles" size={48} />
				<h1>Ringmaster</h1>
				<p>Entertainment Management Platform</p>
			</div>

			{#if showResetPassword}
				<!-- Password Reset Form -->
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleResetPassword();
					}}
				>
					<h2>Reset Password</h2>
					<p class="subtitle">Enter your email to receive a password reset link</p>

					{#if error}
						<div class="error-message">
							<Icon name="AlertCircle" size={16} />
							<span>{error}</span>
						</div>
					{/if}

					<div class="form-group">
						<label for="reset-email">
							<Icon name="Mail" size={16} />
							Email Address
						</label>
						<input
							id="reset-email"
							type="email"
							bind:value={email}
							placeholder="your@email.com"
							disabled={loading}
							onkeypress={handleKeyPress}
							autocomplete="email"
						/>
					</div>

					<div class="button-group">
						<Button
							variant="secondary"
							onclick={() => {
								showResetPassword = false;
								error = null;
							}}
							disabled={loading}
						>
							Back to Login
						</Button>
						<Button type="submit" disabled={loading || !email}>
							{#if loading}
								<LoadingSpinner size="sm" />
								Sending...
							{:else}
								Send Reset Link
							{/if}
						</Button>
					</div>
				</form>
			{:else}
				<!-- Login Form -->
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<h2>Sign In</h2>

					{#if resetEmailSent}
						<div class="success-message">
							<Icon name="CheckCircle" size={16} />
							<span>Password reset email sent! Check your inbox.</span>
						</div>
					{/if}

					{#if error}
						<div class="error-message">
							<Icon name="AlertCircle" size={16} />
							<span>{error}</span>
						</div>
					{/if}

					<div class="form-group">
						<label for="email">
							<Icon name="Mail" size={16} />
							Email Address
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="your@email.com"
							disabled={loading}
							onkeypress={handleKeyPress}
							autocomplete="email"
							required
						/>
					</div>

					<div class="form-group">
						<label for="password">
							<Icon name="Lock" size={16} />
							Password
						</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="••••••••"
							disabled={loading}
							onkeypress={handleKeyPress}
							autocomplete="current-password"
							required
						/>
					</div>

					<button
						type="button"
						class="forgot-password"
						onclick={() => {
							showResetPassword = true;
							error = null;
						}}
						disabled={loading}
					>
						Forgot password?
					</button>

					<Button type="submit" fullWidth={true} disabled={loading || !email || !password}>
						{#if loading}
							<LoadingSpinner size="sm" />
							Signing in...
						{:else}
							<Icon name="LogIn" size={18} />
							Sign In
						{/if}
					</Button>
				</form>
			{/if}

			<!-- Security Notice -->
			<div class="security-notice">
				<Icon name="Shield" size={14} />
				<span>Secured with Firebase Authentication</span>
			</div>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-royal-900) 0%, var(--color-gray-900) 100%);
		padding: 1rem;
	}

	.login-container {
		width: 100%;
		max-width: 420px;
	}

	.login-card {
		background: rgba(var(--color-gray-800-rgb), 0.6);
		backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
	}

	.brand {
		text-align: center;
		margin-bottom: 2rem;
	}

	.brand :global(svg) {
		color: var(--color-royal-400);
		margin: 0 auto 1rem;
	}

	.brand h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		background: linear-gradient(135deg, var(--color-royal-400), var(--color-royal-300));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.brand p {
		color: var(--color-gray-400);
		font-size: 0.875rem;
		margin: 0;
	}

	form h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--color-gray-100);
	}

	.subtitle {
		color: var(--color-gray-400);
		font-size: 0.875rem;
		margin: 0 0 1.5rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-gray-300);
		margin-bottom: 0.5rem;
	}

	.form-group label :global(svg) {
		color: var(--color-royal-400);
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: var(--color-gray-100);
		font-size: 0.9375rem;
		transition: all 0.2s ease;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--color-royal-400);
		background: rgba(0, 0, 0, 0.4);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
	}

	.form-group input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-group input::placeholder {
		color: var(--color-gray-500);
	}

	.forgot-password {
		display: block;
		width: 100%;
		text-align: right;
		background: none;
		border: none;
		color: var(--color-royal-400);
		font-size: 0.875rem;
		cursor: pointer;
		padding: 0;
		margin-bottom: 1.5rem;
		transition: color 0.2s ease;
	}

	.forgot-password:hover:not(:disabled) {
		color: var(--color-royal-300);
	}

	.forgot-password:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.error-message,
	.success-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		margin-bottom: 1.25rem;
	}

	.error-message {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #fca5a5;
	}

	.error-message :global(svg) {
		color: #ef4444;
	}

	.success-message {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #86efac;
	}

	.success-message :global(svg) {
		color: #22c55e;
	}

	.security-notice {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--color-gray-500);
		font-size: 0.8125rem;
	}

	.security-notice :global(svg) {
		color: var(--color-royal-400);
	}

	/* Responsive */
	@media (max-width: 480px) {
		.login-card {
			padding: 2rem 1.5rem;
		}

		.brand h1 {
			font-size: 1.75rem;
		}

		form h2 {
			font-size: 1.25rem;
		}
	}
</style>
