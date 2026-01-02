<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Card, CardHeader, CardTitle, CardContent } from '@ously/ui';
	import { 
		Home, 
		Banknote, 
		PiggyBank, 
		Utensils, 
		Clock,
		Sparkles,

		HandCoins,

		Coins


	} from 'lucide-svelte';

	interface AppInfo {
		title: string;
		description: string;
		philosophy: string;
		icon: any;
		color: string;
	}

	const appInfoMap: Record<string, AppInfo> = {
		'money-budgeting': {
			title: 'Zero-Based Budgeting',
			description: 'Every dollar has a purpose. Allocate your income intentionally.',
			philosophy: 'Zero-based budgeting ensures every dollar you earn is assigned a job—whether saving, spending, or investing. No money sits idle without intention.',
			icon: PiggyBank,
			color: 'blue'
		},
		'retirement-planning': {
			title: 'Retirement Planning',
			description: 'Plan your future self\'s financial freedom today.',
			philosophy: 'Retirement isn\'t about stopping work—it\'s about having the freedom to choose. Start early, stay consistent, and let compound interest do the heavy lifting.',
			icon: Banknote,
			color: 'emerald'
		},
		'tax-optimization': {
			title: 'Tax Optimization',
			description: 'Keep more of what you earn through smart tax strategies.',
			philosophy: 'Tax optimization isn\'t about evasion—it\'s about understanding the rules and using them wisely. Every baht saved in taxes is a baht working for your future.',
			icon: HandCoins,
			color: 'violet'
		},
		'cashflow-analysis': {
			title: 'Cashflow Analysis',
			description: 'Analyze your cashflow to make better financial decisions.',
			philosophy: 'Cashflow analysis helps you understand where your money goes and how to optimize it for your goals.',
			icon: Coins,
			color: 'blue'
		},
		'meal-optimization': {
			title: 'Meal Optimization',
			description: 'Nourish your body with intentional eating habits.',
			philosophy: 'What you eat shapes how you think, feel, and perform. Meal optimization is about making conscious choices that fuel your best self.',
			icon: Utensils,
			color: 'orange'
		},
		'time-budgeting': {
			title: 'Time Budgeting',
			description: 'Invest your hours like you invest your money.',
			philosophy: 'Time is your most valuable and non-renewable resource. Budget it wisely—invest in what matters, minimize what drains you.',
			icon: Clock,
			color: 'cyan'
		}
	};

	let { appId = 'money-budgeting' } = $props<{ appId?: string }>();

	let appInfo = $derived(appInfoMap[appId] || appInfoMap['money-budgeting']);
	let IconComponent = $derived(appInfo.icon);

	const colorClasses: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
		blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800/30', shadow: 'shadow-blue-500/10' },
		emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-800/30', shadow: 'shadow-emerald-500/10' },
		violet: { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-200 dark:border-violet-800/30', shadow: 'shadow-violet-500/10' },
		orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-200 dark:border-orange-800/30', shadow: 'shadow-orange-500/10' },
		cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-200 dark:border-cyan-800/30', shadow: 'shadow-cyan-500/10' }
	};

	let colors = $derived(colorClasses[appInfo.color] || colorClasses.blue);
</script>

<div id = {appId} class="flex min-h-[60vh] flex-col items-center justify-center px-4 sm:px-6 py-12">
	<!-- Icon -->
	<div 
		in:fly={{ y: 20, duration: 800 }}
		class="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl {colors.bg} {colors.text} shadow-xl {colors.shadow}"
	>
		<IconComponent class="h-12 w-12" />
		<div class="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full {colors.bg}"></div>
		<div class="absolute -right-1 -top-1 h-4 w-4 rounded-full {colors.bg}">
			<Sparkles class="h-4 w-4 {colors.text}" />
		</div>
	</div>

	<!-- Title -->
	<h2 
		in:fly={{ y: 20, duration: 800, delay: 100 }}
		class="font-display mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl text-center"
	>
		{appInfo.title}
	</h2>
	
	<p 
		in:fly={{ y: 20, duration: 800, delay: 200 }}
		class="mb-8 text-lg text-slate-500 dark:text-slate-400 text-center max-w-md"
	>
		{appInfo.description}
	</p>

	<!-- Coming Soon Badge -->
	<div 
		in:fly={{ y: 20, duration: 800, delay: 300 }}
		class="mb-10 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider"
	>
		Coming Soon
	</div>

	<!-- Philosophy Card -->
	<div 
		in:fly={{ y: 20, duration: 800, delay: 400 }}
		class="w-full max-w-lg"
	>
		<Card class="bg-slate-50 dark:bg-slate-800/50 border {colors.border}">
			<CardHeader class="pb-3">
				<CardTitle class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Philosophy</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-slate-700 dark:text-slate-300 leading-relaxed">
					{appInfo.philosophy}
				</p>
			</CardContent>
		</Card>
	</div>
</div>
