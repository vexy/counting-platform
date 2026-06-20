<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer onload={googleLoaded}></script>
</svelte:head>

<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { bounceIn } from "svelte/easing";
    import { blur, fade } from "svelte/transition";

    // google signin button UI helpers
    let hasGoogleLoaded = $state(false);
    let isMounted = $state(false);
    //
    let showSubtitle = $state(false);

    onMount(async () => {
		if (hasGoogleLoaded) showGoogleSigninButton();
		isMounted = true;

        showSubtitle = true
	});

	async function showGoogleSigninButton() {
		// TODO: Add nonce later
		google.accounts.id.initialize({
			client_id: "618627880154-3v3ojejgm2que1eijc2msq8jrvbcqpsm.apps.googleusercontent.com",
			callback: handleGoogleLogin,
			use_fedcm_for_prompt: true	// will be deprecated at some point (!)

			// code below is causing trouble
			// and is commented out until further investigation

			//FIXME:

			// use_fedcm_for_button: true
			// nonce: hashedNonce,
			// params: {
			// 	nonce: hashedNonce
			// }
		});

		google.accounts.id.renderButton(document.getElementById('googleSignInButton'), {
			theme: 'outline',
			size: 'large',
			width: 320,
			text: 'continue_with',
			shape: 'pill'
		});

		// TODO: Removed Google FedCM signin button
		// google.accounts.id.prompt();
	}

	async function googleLoaded() {
		hasGoogleLoaded = true;
		if (isMounted) await showGoogleSigninButton();
	}

    async function handleGoogleLogin(response: { credential: string }) {
        // check if there's any response
        if(response) {
            // extract the response and initiate server authentication
            const { credential } = response;

            const loginResponse = await fetch(`/?auth=${credential}`, { method: 'POST' });
            if(loginResponse.redirected) {
                console.info("Auth success, redirecting to: ", loginResponse.url);
                await goto(loginResponse.url);
                return
            }

            // passthrough to handle any other cases
        }

        // generically just show error (as we haven't received any login response)
        await goto('/auth-error');
    }
</script>

<img
    src="/favicon.svg"
    alt="infoportal_logo"
    height="80"
    width="80"
/>

<h1>Инфопортал</h1>
{#if showSubtitle}
    <hr transition:fade={{delay: 580, duration: 410 }}/>
    <p transition:blur={{delay: 400, duration: 1125, amount: 35, easing: bounceIn }}>100 људи, 100 ћуди</p>
{/if}
<div id="googleSignInButton"></div>

<div class="learn-more">
    <a href="/learn-more">Сазнај више о платформи...</a>
</div>

<style>
    h1 {
        text-transform: uppercase;
        margin-bottom: 0;
    }

    .learn-more {
        margin-top: 2rem;
        padding: 0.7rem;
        border: 1px solid var(--blue-light);
        border-radius: 10px;
    }

    .learn-more > a {
        color: var(--white);
        text-size-adjust: 90%;
        text-decoration: none;
    }

    .learn-more:hover {
        background-color: var(--blue-medium);
    }

    hr {
        border-style: solid;
        border-width: 2px;
        border-color: var(--orange);
        width: 300px;
    }

    p {
        font-style: italic;
        padding-bottom: 2rem;
    }
</style>