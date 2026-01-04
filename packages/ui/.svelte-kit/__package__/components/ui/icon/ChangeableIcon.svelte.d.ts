import { IconType } from "./icons.js";
type $$ComponentProps = {
    name: IconType;
    class?: string;
    onSelect?: (name: IconType) => void;
};
declare const ChangeableIcon: import("svelte").Component<$$ComponentProps, {}, "name">;
type ChangeableIcon = ReturnType<typeof ChangeableIcon>;
export default ChangeableIcon;
