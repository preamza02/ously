<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	onMount(() => {
		goto("/time", { replaceState: true });
	});
</script>
