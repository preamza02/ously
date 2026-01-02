<script lang="ts">
    import type { TagInput } from "./TagInput";
    import type { Snippet } from "svelte";

    type Variant = "solid" | "outline" | "soft";
    type Size = "sm" | "md" | "lg";

    let {
        tagInput,
        variant = "soft",
        size = "sm",
        class: className = "",
        onclick,
        children,
    } = $props<{
        tagInput: TagInput;
        variant?: Variant;
        size?: Size;
        class?: string;
        onclick?: () => void;
        children?: Snippet;
    }>();

    let sizeClasses = $derived(
        {
            sm: "px-2 py-0.5 text-[10px]",
            md: "px-2.5 py-1 text-xs",
            lg: "px-3 py-1.5 text-sm",
        }[size],
    );

    function getStyles(): string {
        const color = tagInput.color || "#94a3b8";

        switch (variant) {
            case "solid":
                return `background-color: ${color}; color: white;`;
            case "outline":
                return `border: 1px solid ${color}; color: ${color}; background-color: transparent;`;
            case "soft":
            default:
                return `background-color: ${color}20; color: ${color};`;
        }
    }
</script>

{#if onclick}
    <button
        type="button"
        class="tag-wrapper inline-flex items-center rounded-md font-bold transition-all {sizeClasses} {className}"
        style={getStyles()}
        {onclick}
    >
        {#if children}
            {@render children()}
        {:else}
            #{tagInput.tag.name}
        {/if}
    </button>
{:else}
    <span
        class="tag-wrapper inline-flex items-center rounded-md font-bold {sizeClasses} {className}"
        style={getStyles()}
    >
        {#if children}
            {@render children()}
        {:else}
            #{tagInput.tag.name}
        {/if}
    </span>
{/if}

<style>
    .tag-wrapper {
        white-space: nowrap;
    }
</style>
