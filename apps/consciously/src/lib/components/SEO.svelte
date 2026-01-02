<script lang="ts">
	import { page } from '$app/state';
	import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, TWITTER_HANDLE } from '$lib/constants';

    interface Props {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
        article?: boolean;
    }

	let {
		title = SITE_TITLE,
		description = SITE_DESCRIPTION,
		image = '/og-image.png',
		type = 'website',
		article = false
	}: Props = $props();

	const canonicalUrl = $derived(`${SITE_URL}${page.url.pathname}`);
	const socialImage = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);
	const titleTemplate = $derived(title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`);
</script>

<svelte:head>
	<title>{titleTemplate}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={titleTemplate} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={socialImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalUrl} />
	<meta property="twitter:title" content={titleTemplate} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={socialImage} />
	<meta property="twitter:creator" content={TWITTER_HANDLE} />

    {#if article}
        <meta property="article:author" content="Consciously" />
    {/if}
</svelte:head>
