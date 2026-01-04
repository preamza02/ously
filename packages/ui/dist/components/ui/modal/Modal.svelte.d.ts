import type { Snippet } from "svelte";
type Size = "sm" | "md" | "lg";
interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    size?: Size;
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
}
declare const Modal: import("svelte").Component<Props, {}, "">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
