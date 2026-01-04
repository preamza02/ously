<script lang="ts">
    import logo from "../../../assets/logo.svg";

    let { class: className = "" } = $props<{ class?: string }>();
</script>

<div class="flex items-center gap-2.5 {className}">
    <img src={logo} alt="Consciously Logo" class="h-8 w-8" />
    <h1
        class="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight"
    >
        Consciously
    </h1>
</div>
