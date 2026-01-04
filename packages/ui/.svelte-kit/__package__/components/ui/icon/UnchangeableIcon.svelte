<script lang="ts">
    import { cn } from "../../../utils.js";
    import { iconMap } from "./icons.js";
    import { IconType } from "./icons.js";

    let { name, class: className = "" } = $props<{
        name: IconType;
        class?: string;
    }>();

    let IconComponent = $derived(iconMap[name] || iconMap["help"]);
</script>

{#if IconComponent}
    <IconComponent class={cn(className)} />
{:else}
    <span class="material-symbols-outlined {cn(className)}">
        {name}
    </span>
{/if}
