<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import SEO from '$lib/components/SEO.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import iconPng from '$lib/assets/consciously_icon.png';

	let { children } = $props();
</script>

<SEO />

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="alternate icon" href={iconPng} type="image/png" />
</svelte:head>

{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
