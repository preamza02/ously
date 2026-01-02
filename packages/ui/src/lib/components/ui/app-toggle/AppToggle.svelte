<script lang="ts">
    import { page } from "$app/stores";

    interface ToggleOption {
        label: string;
        icon: any;
        href: string;
    }

    interface Props {
        options: ToggleOption[];
    }

    let { options }: Props = $props();
</script>

<div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
    {#each options as option}
        {@const isActive = $page.url.pathname.startsWith(option.href)}
        <a
            href={option.href}
            class="relative px-3 md:px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 md:gap-2
                {isActive
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
        >
            <option.icon class="h-4 w-4" />
            <span class="text-[11px] md:text-xs">{option.label}</span>
        </a>
    {/each}
</div>

<style>
    a {
        min-width: auto;
        justify-content: center;
    }
    @media (min-width: 768px) {
        a {
            min-width: 90px;
        }
    }
</style>
