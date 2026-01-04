<script lang="ts">
    import type { LifeChapter } from '@ously/core/time/repo/lifeChapter';
    import BabyIcon from '@lucide/svelte/icons/baby';
    import HeartIcon from '@lucide/svelte/icons/heart';
    import SkullIcon from '@lucide/svelte/icons/skull';
    import RouteIcon from '@lucide/svelte/icons/route';

    interface Props {
        birthDate: Date;
        lifeSpanYears: number;
        activeLifeYears: number;
        lifeChapters: LifeChapter[];
    }

    let { birthDate, lifeSpanYears, activeLifeYears, lifeChapters }: Props = $props();

    // Calculate key dates
    let activeLifeEndDate = $derived.by(() => {
        const date = new Date(birthDate);
        date.setFullYear(birthDate.getFullYear() + activeLifeYears);
        return date;
    });

    let deathDate = $derived.by(() => {
        const date = new Date(birthDate);
        date.setFullYear(birthDate.getFullYear() + lifeSpanYears);
        return date;
    });

    let now = new Date();
    let currentAge = $derived(Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));

    // Sort chapters by start week
    let sortedChapters = $derived([...lifeChapters].sort((a, b) => a.startWeekNumber - b.startWeekNumber));

    function formatDate(date: Date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    function getAgeFromWeek(weekNumber: number) {
        return Math.floor(weekNumber / 52);
    }
</script>

<div class="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <RouteIcon class="w-5 h-5 text-indigo-500" />
        Life Timeline
    </h3>

    <div class="relative pl-8 space-y-6">
        <!-- Vertical Line -->
        <div class="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 via-amber-500 to-slate-300 dark:to-slate-600"></div>

        <!-- Birth Node -->
        <div class="relative">
            <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                <BabyIcon class="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
                <div class="text-sm font-bold text-slate-900 dark:text-white">Born</div>
                <div class="text-xs text-slate-500 font-mono">{formatDate(birthDate)}</div>
            </div>
        </div>

        <!-- Life Chapters -->
        {#each sortedChapters as chapter}
            {@const startAge = getAgeFromWeek(chapter.startWeekNumber)}
            {@const endAge = getAgeFromWeek(chapter.endWeekNumber)}
            {@const primaryTag = chapter.tags?.[0]}
            {@const isPast = chapter.endWeekNumber < (currentAge * 52)}
            {@const isCurrent = chapter.startWeekNumber <= (currentAge * 52) && chapter.endWeekNumber >= (currentAge * 52)}
            
            <div class="relative">
                <div 
                    class="absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10"
                    style="background-color: {primaryTag?.color || '#6366f1'}20"
                >
                    <div 
                        class="w-2 h-2 rounded-full {isCurrent ? 'animate-pulse' : ''}" 
                        style="background-color: {primaryTag?.color || '#6366f1'}"
                    ></div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50 {isPast ? 'opacity-60' : ''}">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-bold text-slate-900 dark:text-white">{chapter.name}</span>
                        {#if primaryTag}
                            <span 
                                class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                style="background-color: {primaryTag.color}20; color: {primaryTag.color}"
                            >
                                #{primaryTag.name}
                            </span>
                        {/if}
                        {#if isCurrent}
                            <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                Current
                            </span>
                        {/if}
                    </div>
                    <div class="text-xs text-slate-500 font-mono">
                        Age {startAge} - {endAge}
                    </div>
                </div>
            </div>
        {/each}

        <!-- Now Indicator (if no current chapter) -->
        <div class="relative">
            <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div>
                <div class="text-sm font-bold text-green-600 dark:text-green-400">Now</div>
                <div class="text-xs text-slate-500 font-mono">{formatDate(now)} (Age {currentAge})</div>
            </div>
        </div>

        <!-- Active Life End Node -->
        <div class="relative">
            <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                <HeartIcon class="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
                <div class="text-sm font-bold text-amber-600 dark:text-amber-400">Active Life Ends</div>
                <div class="text-xs text-slate-500 font-mono">{formatDate(activeLifeEndDate)} (Age {activeLifeYears})</div>
            </div>
        </div>

        <!-- Death Node -->
        <div class="relative">
            <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                <SkullIcon class="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
                <div class="text-sm font-bold text-slate-500 dark:text-slate-400">End of Life</div>
                <div class="text-xs text-slate-500 font-mono">{formatDate(deathDate)} (Age {lifeSpanYears})</div>
            </div>
        </div>
    </div>
</div>
