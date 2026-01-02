<script lang="ts">
	let { 
        id = '', 
        title = '', 
        description = '', 
        minHeight = 'min-h-[400px]',
        children = undefined
    } = $props();
</script>

<div {id} class="{minHeight} scroll-mt-8 rounded-3xl border border-dashed border-slate-200 p-8 dark:border-slate-800">
    {#if title}
        <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
    {/if}
    {#if description}
        <p class="mt-2 text-slate-500">{description}</p>
    {/if}
    {@render children?.()}
</div>
