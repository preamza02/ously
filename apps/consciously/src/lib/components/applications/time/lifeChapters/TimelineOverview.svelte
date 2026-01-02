<script lang="ts">
    import type { WeekInYourLife } from '@ously/core/time/repo/lifeChapter';
    import { UnchangeableIcon, IconType } from '@ously/ui';

    let { onAddChapter, onAddSpecialEvent, onOpenSettings, onShowHelp, timeline, currentWeekNumber, lifeSpanWeeks, activeLifeYears = 65 } = $props<{ 
        timeline: WeekInYourLife[];
        currentWeekNumber: number;
        lifeSpanWeeks: number;
        activeLifeYears?: number;
        onAddChapter: () => void;
        onAddSpecialEvent?: () => void;
        onOpenSettings?: () => void;
        onShowHelp?: () => void;
    }>();

    // UI-only derived value: Calculate current week position percentage for the "Now" marker
    let nowPosition = $derived((currentWeekNumber / lifeSpanWeeks) * 100);
    
    // Active life position (weeks = years * 52)
    let activeLifeWeeks = $derived(activeLifeYears * 52);
    let activeLifePosition = $derived((activeLifeWeeks / lifeSpanWeeks) * 100);

    function getSegmentStyle(segment: WeekInYourLife): string {
        if (!segment.focus) return 'background-color: #e2e8f0';
        
        const color = segment.focus.tags[0]?.color || '#94a3b8';
        const isPast = segment.weekNumberEnd < currentWeekNumber;
        
        if (isPast) {
            return `background-color: ${color}`;
        }
        // Future segments - lighter gradient style
        return `background: linear-gradient(to right, ${color}4d, ${color}1a); border: 1px solid ${color}33`;
    }

    function getSegmentWidth(segment: WeekInYourLife): string {
        const duration = segment.weekNumberEnd - segment.weekNumberStart + 1;
        return `${(duration / lifeSpanWeeks) * 100}%`;
    }

    function getSegmentHeight(segment: WeekInYourLife): string {
        // Future segments are slightly shorter
        if (segment.weekNumberStart >= currentWeekNumber) return 'h-4 hover:h-6';
        return 'h-4 hover:h-8';
    }
</script>

<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-soft relative overflow-hidden mb-8">
    <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
    
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
            <h3 class="font-display text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {lifeSpanWeeks.toLocaleString()} Weeks Overview
            </h3>
            <div class="flex items-center gap-4 text-xs font-medium mt-1">
                <span class="text-slate-400">Week {currentWeekNumber.toLocaleString()} of {lifeSpanWeeks.toLocaleString()}</span>
            </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap-reverse justify-end">
            <button 
                class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all flex items-center justify-center order-4"
                onclick={onShowHelp}
                title="About Life in Weeks"
            >
                <UnchangeableIcon name={IconType.HELP} class="text-[20px]" />
            </button>
            <button 
                class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all flex items-center justify-center order-3"
                onclick={onOpenSettings}
                title="Settings"
            >
                <UnchangeableIcon name={IconType.SETTINGS} class="text-[20px]" />
            </button>
            <button 
                class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap order-2"
                onclick={onAddSpecialEvent}
            >
                <UnchangeableIcon name={IconType.ADD} class="text-[16px]" />
                <span class="hidden sm:inline">Special Week</span>
                <span class="sm:hidden">Special</span>
            </button>
            <button 
                class="bg-primary text-white hover:bg-primary-dark px-3 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap order-1"
                onclick={onAddChapter}
            >
                <UnchangeableIcon name={IconType.ADD} class="text-[16px]" />
                <span class="hidden sm:inline">Life Chapter</span>
                <span class="sm:hidden">Chapter</span>
            </button>
        </div>
    </div>

    <div class="relative h-14 w-full flex items-end">
        <!-- Timeline Segments -->
        <div class="h-full flex-1 flex gap-[2px] w-full relative">
            {#each timeline as segment}
                <div 
                    class="{getSegmentHeight(segment)} rounded-sm timeline-segment"
                    style="width: {getSegmentWidth(segment)}; {getSegmentStyle(segment)}"
                    title="{segment.focus?.name || 'Unplanned'} (Week {segment.weekNumberStart.toLocaleString()}-{segment.weekNumberEnd.toLocaleString()})"
                ></div>
            {/each}
            
            <!-- Active Life Marker -->
            {#if activeLifePosition < 100}
                <div 
                    class="absolute -top-1 bottom-0 w-0.5 bg-green-500 z-5 flex flex-col items-center pointer-events-none opacity-70"
                    style="left: {activeLifePosition}%"
                >
                    <div class="w-2 h-2 rounded-full bg-green-500 -mt-1 ring-2 ring-white dark:ring-surface-dark shadow-sm"></div>
                    <div class="mt-auto mb-[-28px] px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-sm">
                        Active Life
                    </div>
                </div>
            {/if}
            
            <!-- Now Marker -->
            <div 
                class="absolute -top-1 bottom-0 w-0.5 bg-primary z-10 flex flex-col items-center pointer-events-none"
                style="left: {nowPosition}%"
            >
                <div class="w-2.5 h-2.5 rounded-full bg-primary -mt-1.5 ring-2 ring-white dark:ring-surface-dark shadow-sm"></div>
                <div class="mt-auto mb-[-28px] px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-sm">
                    Now
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-between mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Birth</span>
        <span>Age 40</span>
        <span>Age 80</span>
    </div>
</div>

<style>
    .timeline-segment {
        transition: all 0.2s ease;
    }
    .timeline-segment:hover {
        transform: scaleY(1.2);
    }
</style>
