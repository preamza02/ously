import type { TagInput } from "./TagInput";
import type { Snippet } from "svelte";
type Variant = "solid" | "outline" | "soft";
type Size = "sm" | "md" | "lg";
type $$ComponentProps = {
    tagInput: TagInput;
    variant?: Variant;
    size?: Size;
    class?: string;
    onclick?: () => void;
    children?: Snippet;
};
declare const Tag: import("svelte").Component<$$ComponentProps, {}, "">;
type Tag = ReturnType<typeof Tag>;
export default Tag;
