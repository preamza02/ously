<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    interface MenuItem {
        label: string;
        icon: any;
        id: string;
    }

    interface MenuSection {
        category: string;
        items: MenuItem[];
    }

    interface Props {
        menus?: Record<string, MenuSection[]>;
        sidebarFooter?: import("svelte").Snippet;
    }

    let { menus = {}, sidebarFooter }: Props = $props();

    let activeSection = $state("");

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

    $effect(() => {
        if (currentMenu.length > 0) {
            const firstItem = currentMenu[0]?.items?.[0];
            if (firstItem) {
                activeSection = firstItem.id;
            }
        }
    });

    function scrollToSection(id: string) {
        const element = document.getElementById(id);
        const mainContainer = document.querySelector("main");
        if (element && mainContainer) {
            const containerRect = mainContainer.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top;

            mainContainer.scrollBy({
                top: relativeTop - 24, // 24px offset for padding
                behavior: "smooth",
            });

            activeSection = id;
        }
    }

    onMount(() => {
        const mainContainer = document.querySelector("main");
        if (!mainContainer) return;

        const handleScroll = () => {
            const scrollTop = mainContainer.scrollTop;
            const containerRect = mainContainer.getBoundingClientRect();

            // Get all sections that actually exist in the DOM
            const sections = [];
            currentMenu.forEach((section) => {
                section.items.forEach((item) => {
                    const el = document.getElementById(item.id);
                    if (el) {
                        sections.push({ id: item.id, el });
                    }
                });
            });

            if (sections.length === 0) return;

            // If we are at the very top, always highlight the first existing item
            if (scrollTop < 50) {
                activeSection = sections[0].id;
                return;
            }

            // Find the section that is closest to the top of the container
            let closestSection = activeSection;
            let minDistance = Infinity;
            const triggerOffset = 150;

            for (const section of sections) {
                const rect = section.el.getBoundingClientRect();
                const distance = rect.top - containerRect.top;

                // We want the section whose top is closest to the trigger point (e.g., 24px from top)
                // but we only consider sections that have already reached or passed the trigger point
                if (distance <= triggerOffset) {
                    const absDistance = Math.abs(distance - 24);
                    if (absDistance < minDistance) {
                        minDistance = absDistance;
                        closestSection = section.id;
                    }
                }
            }

            if (closestSection !== activeSection) {
                activeSection = closestSection;
            }
        };

        mainContainer.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        // Initial check
        const timer = setTimeout(handleScroll, 500);

        return () => {
            clearTimeout(timer);
            mainContainer.removeEventListener("scroll", handleScroll);
        };
    });

    $effect(() => {
        if (currentMenu) {
            setTimeout(() => {
                const mainContainer = document.querySelector("main");
                if (mainContainer) {
                    const event = new Event("scroll");
                    mainContainer.dispatchEvent(event);
                }
            }, 500);
        }
    });
</script>

<aside
    class="w-64 hidden lg:flex flex-col border-r border-border-light/50 dark:border-border-dark/50 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm h-full overflow-y-auto no-scrollbar py-6 pl-6 pr-2"
>
    {#each currentMenu as section}
        <div class="space-y-1 mb-6">
            <p
                class="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
            >
                {section.category}
            </p>
            {#each section.items as item}
                <button
                    onclick={() => scrollToSection(item.id)}
                    class="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors w-full text-left {activeSection ===
                    item.id
                        ? 'font-semibold text-primary bg-blue-50 dark:bg-blue-900/20'
                        : 'font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
                >
                    <item.icon class="h-5 w-5" />
                    {item.label}
                </button>
            {/each}
        </div>
    {/each}
    <!-- Snippet for additional sidebar content -->
    <div class="mt-auto">
        {@render sidebarFooter?.()}
    </div>
</aside>
