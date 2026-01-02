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
					{ label: 'Zero-Based Budgeting (Incoming)', icon: PiggyBank, id: 'money-budgeting' },
					{ label: 'Retirement Planning (Incoming)', icon: Banknote, id: 'retirement-planning' },
				]
			},
			{
				category: 'Financial Optimization',
				items: [
					{ label: 'Tax Optimization (Incoming)', icon: HandCoins, id: 'tax-optimization' },
					{ label: 'Cashflow Analysis (Incoming)', icon: Coins, id: 'cashflow-analysis' },
				]
			},
		],
		'/health': [
			{
				category: 'Health Optimization',
				items: [
					{ label: 'Meal Optimization (Incoming)', icon: Utensils, id: 'meal-optimization' },
				]
			}
		],
		'/time': [
			{
				category: 'Time Planning',
				items: [
					{ label: 'Life Chapter', icon: Calendar, id: 'life-in-weeks' },
					{ label: 'Time Budgeting (Incoming)', icon: Clock, id: 'time-budgeting' },
				]
			}
		]
	};

    // Mock user data for now
    const user = {
        name: 'Guest',
        since: 'since today',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoR7s1REfJR-DsqgIGs8qzOmcNKBoGaH03CRXZwtkXi25u1tACR52ZqgQd_xRcnC_t28ZMr5jcxVpZKqPueMJCGoDQPhWCBm-tsCm9udFXaYb472-Ztu66dnJXzc7LE6f4XxD8Pb_ovwXo3ewEesoBOog76xbHT8YGZ-6UZl4TJmWC_sicuvyonPxTP3fiSZfbpyf-h7b7B0MkOEM22Cdrc8Vp8VQ3wQNGeE300l2kYJpt-MjwmH9G2HsNxMRz1LHnkZvvKzpSd6Y'
    };

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