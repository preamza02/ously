import { Select as SelectPrimitive } from "bits-ui";
import SelectPortal from "./select-portal.svelte";
import { type WithoutChild } from "../../../utils";
import type { ComponentProps } from "svelte";
import type { WithoutChildrenOrChild } from "../../../utils";
type $$ComponentProps = WithoutChild<SelectPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>;
};
declare const SelectContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SelectContent = ReturnType<typeof SelectContent>;
export default SelectContent;
