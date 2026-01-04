<script lang="ts">
    import { Wallet, TrendingDown, PiggyBank, Banknote } from 'lucide-svelte';

    let { combinedIncome, totalSpending, remainingBudget, isSingleMode } = $props<{
        combinedIncome: number;
        totalSpending: number;
        remainingBudget: number;
        isSingleMode: boolean;
    }>();
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pb-4">
    <div class="flex flex-col items-start gap-1">
        <span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Wallet class="w-3 h-3 md:w-4 md:h-4" />
            {isSingleMode ? 'Total Income' : 'Combined Income'}
        </span>
        <span class="text-xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">${combinedIncome.toLocaleString()}</span>
    </div>
    
    <div class="flex flex-col items-start gap-1">
        <span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Banknote class="w-3 h-3 md:w-4 md:h-4" />
            Total Spending
        </span>
        <span class="text-xl md:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">${totalSpending.toLocaleString()}</span>
    </div>

    <div class="flex flex-col items-start gap-1">
        <span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <PiggyBank class="w-3 h-3 md:w-4 md:h-4" />
            Remaining Budget
        </span>
        <span class="text-xl md:text-3xl font-display font-bold {remainingBudget >= 0 ? 'text-slate-900 dark:text-white' : 'text-red-500'} tracking-tight">${remainingBudget.toLocaleString()}</span>
    </div>
</div>

