<script lang="ts">
    import { cn } from "../../../utils.js";
    import UnchangeableIcon from "./UnchangeableIcon.svelte";
    import * as Popover from "../popover/index.js";
    import { availableIcons, IconType } from "./icons.js";

    let {
        name = $bindable(),
        class: className = "",
        onSelect,
    } = $props<{
        name: IconType;
        class?: string;
        onSelect?: (name: IconType) => void;
    }>();

    let isOpen = $state(false);

    function selectIcon(icon: string) {
        name = icon as IconType;
        if (onSelect) onSelect(icon as IconType);
        isOpen = false;
    }
</script>

<Popover.Root bind:open={isOpen}>
    <Popover.Trigger>
        {#snippet child({ props })}
            <button
                {...props}
                class="hover:opacity-70 transition-opacity rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center"
            >
                <UnchangeableIcon {name} class={className} />
            </button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-2" align="start" sideOffset={8}>
        <div
            class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
            Select Icon
        </div>
        <div
            class="grid grid-cols-6 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar"
        >
            {#each availableIcons as icon}
                <button
                    class="flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors {name ===
                    icon
                        ? 'bg-primary/10 text-primary ring-2 ring-primary/20'
                        : 'text-slate-600 dark:text-slate-400'}"
                    onclick={() => selectIcon(icon)}
                    title={icon}
                >
                    <UnchangeableIcon name={icon} class="text-2xl" />
                </button>
            {/each}
        </div>
    </Popover.Content>
</Popover.Root>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 20px;
    }
    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #475569;
    }
</style>
