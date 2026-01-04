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
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
