<script lang="ts">
    import { User, Heart } from 'lucide-svelte';

    let { 
        name, 
        income, 
        budgeted, 
        remaining, 
        onIncomeChange, 
        onNameChange,
        isCouple,
        personNumber,
        avatar
    } = $props<{
        name: string;
        income: number;
        budgeted: number;
        remaining: number;
        onIncomeChange: (value: number) => void;
        onNameChange: (value: string) => void;
        isCouple: boolean;
        personNumber: 1 | 2;
        avatar?: string;
    }>();

    let incomeInput = $state(formatCurrency(income));
    
    $effect(() => {
        incomeInput = formatCurrency(income);
    });

    function formatCurrency(value: number): string {
        return value.toLocaleString('en-US');
    }

    function handleIncomeInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value.replace(/[^0-9]/g, '')) || 0;
        incomeInput = formatCurrency(value);
        onIncomeChange(value);
    }

    let colSpan = $derived(isCouple ? 'col-span-6 md:col-span-6' : 'col-span-12');

    let avatarColor = $derived(personNumber === 1 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500');
</script>

<div class="{colSpan} flex flex-col p-3 md:p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700 h-full">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-3 md:mb-6 gap-2 md:gap-0">
        <div class="flex items-center gap-2 md:gap-3">
            <div class="w-8 h-8 md:w-12 md:h-12 rounded-full p-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center {avatarColor} shrink-0 overflow-hidden">
                {#if avatar}
                    <img src={avatar} alt={name} class="w-full h-full rounded-full object-cover" />
                {:else}
                    {#if personNumber === 2}
                        <Heart class="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    {:else}
                        <User class="w-4 h-4 md:w-5 md:h-5" />
                    {/if}
                {/if}
            </div>
            <div>
                <input 
                    type="text" 
                    value={name}
                    oninput={(e) => onNameChange((e.target as HTMLInputElement).value)}
                    class="block text-sm md:text-base font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-20 md:w-24 truncate"
                />
                <span class="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Income</span>
            </div>
        </div>
        <div class="relative w-full md:w-36">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm">$</span>
            <input 
                type="text"
                value={incomeInput}
                oninput={handleIncomeInput}
                class="w-full py-1.5 md:py-2 pl-6 md:pl-7 pr-3 text-sm md:text-base font-bold text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg md:rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-shadow shadow-sm"
                placeholder="0"
            />
        </div>
    </div>
    <div class="grid grid-cols-2 gap-2 md:gap-4 mt-auto">
        <div class="bg-white dark:bg-slate-900/50 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center h-16 md:h-24 shadow-sm">
            <span class="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Budgeted</span>
            <span class="block text-sm md:text-xl font-bold text-slate-900 dark:text-white">${budgeted.toLocaleString()}</span>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg md:rounded-xl p-2 md:p-4 border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-center h-16 md:h-24 shadow-sm">
            <span class="block text-[9px] md:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5 md:mb-1">Remaining</span>
            <span class="block text-sm md:text-xl font-bold {remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">${remaining.toLocaleString()}</span>
        </div>
    </div>
</div>

