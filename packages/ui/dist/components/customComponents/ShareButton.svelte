<script lang="ts">
    import { Button } from "../ui/button/index.js";
    import { Link, Check } from "lucide-svelte";

    let { anchor = "" }: { anchor?: string } = $props();

    let copied = $state(false);

    async function copyShareUrl() {
        const url = new URL(window.location.href);
        url.hash = anchor;

        try {
            await navigator.clipboard.writeText(url.toString());
            copied = true;
            setTimeout(() => {
                copied = false;
            }, 2000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    }
</script>

<Button
    variant="ghost"
    size="icon-sm"
    onclick={copyShareUrl}
    class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
    title={copied ? "Copied!" : "Copy link to share"}
>
    {#if copied}
        <Check class="h-4 w-4 text-green-500" />
    {:else}
        <Link class="h-4 w-4" />
    {/if}
</Button>
