<script lang="ts">
    import { Link, Unlink, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-svelte';
    import type { BudgetCategory } from '@ously/core/money/repo/zeroBudget';
    import ChangeableIcon from '@ously/ui/components/ui/icon/ChangeableIcon.svelte';

    let { 
        category, 
        person1Income, 
        person2Income,
        isCoupleMode,
        onUpdatePerson1Amount,
        onUpdatePerson2Amount,
        onUpdateCombinedAmount,
        onToggleLink,
        onDelete,
        onIconChange
    } = $props<{
        category: BudgetCategory;
        person1Income: number;
        person2Income: number;
        isCoupleMode: boolean;
        onUpdatePerson1Amount: (amount: number) => void;
        onUpdatePerson2Amount: (amount: number) => void;
        onUpdateCombinedAmount: (amount: number) => void;
        onToggleLink: () => void;
        onDelete: () => void;
        onIconChange: (icon: string) => void;
    }>();

    let person1Input = $state(formatCurrency(category.person1Amount));
    let person2Input = $state(formatCurrency(category.person2Amount));
    let isOpen = $state(false); // Mobile collapse state

    $effect(() => {
        person1Input = formatCurrency(category.person1Amount);
        person2Input = formatCurrency(category.person2Amount);
    });

    function formatCurrency(value: number): string {
        return value.toLocaleString('en-US');
    }

    function parseCurrency(value: string): number {
        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
    }

    function getPercentage(amount: number, income: number): number {
        if (income === 0) return 0;
        return Math.round((amount / income) * 100);
    }

    function handlePerson1Input(event: Event) {
        const value = parseCurrency((event.target as HTMLInputElement).value);
        person1Input = formatCurrency(value);
        onUpdatePerson1Amount(value);
    }

    function handlePerson2Input(event: Event) {
        const value = parseCurrency((event.target as HTMLInputElement).value);
        person2Input = formatCurrency(value);
        onUpdatePerson2Amount(value);
    }

    let person1Percentage = $derived(getPercentage(category.person1Amount, person1Income));
    let person2Percentage = $derived(getPercentage(category.person2Amount, person2Income));
    let combinedTotal = $derived(category.person1Amount + category.person2Amount);
</script>

<div class="group flex flex-col md:grid md:grid-cols-12 gap-4 relative">
    <!-- Category Info (Always Visible) -->
    <div class="w-full md:col-span-4 flex items-center gap-3 cursor-pointer md:cursor-default" onclick={() => isOpen = !isOpen}>
        <!-- Drag Handle -->
        <div class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 flex items-center justify-center -ml-2 p-1">
            <GripVertical class="w-4 h-4" />
        </div>

        <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border cursor-pointer hover:opacity-80 transition-opacity"
            style="background-color: {category.color}15; border-color: {category.color}30; color: {category.color}"
            onclick={(e) => e.stopPropagation()}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()}
        >
            <ChangeableIcon 
                name={category.icon} 
                class="w-5 h-5" 
                onSelect={(newIcon) => onIconChange(newIcon)}
            />
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between md:justify-start gap-2">
                <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{category.name}</p>
                <!-- Mobile Total Display -->
                <span class="md:hidden text-sm font-bold text-slate-900 dark:text-white">
                    ${combinedTotal.toLocaleString()}
                </span>
            </div>
            {#if category.description}
                <p class="text-[11px] text-slate-500 truncate">{category.description}</p>
            {/if}
        </div>
        
        <!-- Mobile Collapse Icon -->
        <div class="md:hidden text-slate-400">
            {#if isOpen}
                <ChevronUp class="w-4 h-4" />
            {:else}
                <ChevronDown class="w-4 h-4" />
            {/if}
        </div>

        <button 
            class="hidden md:block p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            onclick={(e) => { e.stopPropagation(); onDelete(); }}
        >
            <Trash2 class="w-4 h-4" />
        </button>
    </div>


    <!-- Collapsible Content (Inputs) -->
    <div class="{isOpen ? 'flex' : 'hidden'} md:contents flex-col gap-3 w-full pb-2 md:pb-0">
        {#if isCoupleMode}
            <!-- Couple Mode: Side by Side on Mobile -->
            <div class="flex md:contents items-end gap-2">
                <!-- Person 1 -->
                <div class="flex-1 md:col-span-3 relative">
                    <span class="md:hidden block text-[10px] font-bold text-slate-400 mb-1">Person 1</span>
                    <div class="relative">
                        <span class="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm">$</span>
                        <input 
                            type="text"
                            value={person1Input}
                            oninput={handlePerson1Input}
                            class="w-full py-2 pl-5 md:pl-7 pr-8 md:pr-12 bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-primary hover:border-slate-200 dark:hover:border-slate-700 rounded-lg md:rounded-xl transition-all text-slate-900 dark:text-white font-medium text-right text-sm md:text-base"
                        />
                        <div class="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded-md">
                            {person1Percentage}%
                        </div>
                    </div>
                </div>

                <!-- Link Toggle -->
                <div class="w-8 md:w-auto md:col-span-2 flex justify-center pb-1 md:pb-0">
                    <button 
                        class="cursor-pointer relative flex flex-col items-center justify-center group/toggle"
                        onclick={(e) => { e.stopPropagation(); onToggleLink(); }}
                        title={category.isLinked ? 'Combined Expense' : 'Separate Expense'}
                    >
                        <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 {category.isLinked ? '' : 'invisible'}">${combinedTotal.toLocaleString()}</span>
                        <div class="w-8 h-8 rounded-full {category.isLinked ? 'bg-blue-100 dark:bg-blue-900/30 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'} flex items-center justify-center transition-all duration-300">
                            {#if category.isLinked}
                                <Link class="w-4 h-4" />
                            {:else}
                                <Unlink class="w-4 h-4 -rotate-45" />
                            {/if}
                        </div>
                        <span class="hidden md:block text-[9px] font-bold {category.isLinked ? 'text-primary' : 'text-slate-400'} mt-1">
                            {category.isLinked ? 'Combined' : 'Separate'}
                        </span>
                    </button>
                </div>

                <!-- Person 2 -->
                <div class="flex-1 md:col-span-3 relative">
                    <span class="md:hidden block text-[10px] font-bold text-slate-400 mb-1">Your Love</span>
                    <div class="relative">
                        <span class="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm">$</span>
                        <input 
                            type="text"
                            value={person2Input}
                            oninput={handlePerson2Input}
                            class="w-full py-2 pl-5 md:pl-7 pr-8 md:pr-12 bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-primary hover:border-slate-200 dark:hover:border-slate-700 rounded-lg md:rounded-xl transition-all text-slate-900 dark:text-white font-medium text-right text-sm md:text-base"
                        />
                        <div class="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[9px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded-md">
                            {person2Percentage}%
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <!-- Single Mode -->
            <div class="w-full md:col-span-8 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input 
                    type="text"
                    value={person1Input}
                    oninput={handlePerson1Input}
                    class="w-full py-2.5 pl-7 pr-12 bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-primary hover:border-slate-200 dark:hover:border-slate-700 rounded-xl transition-all text-slate-900 dark:text-white font-medium text-right"
                />
                <div class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {person1Percentage}%
                </div>
            </div>
        {/if}

        <!-- Mobile Delete Button -->
        <div class="md:hidden flex justify-end pt-2">
            <button 
                class="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                onclick={(e) => { e.stopPropagation(); onDelete(); }}
            >
                <Trash2 class="w-3.5 h-3.5" />
                Delete Budget
            </button>
        </div>
    </div>
</div>

