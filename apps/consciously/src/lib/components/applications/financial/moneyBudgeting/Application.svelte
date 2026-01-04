<script lang="ts">
    import { ChevronLeft, ChevronRight, Calendar, User, Users, Plus, GripVertical, PiggyBank } from 'lucide-svelte';
    import ShareButton from '@ously/ui/components/customComponents/ShareButton.svelte';
    import { zeroBudgetState, derivedValues, actions, initPersistence, isStateLoaded } from '$lib/stores/zeroBudget';
    import { user } from '$lib/stores/user';
    import PersonIncomeCard from './PersonIncomeCard.svelte';
    import BudgetSummaryBar from './BudgetSummaryBar.svelte';
    import BudgetCategoryRow from './BudgetCategoryRow.svelte';
    import AddCategoryModal from './AddCategoryModal.svelte';

    // Initialize persistence
    initPersistence();

    let { id = '' } = $props();
    let isAddCategoryModalOpen = $state(false);

    // Format month for display
    let displayMonth = $derived(() => {
        const [year, month] = zeroBudgetState.currentMonth.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    // Icon mapping for categories
    // Icons are now handled dynamically by ChangeableIcon component

    function openAddCategoryModal() {
        isAddCategoryModalOpen = true;
    }

    function closeAddCategoryModal() {
        isAddCategoryModalOpen = false;
    }

    function handleAddCategory(name: string, description: string, icon: string, color: string, person1Amount: number, person2Amount: number, isLinked: boolean) {
        actions.addCategory({
            name,
            description,
            icon,
            color,
            isLinked,
            person1Amount,
            person2Amount,
        });
        closeAddCategoryModal();
    }

    function handleUpdateAmount(categoryId: string, person: 1 | 2, amount: number) {
        actions.updateCategoryAmount(categoryId, person, amount);
    }

    function handleUpdateCombinedAmount(categoryId: string, totalAmount: number) {
        actions.updateCombinedAmount(categoryId, totalAmount);
    }

    function handleToggleLink(categoryId: string) {
        actions.toggleCategoryLink(categoryId);
    }

    function handleDeleteCategory(categoryId: string) {
        actions.removeCategory(categoryId);
    }

    function handleModeChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        actions.setMode(target.value as 'single' | 'couple');
    }

    function formatCurrency(value: number): string {
        return value.toLocaleString('en-US');
    }

    function parseCurrency(value: string): number {
        return parseInt(value.replace(/[^0-9-]/g, '')) || 0;
    }

    // Drag and Drop Logic
    let draggedIndex: number | null = $state(null);
    let dragOverIndex: number | null = $state(null);
    let dropPosition: 'before' | 'after' | null = $state(null);

    function handleDragStart(event: DragEvent, index: number) {
        draggedIndex = index;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    function handleDragOver(event: DragEvent, index: number) {
        event.preventDefault();
        if (draggedIndex === null) return;
        
        // Determine if cursor is in top or bottom half of the target element
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const isTopHalf = event.clientY < midpoint;
        
        dragOverIndex = index;
        dropPosition = isTopHalf ? 'before' : 'after';

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    function handleDragLeave(event: DragEvent) {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (!relatedTarget || !event.currentTarget || !(event.currentTarget as HTMLElement).contains(relatedTarget)) {
            // Only clear if we're leaving the list entirely
        }
    }

    function handleDrop(event: DragEvent, index: number) {
        event.preventDefault();
        if (draggedIndex === null) return;
        
        // Calculate the actual target index based on drop position
        let targetIndex = index;
        if (dropPosition === 'after') {
            targetIndex = index + 1;
        }
        
        // Adjust if dragging from before the target
        if (draggedIndex < targetIndex) {
            targetIndex -= 1;
        }
        
        if (draggedIndex !== targetIndex) {
            actions.reorderCategories(draggedIndex, targetIndex);
        }
        
        draggedIndex = null;
        dragOverIndex = null;
        dropPosition = null;
    }

    function handleDragEnd() {
        draggedIndex = null;
        dragOverIndex = null;
        dropPosition = null;
    }
</script>

{#if !isStateLoaded.value}
    <div class="max-w-6xl mx-auto pb-12 scroll-mt-8 flex items-center justify-center min-h-[400px]">
        <div class="animate-pulse text-slate-400">Loading...</div>
    </div>
{:else}
    <div {id} class="max-w-6xl mx-auto pb-12 scroll-mt-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">Zero-Base Budget<ShareButton anchor={id} /></h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Allocate every dollar{zeroBudgetState.mode === 'couple' ? ' together' : ''}.</p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <!-- Mode Selector -->
                <div class="relative group">
                    <div class="relative flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-10 px-1">
                        {#if zeroBudgetState.mode === 'couple'}
                            <Users class="w-5 h-5 text-slate-400 ml-2" />
                        {:else}
                            <User class="w-5 h-5 text-slate-400 ml-2" />
                        {/if}
                        <select 
                            class="appearance-none pl-2 pr-8 py-1 bg-transparent border-none text-sm font-bold text-slate-700 dark:text-white focus:ring-0 cursor-pointer outline-none w-full h-full rounded-xl"
                            value={zeroBudgetState.mode}
                            onchange={handleModeChange}
                        >
                            <option value="couple">Couple</option>
                            <option value="single">Single</option>
                        </select>
                        <ChevronRight class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 1. Budget Summary Overview -->
        <div class="mb-8">
            <BudgetSummaryBar
                combinedIncome={derivedValues.combinedIncome}
                totalSpending={derivedValues.totalSpending}
                remainingBudget={derivedValues.totalRemaining}
                isSingleMode={zeroBudgetState.mode === 'single'}
            />
        </div>

        <!-- 2. Income Cards -->
        <div class="grid grid-cols-12 gap-6 mb-8">
            <PersonIncomeCard
                name={user.name}
                income={zeroBudgetState.person1.income}
                budgeted={derivedValues.person1Budgeted}
                remaining={derivedValues.person1Remaining}
                onIncomeChange={(val) => actions.updatePerson1Income(val)}
                onNameChange={(val) => actions.updatePerson1Name(val)}
                isCouple={zeroBudgetState.mode === 'couple'}
                personNumber={1}
                avatar={user.avatar}
            />
            
            {#if zeroBudgetState.mode === 'couple'}
                <PersonIncomeCard
                    name={zeroBudgetState.person2.person.name === 'Person 2' ? 'Your Love' : zeroBudgetState.person2.person.name}
                    income={zeroBudgetState.person2.income}
                    budgeted={derivedValues.person2Budgeted}
                    remaining={derivedValues.person2Remaining}
                    onIncomeChange={(val) => actions.updatePerson2Income(val)}
                    onNameChange={(val) => actions.updatePerson2Name(val)}
                    isCouple={true}
                    personNumber={2}
                />
            {/if}
        </div>

        <!-- 3. Budget Categories List -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 class="font-display text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 px-2">
                    <PiggyBank class="w-4 h-4" />
                    Budgets
                </h3>
                <button 
                    class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                    onclick={openAddCategoryModal}
                >
                    <Plus class="w-3.5 h-3.5" />
                    Add Budget
                </button>
            </div>
            
            <div class="divide-y divide-slate-100 dark:divide-slate-700">
                {#each zeroBudgetState.categories as category, index (category.id)}
                    <div 
                        class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default relative {draggedIndex === index ? 'opacity-50' : ''}"
                        draggable={true}
                        ondragstart={(e) => handleDragStart(e, index)}
                        ondragover={(e) => handleDragOver(e, index)}
                        ondrop={(e) => handleDrop(e, index)}
                        ondragend={handleDragEnd}
                        role="listitem"
                    >
                        <!-- Drop indicator line -->
                        {#if dragOverIndex === index && dropPosition === 'before' && draggedIndex !== index}
                            <div class="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10"></div>
                        {/if}
                        {#if dragOverIndex === index && dropPosition === 'after' && draggedIndex !== index}
                            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-10"></div>
                        {/if}
                        
                        <BudgetCategoryRow
                            {category}
                            person1Income={zeroBudgetState.person1.income}
                            person2Income={zeroBudgetState.person2.income}
                            isCoupleMode={zeroBudgetState.mode === 'couple'}
                            onUpdatePerson1Amount={(amount) => handleUpdateAmount(category.id, 1, amount)}
                            onUpdatePerson2Amount={(amount) => handleUpdateAmount(category.id, 2, amount)}
                            onUpdateCombinedAmount={(amount) => handleUpdateCombinedAmount(category.id, amount)}
                            onToggleLink={() => handleToggleLink(category.id)}
                            onDelete={() => handleDeleteCategory(category.id)}
                            onIconChange={(icon) => actions.updateCategory(category.id, { icon })}
                        />
                    </div>
                {/each}

                {#if zeroBudgetState.categories.length === 0}
                    <div class="p-12 text-center">
                        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <PiggyBank class="w-8 h-8" />
                        </div>
                        <h4 class="text-slate-900 dark:text-white font-bold mb-1">No budgets yet</h4>
                        <p class="text-slate-500 text-sm mb-4">Start by adding your first budget</p>
                        <button 
                            class="text-primary font-bold text-sm hover:underline"
                            onclick={openAddCategoryModal}
                        >
                            Add Budget
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={closeAddCategoryModal}
        onSubmit={handleAddCategory}
        isCoupleMode={zeroBudgetState.mode === 'couple'}
        person1Name={user.name}
        person2Name={zeroBudgetState.person2.person.name === 'Person 2' ? 'Your Love' : zeroBudgetState.person2.person.name}
    />
{/if}

