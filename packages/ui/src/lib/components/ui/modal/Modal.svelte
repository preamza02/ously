<script lang="ts">
    import type { Snippet } from "svelte";
    import * as Drawer from "../drawer";
    import { useMediaQuery } from "../../../hooks/use-media-query.svelte";

    type Size = "sm" | "md" | "lg";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        title: string;
        subtitle?: string;
        size?: Size;
        header?: Snippet;
        children: Snippet;
        footer?: Snippet;
    }

    let {
        isOpen,
        onClose,
        title,
        subtitle = "",
        size = "md",
        header,
        children,
        footer,
    }: Props = $props();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const sizeClasses: Record<Size, string> = {
        sm: "max-w-[400px]",
        md: "max-w-[520px]",
        lg: "max-w-[680px]",
    };

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
    }
</script>

{#if isDesktop.value}
    {#if isOpen}
        <div
            class="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
        >
            <!-- Backdrop click to close -->
            <div
                class="absolute inset-0 cursor-default z-0"
                onclick={onClose}
                role="button"
                tabindex="0"
                onkeydown={handleKeydown}
            ></div>

            <div
                class="bg-white dark:bg-surface-dark w-full {sizeClasses[
                    size
                ]} rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 p-0 modal-content relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                tabindex="-1"
            >
                <!-- Header -->
                <div
                    class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-20"
                >
                    {#if header}
                        {@render header()}
                    {:else}
                        <div>
                            <h3
                                class="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight"
                            >
                                {title}
                            </h3>
                            {#if subtitle}
                                <p
                                    class="text-xs text-slate-500 dark:text-slate-400 mt-1"
                                >
                                    {subtitle}
                                </p>
                            {/if}
                        </div>
                    {/if}
                    <button
                        class="cursor-pointer p-2 -mr-2 -mt-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
                        onclick={onClose}
                    >
                        <span
                            class="material-symbols-rounded text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors"
                            >close</span
                        >
                    </button>
                </div>

                <!-- Body -->
                <div
                    class="p-8 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1"
                >
                    {@render children()}
                </div>

                <!-- Footer -->
                {#if footer}
                    <div
                        class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center gap-4 justify-end"
                    >
                        {@render footer()}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
{:else}
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Content
            class="bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[96vh]"
        >
            <div
                class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 mt-4 mb-4"
            />

            <!-- Header -->
            <div
                class="px-6 pb-4 border-b border-slate-100 dark:border-slate-800"
            >
                {#if header}
                    {@render header()}
                {:else}
                    <Drawer.Title
                        class="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight"
                    >
                        {title}
                    </Drawer.Title>
                    {#if subtitle}
                        <Drawer.Description
                            class="text-xs text-slate-500 dark:text-slate-400 mt-1"
                        >
                            {subtitle}
                        </Drawer.Description>
                    {/if}
                {/if}
            </div>

            <!-- Body -->
            <div
                class="p-6 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1"
            >
                {@render children()}
            </div>

            <!-- Footer -->
            {#if footer}
                <div
                    class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center gap-2 flex-nowrap"
                >
                    {@render footer()}
                </div>
            {/if}
        </Drawer.Content>
    </Drawer.Root>
{/if}

<style>
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    .modal-content {
        animation: modalFadeIn 0.2s ease-out forwards;
    }
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
