import { Switch as SwitchPrimitive } from "bits-ui";
declare const Switch: import("svelte").Component<Omit<Omit<SwitchPrimitive.RootProps, "child">, "children">, {}, "checked" | "ref">;
type Switch = ReturnType<typeof Switch>;
export default Switch;
