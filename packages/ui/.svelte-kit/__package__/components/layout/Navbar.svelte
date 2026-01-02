<script lang="ts">
    import { page } from "$app/stores";
    import { Infinity } from "lucide-svelte";

    interface NavItem {
        label: string;
        icon: any;
        href: string;
    }

    interface Props {
        navItems?: NavItem[];
        user?: {
            name: string;
            since: string;
            avatar: string;
        };
    }

    let {
        navItems = [],
        user = { name: "Guest", since: "", avatar: "" },
    }: Props = $props();
</script>

<header
    class="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-background-dark/80 border-b border-border-light/50 dark:border-border-dark/50"
>
    <div
        class="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
    >
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2.5">
                <div
                    class="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm"
                >
                    <Infinity class="h-5 w-5" />
                </div>
                <h1
                    class="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight hidden sm:block"
                >
                    Consciously
                </h1>
            </div>
            <div
                class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"
            ></div>
            <nav class="hidden md:flex items-center gap-1">
                {#each navItems as item}
                    {#if $page.url.pathname.startsWith(item.href)}
                        <a
                            href={item.href}
                            class="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 transition-all rounded-lg flex items-center gap-1.5"
                        >
                            <item.icon class="h-4 w-4" />
                            {item.label}
                        </a>
                    {:else}
                        <a
                            href={item.href}
                            class="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 flex items-center gap-1.5"
                        >
                            <item.icon class="h-4 w-4" />
                            {item.label}
                        </a>
                    {/if}
                {/each}
            </nav>
        </div>
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-slate-900 dark:text-white">
                        {user.name}
                    </p>
                    <p class="text-[10px] text-slate-500">Premium Plan</p>
                </div>
                <div
                    class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    <div
                        class="h-full w-full rounded-full bg-white dark:bg-slate-800 overflow-hidden"
                    >
                        <img
                            alt="User Avatar"
                            class="h-full w-full object-cover"
                            src={user.avatar}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
