<script lang="ts">
    import { UnchangeableIcon, IconType } from '@ously/ui';
    import type { Tag } from '@ously/core/utils/id';
    import RefreshIcon from '@lucide/svelte/icons/refresh-cw';
    import SparklesIcon from '@lucide/svelte/icons/sparkles';
    import { onMount } from 'svelte';

    interface TagStat {
        tag: Tag;
        value: number;
    }

    let { remainingWeeks, lifeProgress, remainingActiveYears, tagStats, currentAge } = $props<{
        remainingWeeks: number;
        lifeProgress: number;
        remainingActiveYears: number;
        tagStats: TagStat[];
        currentAge: number;
    }>();

    // Calculate progress percentage remaining
    let progressRemaining = $derived(100 - Math.round(lifeProgress));

    // Mock AI summary - will be replaced with real AI in the future
    let isGenerating = $state(false);
    let aiSummary = $state<string | null>(null);
    let displayedSummary = $state('');
    
    // Track stats signature to detect changes
    let summarySourceSignature = $state<string>('');
    let currentStatsSignature = $derived(JSON.stringify(tagStats.map(t => ({ id: t.tag.id, val: t.value })).sort((a, b) => b.val - a.val)));
    let hasChanges = $derived(aiSummary !== null && summarySourceSignature !== currentStatsSignature);

    // Typewriter effect
    let typewriterInterval: ReturnType<typeof setInterval>;

    function startTypewriter(text: string) {
        displayedSummary = '';
        if (typewriterInterval) clearInterval(typewriterInterval);
        
        const words = text.split(' ');
        let i = 0;
        
        typewriterInterval = setInterval(() => {
            if (i >= words.length) {
                clearInterval(typewriterInterval);
                return;
            }
            displayedSummary = (displayedSummary ? displayedSummary + ' ' : '') + words[i];
            i++;
        }, 50); // Adjust speed as needed
    }

    // Generate mock AI summary based on tag stats
    function generateMockSummary(): string {
        const sorted = [...tagStats].sort((a, b) => b.value - a.value);
        const topTags = sorted.slice(0, 3).map(s => s.tag.name.toLowerCase());
        
        if (topTags.length === 0) {
            return `At ${currentAge}, your life story is just beginning. You have ${remainingWeeks.toLocaleString()} weeks ahead to craft your narrative. Start planning meaningful chapters today.`;
        }

        const focusText = topTags.length > 1 
            ? `${topTags.slice(0, -1).join(', ')} and ${topTags[topTags.length - 1]}`
            : topTags[0];

        const summaries = [
            `At ${currentAge}, you've built a life centered around ${focusText}. With ${remainingWeeks.toLocaleString()} weeks remaining, consider how you want your next chapter to unfold.`,
            `Your journey of ${currentAge} years reflects a deep commitment to ${focusText}. The ${remainingActiveYears} active years ahead hold endless possibilities.`,
            `Looking at your ${currentAge} years, ${focusText} have defined your path. You still have ${progressRemaining}% of your timeline to write new stories.`
        ];

        return summaries[Math.floor(Math.random() * summaries.length)];
    }

    function refreshSummary() {
        isGenerating = true;
        displayedSummary = ''; // Clear display immediately
        
        // Simulate AI generation delay
        setTimeout(() => {
            const newSummary = generateMockSummary();
            aiSummary = newSummary;
            summarySourceSignature = currentStatsSignature; // Update signature
            isGenerating = false;
            startTypewriter(newSummary);
        }, 800);
    }

    // Initialize with a summary
    $effect(() => {
        if (aiSummary === null && tagStats.length > 0) {
            refreshSummary();
        }
    });

    onMount(() => {
        return () => {
            if (typewriterInterval) clearInterval(typewriterInterval);
        };
    });
</script>

<!-- AI Summary Section -->
<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-soft mb-8">
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
            <div class="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                <SparklesIcon class="w-4 h-4 text-white" />
            </div>
            <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Life Summary</h3>
            <span class="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase">AI</span>
        </div>
        <div class="flex items-center gap-2">
            {#if hasChanges}
                <span class="text-[10px] font-bold text-amber-500 animate-pulse hidden sm:inline-block">
                    (Change detected)
                </span>
            {/if}
            <button
                onclick={refreshSummary}
                disabled={isGenerating}
                class="p-2 rounded-lg transition-all disabled:opacity-50 relative {hasChanges ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 ring-1 ring-amber-200 dark:ring-amber-800' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
                title={hasChanges ? "Update summary with new changes" : "Regenerate summary"}
            >
                <RefreshIcon class="w-4 h-4 {isGenerating ? 'animate-spin' : ''}" />
                {#if hasChanges}
                    <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                    <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                {/if}
            </button>
        </div>
    </div>

    <div class="relative min-h-[3rem]">
        {#if isGenerating}
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex items-center gap-2 text-sm text-slate-400 animate-pulse">
                    <SparklesIcon class="w-4 h-4" />
                    Generating insights...
                </div>
            </div>
        {:else}
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                {displayedSummary}
                {#if displayedSummary && displayedSummary !== aiSummary}
                    <span class="inline-block w-1.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle"></span>
                {/if}
            </p>
        {/if}
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <!-- Remaining Weeks -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
            <p class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{remainingWeeks.toLocaleString()}</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Weeks Left</p>
        </div>

        <!-- Progress -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
            <p class="text-2xl sm:text-3xl font-bold text-primary">{progressRemaining}%</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Remaining</p>
        </div>

        <!-- Active Years -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
            <p class="text-2xl sm:text-3xl font-bold text-green-500">{remainingActiveYears}</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Active Years</p>
        </div>

        <!-- Current Age -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
            <p class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{currentAge}</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Years Old</p>
        </div>
    </div>
</div>
