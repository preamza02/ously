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
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
