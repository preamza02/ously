<script lang="ts">
	import { Shell, CreatorCard } from '@ously/ui';
	import { Settings } from 'lucide-svelte';
	import AppSettingsModal from '$lib/components/AppSettingsModal.svelte';
	import {
		Landmark,
		TrendingUp,
		Banknote,
		Home,
		PiggyBank,
		ShieldCheck,
		FileText,
		Calculator,
		Moon,
		Activity,
		Utensils,
		Brain,
		Calendar,
		Focus,
		Zap,
		Coffee,
		HandCoins,
		Coins,
        Wallet,
        Clock,
        Heart
	} from 'lucide-svelte';

    const navItems = [
		{ label: 'Financial', icon: Wallet, href: '/financial' },
		{ label: 'Time', icon: Clock, href: '/time' },
		{ label: 'Health', icon: Heart, href: '/health' }
	];

	const menus = {
		'/financial': [
			{
				category: 'Financial Planning',
				items: [
					{ label: 'Zero-Based Budgeting', icon: PiggyBank, href: '/financial/money-budgeting' },
					{ label: 'Retirement Planning (Incoming)', icon: Banknote, href: '/financial/retirement-planning' },
				]
			},
			{
				category: 'Financial Optimization',
				items: [
					{ label: 'Tax Optimization (Incoming)', icon: HandCoins, href: '/financial/tax-optimization' },
					{ label: 'Cashflow Analysis (Incoming)', icon: Coins, href: '/financial/cashflow-analysis' },
				]
			},
		],
		'/health': [
			{
				category: 'Health Optimization',
				items: [
					{ label: 'Meal Optimization (Incoming)', icon: Utensils, href: '/health/meal-optimization' },
				]
			}
		],
		'/time': [
			{
				category: 'Time Planning',
				items: [
					{ label: 'Life Chapter', icon: Calendar, href: '/time/life-chapter' },
					{ label: 'Time Budgeting (Incoming)', icon: Clock, href: '/time/time-budgeting' },
				]
			}
		]
	};

    import { user } from '$lib/stores/user';

    let isAppSettingsOpen = $state(false);

	let { children } = $props();
</script>

<Shell {navItems} {menus} {user}>
    {#snippet sidebarFooter()}
        <CreatorCard />
        <div class="h-px bg-slate-200/60 dark:bg-slate-700/60 mx-2 my-2"></div>
        <div class="mx-2">
            <button 
                onclick={() => isAppSettingsOpen = true}
                class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors w-full text-left font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
                <Settings class="h-5 w-5" />
                Settings
            </button>
        </div>
    {/snippet}
    {@render children()}
</Shell>

<AppSettingsModal isOpen={isAppSettingsOpen} onClose={() => isAppSettingsOpen = false} {user} />