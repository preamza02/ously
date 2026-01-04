<script lang="ts">
    import type { WeekInYourLife } from '@ously/core/time/repo/lifeChapter';

    let { birthDate, timeline, lifeSpanYears, currentWeekNumber, activeLifeYears = 65 } = $props<{
        birthDate: Date;
        timeline: WeekInYourLife[];
        lifeSpanYears: number;
        currentWeekNumber: number;
        activeLifeYears?: number;
    }>();

    // Calculate current age
    let currentAge = $derived(() => {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    });

    // Selected age state
    let selectedAge = $state<number>(-1);

    // Initialize selectedAge to current age on mount
    $effect(() => {
        if (selectedAge === -1) {
            selectedAge = currentAge();
        }
    });

    // Calculate the start date for a given age (birthday + age years)
    function getAgeStartDate(age: number): Date {
        const start = new Date(birthDate);
        start.setFullYear(birthDate.getFullYear() + age);
        return start;
    }

    // Calculate the end date for a given age (birthday + age+1 years - 1 day)
    function getAgeEndDate(age: number): Date {
        const end = new Date(birthDate);
        end.setFullYear(birthDate.getFullYear() + age + 1);
        end.setDate(end.getDate() - 1);
        return end;
    }

    // Calculate weeks for a specific age based on real dates
    interface WeekData {
        weekNumber: number; // Week from birth
        weekInYear: number; // Week number within this year (1, 2, 3...)
        weeksRemaining: number; // Weeks till death
        startDate: Date;
        endDate: Date;
        focus: WeekInYourLife | undefined;
        isCurrentWeek: boolean;
    }

    function getWeeksForAge(age: number): WeekData[] {
        const ageStart = getAgeStartDate(age);
        const ageEnd = getAgeEndDate(age);
        
        const weeks: WeekData[] = [];
        let currentStart = new Date(ageStart);
        let weekInYear = 1;
        
        // Calculate total life weeks (for remaining calculation)
        const totalLifeWeeks = lifeSpanYears * 52;
        
        while (currentStart <= ageEnd) {
            // Calculate week end (7 days from start)
            const weekEnd = new Date(currentStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            // Clamp to age end if needed
            const effectiveEnd = weekEnd > ageEnd ? ageEnd : weekEnd;
            
            // Calculate week number from birth
            const diffTime = currentStart.getTime() - birthDate.getTime();
            const weekNumber = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
            
            // Find focus for this week
            const focus = timeline.find((t: WeekInYourLife) => 
                weekNumber >= t.weekNumberStart && weekNumber <= t.weekNumberEnd
            );
            
            const isCurrentWeek = weekNumber === currentWeekNumber;
            const weeksRemaining = totalLifeWeeks - weekNumber;
            
            weeks.push({
                weekNumber,
                weekInYear,
                weeksRemaining,
                startDate: new Date(currentStart),
                endDate: effectiveEnd,
                focus,
                isCurrentWeek
            });
            
            // Move to next week
            currentStart.setDate(currentStart.getDate() + 7);
            weekInYear++;
        }
        
        return weeks;
    }

    let weeksGrid = $derived(() => {
        return getWeeksForAge(selectedAge);
    });



    // Get date range display
    let dateRange = $derived(() => {
        const weeks = weeksGrid();
        if (weeks.length === 0) return { start: '', end: '', weekStart: 0, weekEnd: 0 };
        
        const firstWeek = weeks[0];
        const lastWeek = weeks[weeks.length - 1];
        
        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        return {
            start: formatDate(firstWeek.startDate),
            end: formatDate(lastWeek.endDate),
            weekStart: firstWeek.weekNumber,
            weekEnd: lastWeek.weekNumber
        };
    });

    function getWeekColor(focus: WeekInYourLife | undefined, isPast: boolean): string {
        if (!focus?.focus) {
            return isPast ? '#cbd5e1' : '#e2e8f0';
        }
        const color = focus.focus.tags[0]?.color || '#94a3b8';
        return isPast ? color : `${color}66`;
    }

    function isWeekPast(weekNumber: number): boolean {
        return weekNumber < currentWeekNumber;
    }

    // For tooltip
    let hoveredWeek = $state<WeekData | null>(null);
    
    function formatDateShort(d: Date): string {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
</script>

<div class="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-soft mb-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white">Year Explorer</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
                Visualizing 52 weeks of age {selectedAge}
            </p>
        </div>

        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <button 
                    class="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    disabled={selectedAge <= 0}
                    onclick={() => selectedAge--}
                >
                    ←
                </button>
                <span class="font-mono font-bold w-16 text-center">Age {selectedAge}</span>
                <button 
                    class="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    disabled={selectedAge >= lifeSpanYears - 1}
                    onclick={() => selectedAge++}
                >
                    →
                </button>
            </div>
        </div>
    </div>

    <!-- Age Slider -->
    <div class="mb-6 px-2">
            <div class="relative">
                <input 
                    type="range" 
                    min="0" 
                    max={lifeSpanYears - 1} 
                    bind:value={selectedAge}
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                />
                <!-- Current Age Indicator -->
                <div 
                    class="absolute top-1/2 -translate-y-1/2 pointer-events-none" 
                    style="left: {(currentAge() / (lifeSpanYears - 1)) * 100}%"
                >
                    <div class="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm -translate-x-1/2"></div>
                </div>
                <!-- Active Life End Indicator -->
                <div 
                    class="absolute top-1/2 -translate-y-1/2 pointer-events-none" 
                    style="left: {(activeLifeYears / (lifeSpanYears - 1)) * 100}%"
                >
                    <div class="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm -translate-x-1/2"></div>
                </div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">
                <span>Birth</span>
                <div class="flex items-center gap-4">
                    <span class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        Now ({currentAge()})
                    </span>
                    <span class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        Active ({activeLifeYears})
                    </span>
                </div>
                <span>Age {lifeSpanYears}</span>
            </div>
    </div>

    <!-- Week Range Info -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 dark:text-white">Week {dateRange().weekStart + 1} - {dateRange().weekEnd + 1}</span>
                <span class="text-slate-400">of your life</span>
            </div>
            <div class="flex items-center gap-3 text-slate-500">
                <span>{dateRange().start}</span>
                <span>→</span>
                <span>{dateRange().end}</span>
        </div>
    </div>

    <!-- Content Area -->
    <div class="relative min-h-[300px]">
        <!-- Waffle Grid -->
            <div class="grid grid-cols-13 gap-1">
                {#each weeksGrid() as week}
                    {@const isPast = isWeekPast(week.weekNumber)}
                    <button
                        type="button"
                        class="aspect-square rounded-sm transition-all relative group {isPast ? 'hover:scale-110 hover:z-10' : 'opacity-40'}"
                        style="background-color: {week.focus?.focus?.tags[0]?.color || (isPast ? '#e2e8f0' : '#f1f5f9')}"
                        onmouseenter={() => hoveredWeek = week}
                        onmouseleave={() => hoveredWeek = null}
                    >
                        {#if week.isCurrentWeek}
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse"></div>
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>

            <!-- Tooltip -->
            {#if hoveredWeek}
                <div class="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl shadow-lg pointer-events-none whitespace-nowrap z-20">
                    <div class="font-bold mb-0.5">Week {hoveredWeek.weekNumber}</div>
                    <div class="text-slate-300">
                        {formatDateShort(hoveredWeek.startDate)} - {formatDateShort(hoveredWeek.endDate)}
                    </div>
                </div>
            {/if}

            <!-- Week count info -->
            <div class="mt-4 text-center">
                <p class="text-xs text-slate-400">
                    {weeksGrid().length} weeks at age {selectedAge}
                    {#if selectedAge === currentAge()}
                        <span class="text-primary font-medium"> (Current Year)</span>
                    {/if}
                </p>
        </div>
    </div>
</div>
