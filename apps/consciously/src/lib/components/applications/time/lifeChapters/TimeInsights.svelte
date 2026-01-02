<script lang="ts">
    import { UnchangeableIcon, IconType } from '@ously/ui';
    import type { Tag } from '@ously/core/utils/id';

    interface TagStat {
        tag: Tag;
        value: number;
    }

    let { remainingWeeks, lifeProgress, tagStats, remainingActiveYears, unplannedWeeks } = $props<{
        remainingWeeks: number;
        lifeProgress: number;
        tagStats: TagStat[];
        remainingActiveYears: number;
        unplannedWeeks: number;
    }>();
    
    // UI-only derived: Top 3 tags (excluding unplanned)
    let topTags = $derived(tagStats.filter((t: TagStat) => t.tag.id !== 'unplanned').slice(0, 3));

    let progressPercentage = $derived(100 - Math.round(lifeProgress));
    
    let borderClass = $derived.by(() => {
        if (progressPercentage < 25) return 'border-slate-100 dark:border-slate-700 border-t-primary';
        if (progressPercentage < 50) return 'border-slate-100 dark:border-slate-700 border-t-primary border-r-primary';
        if (progressPercentage < 70) return 'border-slate-100 dark:border-slate-700 border-t-primary border-r-primary';
        return 'border-slate-100 dark:border-slate-700 border-t-primary border-r-primary border-b-primary';
    });
</script>

<div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card p-6 border border-border-light dark:border-border-dark sticky top-6">
    <div class="flex items-center gap-2 mb-6 text-primary">
        <UnchangeableIcon name={IconType.INSIGHTS} />
        <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Time Insights</h3>
    </div>

    <div class="flex items-center justify-between mb-2">
        <div>
            <p class="text-3xl font-bold text-slate-900 dark:text-white">{remainingWeeks.toLocaleString()}</p>
            <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Weeks Remaining </p>
        </div>
        <div class="h-12 w-12 rounded-full border-4 {borderClass} flex items-center justify-center text-[10px] font-bold text-primary transform -rotate-45 transition-all duration-500">
            {progressPercentage}%
        </div>
    </div>

    <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
        <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: {100 - Math.round(lifeProgress)}%"></div>
    </div>

    <div class="space-y-5">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Life Focus</h4>
        
        {#each topTags as stat}
            {@const color = stat.tag.color || '#94a3b8'}
            <div class="group">
                <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2">
                        <span 
                            class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                            style="background-color: {color}20; color: {color}"
                        >
                            #{stat.tag.name}
                        </span>
                    </div>
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{stat.value.toLocaleString()} wks</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                        class="h-1.5 rounded-full transition-all duration-500" 
                        style="width: {Math.min(100, (stat.value / 4160) * 100 * 3)}%; background-color: {color}"
                    ></div>
                </div>
            </div>
        {/each}

        <div class="group">
            <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700">#Unplanned</span>
                </div>
                <span class="text-sm font-bold text-slate-500 dark:text-slate-400">{unplannedWeeks.toLocaleString()} wks</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="bg-slate-400 h-1.5 rounded-full transition-all duration-500" style="width: {Math.min(100, (unplannedWeeks / 4160) * 100)}%"></div>
            </div>
        </div>
    </div>

    <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div class="bg-primary/5 rounded-xl p-4">
            <div class="flex gap-2 mb-2">
                <UnchangeableIcon name={IconType.LIGHTBULB} class="text-primary text-[20px]" />
                <h5 class="text-xs font-bold text-primary uppercase tracking-wide">Optimization Tip</h5>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You have approximately <span class="font-bold text-slate-900 dark:text-white">{remainingActiveYears} Years</span> remaining where you are physically active enough for adventure travel. Prioritize these blocks now.
            </p>
        </div>
        <p class="text-[10px] text-slate-400 italic text-center mt-4">"We have two lives, and the second begins when we realize we only have one."</p>
    </div>
</div>
