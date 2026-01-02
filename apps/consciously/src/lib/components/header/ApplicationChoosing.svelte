<script lang="ts">
	interface NavItem {
		label: string;
		href?: string;
		active?: boolean;
	}

	let { items = [] }: { items: NavItem[] } = $props();
</script>

<div class="w-full border-b border-border/50 bg-white/30 backdrop-blur-sm dark:bg-background/30">
	<div class="no-scrollbar mx-auto flex h-10 max-w-7xl items-center gap-6 overflow-x-auto px-6">
		{#each items as item}
			<a
				href={item.href || '##'}
				class="pb-2.5 text-[13px] transition-colors {item.active
					? 'translate-y-[1px] border-b-2 border-primary font-semibold text-primary'
					: 'font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}"
			>
				{item.label}
			</a>
		{/each}
	</div>
</div>