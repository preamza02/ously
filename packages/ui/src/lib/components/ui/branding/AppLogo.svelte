<script lang="ts">
    import { Infinity } from "lucide-svelte";

    let { class: className = "" } = $props<{ class?: string }>();
</script>

<div class="flex items-center gap-2.5 {className}">
    <div
        class="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm"
    >
        <Infinity class="h-5 w-5" />
    </div>
    <h1
        class="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight"
    >
        Consciously
    </h1>
</div>
