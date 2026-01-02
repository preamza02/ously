<script lang="ts">
    import { formatDurationSoFar, formatWeeksRelative, getIconForTag } from './helpers';
    import { UnchangeableIcon, IconType } from '@ously/ui';
    import type { WeekInYourLife, LifeChapter } from '@ously/core/time/repo/lifeChapter';

    let { currentChapter, upcomingEvents, currentWeekNumber } = $props<{
        currentChapter: WeekInYourLife | undefined;
        upcomingEvents: LifeChapter[];
        currentWeekNumber: number;
    }>();

    // Local UI state (stays here)
    let viewMode = $state<'current' | 'upcoming'>('current');
    
    let nextEvent = $derived(upcomingEvents[0]);

    function toggleView(mode: 'current' | 'upcoming') {
        viewMode = mode;
    }
</script>

<div class="relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h3 class="font-display text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {#if viewMode === 'current'}
                <span class="inline-flex items-center gap-2">
                    <UnchangeableIcon name={IconType.PLAY_CIRCLE} class="text-[18px]" /> Current Chapter
                </span>
            {:else}
                <span class="inline-flex items-center gap-2">
                    <UnchangeableIcon name={IconType.CALENDAR_CLOCK} class="text-[18px]" /> Upcoming Event
                </span>
            {/if}
        </h3>
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
            <button 
                class="px-3 py-1 text-xs font-semibold rounded-md transition-all {viewMode === 'current' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
                onclick={() => toggleView('current')}
            >
                Current
            </button>
            <button 
                class="px-3 py-1 text-xs font-semibold rounded-md transition-all {viewMode === 'upcoming' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
                onclick={() => toggleView('upcoming')}
            >
                Upcoming
            </button>
        </div>
    </div>

    {#if viewMode === 'current'}
        <div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card p-1 border border-border-light dark:border-border-dark">
            {#if currentChapter?.focus}
                {@const tagId = currentChapter.focus.tags[0]?.id}
                {@const tagColor = currentChapter.focus.tags[0]?.color || '#3b82f6'}
                <div 
                    class="p-5 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden rounded-xl border"
                    style="background-color: {tagColor}08; border-color: {tagColor}30"
                >
                    <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" style="background-color: {tagColor}10"></div>
                    <div 
                        class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                        style="background-color: white; color: {tagColor}"
                    >
                        <UnchangeableIcon name={getIconForTag(tagId)} class="text-[24px]" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-1 flex-wrap">
                            <h4 class="font-display text-lg font-bold text-slate-900 dark:text-white truncate">{currentChapter.focus.name}</h4>
                            <span 
                                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style="background-color: {tagColor}20; color: {tagColor}"
                            >Ongoing</span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{currentChapter.focus.description || 'No description'}</p>
                        <div class="mt-3 flex items-center gap-4 sm:gap-6 text-xs font-medium text-slate-500 flex-wrap">
                            <div class="flex items-center gap-1.5">
                                <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[16px]" />
                                <span>Since Week {currentChapter.focus.startWeekNumber.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <UnchangeableIcon name={IconType.TIMELAPSE} class="text-[16px]" />
                                <span class="font-bold" style="color: {tagColor}">{formatDurationSoFar(currentWeekNumber - currentChapter.focus.startWeekNumber)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="p-8 text-center text-slate-500">
                    <p>No active chapter. Start one now!</p>
                </div>
            {/if}
        </div>
    {:else}
        <div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card p-1 border border-border-light dark:border-border-dark">
            {#if nextEvent}
                {@const tagId = nextEvent.tags[0]?.id}
                {@const tagColor = nextEvent.tags[0]?.color || '#8b5cf6'}
                <div 
                    class="p-5 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden rounded-xl border"
                    style="background-color: {tagColor}08; border-color: {tagColor}30"
                >
                    <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" style="background-color: {tagColor}10"></div>
                    <div 
                        class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                        style="background-color: white; color: {tagColor}"
                    >
                        <UnchangeableIcon name={getIconForTag(tagId)} class="text-[24px]" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-1 flex-wrap">
                            <h4 class="font-display text-lg font-bold text-slate-900 dark:text-white truncate">{nextEvent.name}</h4>
                            <span 
                                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style="background-color: {tagColor}20; color: {tagColor}"
                            >
                                {formatWeeksRelative(nextEvent.startWeekNumber - currentWeekNumber)}
                            </span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{nextEvent.description || 'No description'}</p>
                        <div class="mt-3 flex items-center gap-4 sm:gap-6 text-xs font-medium text-slate-500">
                            <div class="flex items-center gap-1.5">
                                <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[16px]" />
                                <span>Starts Week {nextEvent.startWeekNumber.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="p-8 text-center text-slate-500">
                    <p>No upcoming events.</p>
                </div>
            {/if}
        </div>
    {/if}
</div>
