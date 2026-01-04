interface ToggleOption {
    label: string;
    icon: any;
    href: string;
}
interface Props {
    options: ToggleOption[];
}
declare const AppToggle: import("svelte").Component<Props, {}, "">;
type AppToggle = ReturnType<typeof AppToggle>;
export default AppToggle;
