<script lang="ts">
    import { X } from 'lucide-svelte';
    import Modal from '@ously/ui/components/ui/modal/Modal.svelte';
    import { availableIcons, type IconType } from '@ously/ui/components/ui/icon/icons';
    import ChangeableIcon from '@ously/ui/components/ui/icon/ChangeableIcon.svelte';
    import type { Component } from 'svelte';

    let { isOpen, onClose, onSubmit, isCoupleMode, person1Name = 'Person 1', person2Name = 'Person 2' } = $props<{
        isOpen: boolean;
        onClose: () => void;
        onSubmit: (name: string, description: string, icon: string, color: string, person1Amount: number, person2Amount: number, isLinked: boolean) => void;
        isCoupleMode: boolean;
        person1Name?: string;
        person2Name?: string;
    }>();

    let name = $state('');
    let description = $state('');
    let selectedIcon = $state<IconType>(availableIcons[0]);
    let selectedColor = $state('#3b82f6');
    let person1Amount = $state(0);
    let person2Amount = $state(0);
    let totalAmount = $state(0);
    let isLinked = $state(false);

    // Sync logic for combined amounts
    function handleTotalChange(e: Event) {
        const value = parseInt((e.target as HTMLInputElement).value) || 0;
        totalAmount = value;
        // Default 50/50 split
        person1Amount = Math.floor(value / 2);
        person2Amount = value - person1Amount;
    }

    function handleP1Change(e: Event) {
        const value = parseInt((e.target as HTMLInputElement).value) || 0;
        person1Amount = value;
        if (isLinked) {
            person2Amount = Math.max(0, totalAmount - value);
        }
    }

    function handleP2Change(e: Event) {
        const value = parseInt((e.target as HTMLInputElement).value) || 0;
        person2Amount = value;
        if (isLinked) {
            person1Amount = Math.max(0, totalAmount - value);
        }
    }

    $effect(() => {
        if (!isLinked) {
            totalAmount = person1Amount + person2Amount;
        }
    });



    const colors = [
        '#3b82f6', // blue
        '#10b981', // emerald
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#ef4444', // red
        '#06b6d4', // cyan
        '#84cc16', // lime
    ];

    function handleSubmit() {
        if (!name.trim()) return;
        onSubmit(name, description, selectedIcon, selectedColor, person1Amount, person2Amount, isLinked);
        resetForm();
    }

    function resetForm() {
        name = '';
        description = '';
        selectedIcon = availableIcons[0];
        selectedColor = '#3b82f6';
        person1Amount = 0;
        person2Amount = 0;
        isLinked = false;
    }

    function handleClose() {
        resetForm();
        onClose();
    }
</script>

<Modal 
    isOpen={isOpen} 
    onClose={handleClose} 
    title="Add Budget"
>
    <div class="space-y-5">
        <!-- Name -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Budget Name
            </label>
            <input 
                type="text"
                bind:value={name}
                placeholder="e.g., Entertainment"
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
        </div>

        <!-- Description -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description (optional)
            </label>
            <input 
                type="text"
                bind:value={description}
                placeholder="e.g., Movies, games, hobbies"
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
        </div>

        <!-- Icon Selection -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Icon
            </label>
            <div class="flex items-start">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <ChangeableIcon 
                        name={selectedIcon} 
                        class="w-6 h-6 text-slate-700 dark:text-slate-300"
                        onSelect={(icon) => selectedIcon = icon}
                    />
                </div>
            </div>
        </div>

        <!-- Color Selection -->
        <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Color
            </label>
            <div class="flex flex-wrap gap-2">
                {#each colors as color}
                    <button
                        type="button"
                        class="w-8 h-8 rounded-full transition-all {selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'}"
                        style="background-color: {color}"
                        onclick={() => selectedColor = color}
                    ></button>
                {/each}
            </div>
        </div>

        <!-- Link Toggle (only in couple mode) -->
        {#if isCoupleMode}
            <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Combined expense</p>
                        <p class="text-xs text-slate-500">Track as a shared expense</p>
                    </div>
                    <button
                        type="button"
                        class="relative w-12 h-6 rounded-full transition-colors {isLinked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}"
                        onclick={() => {
                            isLinked = !isLinked;
                            if (isLinked) {
                                totalAmount = person1Amount + person2Amount;
                            }
                        }}
                    >
                        <span 
                            class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform {isLinked ? 'left-7' : 'left-1'}"
                        ></span>
                    </button>
                </div>

                {#if isLinked}
                    <!-- Combined Mode Inputs -->
                    <div class="space-y-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Total Amount</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number"
                                    value={totalAmount || ''}
                                    oninput={handleTotalChange}
                                    class="w-full pl-7 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary font-bold text-lg"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">{person1Name}</label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                    <input 
                                        type="number"
                                        value={person1Amount || ''}
                                        oninput={handleP1Change}
                                        class="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">{person2Name}</label>
                                <div class="relative">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                    <input 
                                        type="number"
                                        value={person2Amount || ''}
                                        oninput={handleP2Change}
                                        class="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <!-- Separate Mode Inputs -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{person1Name} Amount</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number"
                                    bind:value={person1Amount}
                                    class="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{person2Name} Amount</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    type="number"
                                    bind:value={person2Amount}
                                    class="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <!-- Single Mode Input -->
            <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input 
                        type="number"
                        bind:value={person1Amount}
                        class="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        placeholder="0"
                    />
                </div>
            </div>
        {/if}
    </div>

    {#snippet footer()}
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
                type="button"
                class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                onclick={handleClose}
            >
                Cancel
            </button>
            <button 
                type="button"
                class="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onclick={handleSubmit}
                disabled={!name.trim()}
            >
                Add Budget
            </button>
        </div>
    {/snippet}
</Modal>

