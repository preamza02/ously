<script lang="ts">
    import Navbar from "./Navbar.svelte";
    import Sidebar from "./Sidebar.svelte";

    interface NavItem {
        label: string;
        icon: any;
        href: string;
    }

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
        navItems?: NavItem[];
        menus?: Record<string, MenuSection[]>;
        user?: {
            name: string;
            since: string;
            avatar: string;
        };
        children?: import("svelte").Snippet;
        sidebarFooter?: import("svelte").Snippet;
    }

    let { navItems, menus, user, children, sidebarFooter }: Props = $props();

    let isMobileMenuOpen = $state(false);

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
    }
</script>

<div
    class="bg-background-light dark:bg-background-dark text-slate-600 dark:text-slate-300 font-sans antialiased selection:bg-primary/20 h-screen flex flex-col relative"
>
    <Navbar {navItems} {user} onToggleMenu={toggleMobileMenu} />
    <div class="flex-1 w-full max-w-[1600px] mx-auto flex overflow-hidden">
        <Sidebar
            {menus}
            {sidebarFooter}
            {user}
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
        />
        <main class="flex-1 h-full overflow-y-auto w-full px-6 py-8">
            {@render children?.()}
        </main>
    </div>
</div>
