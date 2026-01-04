<script lang="ts">
    import { page } from "$app/stores";
    import AppLogo from "../ui/branding/AppLogo.svelte";

    interface MenuItem {
        label: string;
        icon: any;
        href: string;
    }

    interface MenuSection {
        category: string;
        items: MenuItem[];
    }

    interface Props {
        menus?: Record<string, MenuSection[]>;
        sidebarFooter?: import("svelte").Snippet;
        isOpen?: boolean;
        onClose?: () => void;
        user?: {
            name: string;
            since: string;
            avatar: string;
        };
    }

    let {
        menus = {},
        sidebarFooter,
        isOpen = false,
        onClose,
        user,
    }: Props = $props();

    // Determine current menu based on pathname
    let currentMenu = $derived.by(() => {
        const path = $page.url.pathname;
        const keys = Object.keys(menus).sort((a, b) => b.length - a.length);
        for (const key of keys) {
            if (path.startsWith(key)) {
                return menus[key];
            }
        }
        return [];
    });

    // Determine active section based on current pathname
    let activeSection = $derived($page.url.pathname);

    function handleNavClick() {
        // Close sidebar on mobile after selection
        if (onClose) onClose();
    }
</script>

<!-- Mobile Overlay -->
{#if isOpen}
    <div
        class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        onclick={onClose}
        aria-hidden="true"
    ></div>
{/if}

<!-- Sidebar Content -->
<aside
    class="
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-r border-border-light/50 dark:border-border-dark/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-white/40 lg:dark:bg-background-dark/40 lg:backdrop-blur-sm lg:h-full lg:z-auto
        {isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col py-6 pl-6 pr-2
    "
>
    <!-- Mobile Logo -->
    <div class="lg:hidden mb-8 pl-2 flex-none">
        <AppLogo />
    </div>

    <!-- Scrollable Menu Area -->
    <div
        class="bg-gray dark:bg-gray-800 flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 sidebar-scrollbar border-b border-b-slate-200/60"
    >
        {#each currentMenu as section}
            <div class="space-y-1 mb-6">
                <p
                    class="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
                >
                    {section.category}
                </p>
                {#each section.items as item}
                    <a
                        href={item.href}
                        onclick={handleNavClick}
                        class="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors w-full text-left {activeSection ===
                        item.href
                            ? 'font-semibold text-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
                    >
                        <item.icon class="h-5 w-5" />
                        {item.label}
                    </a>
                {/each}
            </div>
        {/each}
    </div>

    <!-- Fixed Footer -->
    <div class="mt-4 flex-none">
        {@render sidebarFooter?.()}
    </div>
</aside>

<style>
    /* Custom Scrollbar for Sidebar */
    .sidebar-scrollbar::-webkit-scrollbar {
        width: 4px;
    }

    .sidebar-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .sidebar-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(148, 163, 184, 0.3); /* slate-400/30 */
        border-radius: 20px;
    }

    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(148, 163, 184, 0.5); /* slate-400/50 */
    }

    /* Firefox */
    .sidebar-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
    }
</style>
