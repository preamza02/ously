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
declare const Navbar: import("svelte").Component<Props, {}, "">;
type Navbar = ReturnType<typeof Navbar>;
export default Navbar;
