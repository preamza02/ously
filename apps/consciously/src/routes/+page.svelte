<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let loading = $state(true);

	onMount(() => {
		goto("/time", { replaceState: true });
		loading = false;
	});
</script>

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-background z-50">
		<div class="flex flex-col items-center gap-4">
			<div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			<p class="text-muted-foreground text-sm font-medium">Loading...</p>
		</div>
	</div>
{/if}
