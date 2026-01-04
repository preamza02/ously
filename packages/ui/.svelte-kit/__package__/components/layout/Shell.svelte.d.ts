interface NavItem {
    label: string;
    icon: any;
    href: string;
}
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
declare const Shell: import("svelte").Component<Props, {}, "">;
type Shell = ReturnType<typeof Shell>;
export default Shell;
