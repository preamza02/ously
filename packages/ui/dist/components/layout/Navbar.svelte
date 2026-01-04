<script lang="ts">
    import { page } from "$app/stores";
    import { Infinity, Menu } from "lucide-svelte";
    import AppToggle from "../ui/app-toggle/AppToggle.svelte";
    import AppLogo from "../ui/branding/AppLogo.svelte";

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
        onToggleMenu?: () => void;
    }

    let {
        navItems = [],
        user = { name: "Guest", since: "", avatar: "" },
        onToggleMenu,
    }: Props = $props();
</script>

<header
    class="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-background-dark/80 border-b border-border-light/50 dark:border-border-dark/50"
>
    <div
        class="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative"
    >
        <!-- Left Section: Logo & Mobile Menu -->
        <div class="flex items-center gap-4">
            <button
                class="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onclick={onToggleMenu}
                aria-label="Toggle menu"
            >
                <Menu class="h-5 w-5" />
            </button>

            <AppLogo class="hidden lg:flex" />
        </div>

        <!-- Center Section: App Toggle -->
        <div
            class="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <AppToggle options={navItems} />
        </div>

        <!-- Right Section: User Profile (Desktop Only) -->
        <div class="hidden lg:flex items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-slate-900 dark:text-white">
                        {user.name}
                    </p>
                    <p class="text-[10px] text-slate-500">{user.since}</p>
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
