<script lang="ts">
    import { Button, Calendar, Popover } from '@ously/ui';
    import type { Tag } from '@ously/core/utils/id';
    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
    import CalendarIcon from '@lucide/svelte/icons/calendar-days';
    import HeartIcon from '@lucide/svelte/icons/heart';
    import SparklesIcon from '@lucide/svelte/icons/sparkles';
    import RocketIcon from '@lucide/svelte/icons/rocket';
    import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
    import type { Purpose } from '@ously/core/utils/id';
    import { CheckIcon, ArrowLeftIcon, XIcon, PlusIcon, InfoIcon } from 'lucide-svelte';
    import HistoryIcon from '@lucide/svelte/icons/history';
    import TelescopeIcon from '@lucide/svelte/icons/telescope';
    import TrashIcon from '@lucide/svelte/icons/trash-2';
    import BabyIcon from '@lucide/svelte/icons/baby';
    import { getLocalTimeZone, today, CalendarDate, type DateValue } from '@internationalized/date';
    import { fade, slide, fly } from 'svelte/transition';

    interface ChapterData {
        name: string;
        startDate: Date;
        endDate: Date;
        purpose?: Purpose;
    }

    interface Props {
        onComplete: (
            birthDate: Date, 
            lifeSpanYears: number, 
            activeLifeYears: number,
            pastChapters: ChapterData[],
            futureChapters: ChapterData[]
        ) => void;
        onSkip: () => void;
        allPurposes: Purpose[];
        onAddPurpose?: (purpose: Purpose) => void;
    }

    let { onComplete, onSkip, allPurposes }: Props = $props();

    // Current step
    let currentStep = $state(1);
    const totalSteps = 3;

    // Step 1: Basics
    let datePickerOpen = $state(false);
    let calendarValue = $state<DateValue | undefined>(undefined);
    let lifeSpanYears = $state(80);
    let activeLifeYears = $state(65);

    // Step 2: Past Chapters (Timeline Tree)
    let pastChapters = $state<ChapterData[]>([]);
    
    // Current Entry State
    let entryName = $state('');
    let entryEndOpen = $state(false);
    let entryEndValue = $state<DateValue | undefined>(undefined);
    let entrySelectedPurpose = $state<Purpose | undefined>(undefined);
    let isCurrentActivity = $state(false);

    // Derived start date for the next chapter (Birth date or end of last chapter)
    let nextStartDate = $derived.by(() => {
        if (pastChapters.length > 0) {
            return pastChapters[pastChapters.length - 1].endDate;
        }
        if (calendarValue) {
            return calendarValue.toDate(getLocalTimeZone());
        }
        return new Date();
    });

    // Step 3: Future Chapters (Timeline Tree)
    let futureChapters = $state<ChapterData[]>([]);
    let futureEntryName = $state('');
    let futureEntryEndOpen = $state(false);
    let futureEntryEndValue = $state<DateValue | undefined>(undefined);
    let futureEntrySelectedPurpose = $state<Purpose | undefined>(undefined);
    
    // Derived: Next future chapter start date ("now" or end of last future chapter)
    let nextFutureStartDate = $derived.by(() => {
        if (futureChapters.length > 0) {
            return futureChapters[futureChapters.length - 1].endDate;
        }
        return new Date(); // Start from "now"
    });
    
    // Calculate active life end date from birth date
    let activeLifeEndDate = $derived.by(() => {
        if (calendarValue) {
            const birthDate = calendarValue.toDate(getLocalTimeZone());
            const endDate = new Date(birthDate);
            endDate.setFullYear(birthDate.getFullYear() + activeLifeYears);
            return endDate;
        }
        return new Date();
    });

    // Validation
    let isBirthdateBeforeToday = $derived(calendarValue !== undefined && calendarValue.compare(today(getLocalTimeZone())) < 0);
    let isStep1Valid = $derived(calendarValue !== undefined && isBirthdateBeforeToday && lifeSpanYears > 0 && activeLifeYears > 0 && activeLifeYears <= lifeSpanYears);
    
    // Step 2 is valid if the user has marked an activity as "Current" (reaching now)
    // If pastChapters is empty, it's valid (skip). If not empty, must end with current activity.
    let isStep2Valid = $derived(pastChapters.length === 0 || pastChapters[pastChapters.length - 1].endDate.getTime() >= new Date().setHours(0,0,0,0));

    let isStep3Valid = $derived(true); // Always valid - future chapters are optional

    let isValid = $derived(
        currentStep === 1 ? isStep1Valid :
        currentStep === 2 ? isStep2Valid :
        isStep3Valid
    );

    function addChapter() {
        if (!entryName || (!entryEndValue && !isCurrentActivity) || !entrySelectedPurpose) return;

        let endDate: Date;
        if (isCurrentActivity) {
            endDate = new Date(); // Now
        } else if (entryEndValue) {
            endDate = entryEndValue.toDate(getLocalTimeZone());
        } else {
            return;
        }

        // Ensure end date is after start date
        if (endDate <= nextStartDate) {
            // Simple validation: just don't add if invalid
            return;
        }

        pastChapters = [
            ...pastChapters,
            {
                name: entryName,
                startDate: nextStartDate,
                endDate: endDate,
                purpose: entrySelectedPurpose
            }
        ];

        // Reset entry form
        entryName = '';
        entryEndValue = undefined;
        isCurrentActivity = false;
        entrySelectedPurpose = undefined;
    }

    function removeLastChapter() {
        if (pastChapters.length > 0) {
            pastChapters = pastChapters.slice(0, -1);
        }
    }

    function handleNext() {
        if (currentStep < totalSteps) {
            currentStep++;
        } else {
            handleComplete();
        }
    }

    function handleBack() {
        if (currentStep > 1) {
            currentStep--;
        }
    }

    function handleComplete() {
        if (calendarValue && isStep1Valid) {
            const birthDate = calendarValue.toDate(getLocalTimeZone());
            onComplete(birthDate, lifeSpanYears, activeLifeYears, pastChapters, futureChapters);
        }
    }
    
    // Add future chapter
    function addFutureChapter() {
        if (!futureEntryName || !futureEntryEndValue || !futureEntrySelectedPurpose) return;
        
        const endDate = futureEntryEndValue.toDate(getLocalTimeZone());
        
        // Ensure end date is after start date and before active life end
        if (endDate <= nextFutureStartDate || endDate > activeLifeEndDate) {
            return;
        }
        
        futureChapters = [
            ...futureChapters,
            {
                name: futureEntryName,
                startDate: nextFutureStartDate,
                endDate: endDate,
                purpose: futureEntrySelectedPurpose
            }
        ];
        
        // Reset entry form
        futureEntryName = '';
        futureEntryEndValue = undefined;
        futureEntrySelectedPurpose = undefined;
    }
    
    function removeLastFutureChapter() {
        if (futureChapters.length > 0) {
            futureChapters = futureChapters.slice(0, -1);
        }
    }
    


    function formatDate(date: DateValue | undefined) {
        if (!date) return "Select date";
        return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    function formatJsDate(date: Date) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
</script>

{#snippet datePicker(label: string, value: DateValue | undefined, open: boolean, onOpenChange: (o: boolean) => void, onValueChange: (v: DateValue | undefined) => void)}
    <div class="space-y-2">
        <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <CalendarIcon class="w-3.5 h-3.5" />
            {label}
        </label>
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger>
                {#snippet child({ props }: { props: Record<string, unknown> })}
                    <Button
                        {...props}
                        variant="outline"
                        class="w-full justify-between font-normal rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-5 px-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
                    >
                        {formatDate(value)}
                        <ChevronDownIcon class="h-4 w-4 text-slate-400" />
                    </Button>
                {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    type="single"
                    value={value}
                    captionLayout="dropdown"
                    onValueChange={(v) => {
                        onValueChange(v);
                        onOpenChange(false);
                    }}
                />
            </Popover.Content>
        </Popover.Root>
    </div>
{/snippet}

<div 
    class="w-full max-w-6xl mx-auto pb-12 scroll-mt-8"
    in:fade={{ duration: 200 }}
>
    <div class="max-w-lg mx-auto">
        <!-- Card Container -->
        <div 
            class="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden min-h-[500px] flex flex-col"
            in:fly={{ y: 20, duration: 400, delay: 100 }}
        >
            <!-- Progress indicator -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                <div 
                    class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style="width: {(currentStep / totalSteps) * 100}%"
                ></div>
            </div>

            <!-- Header -->
            <div class="px-8 pt-10 pb-6 text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-300">
                    {#if currentStep === 1}
                        <SparklesIcon class="w-7 h-7 text-white" />
                    {:else if currentStep === 2}
                        <HistoryIcon class="w-7 h-7 text-white" />
                    {:else}
                        <TelescopeIcon class="w-7 h-7 text-white" />
                    {/if}
                </div>
                <h1 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {#if currentStep === 1}
                        Welcome to Life Chapters
                    {:else if currentStep === 2}
                        Reflect on the Past
                    {:else}
                        Envision the Future
                    {/if}
                </h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                    {#if currentStep === 1}
                        Visualize your life in weeks. Let's personalize your timeline.
                    {:else if currentStep === 2}
                        Add a significant chapter from your past to start your timeline (optional).
                    {:else}
                        What's a major goal or chapter you're looking forward to? (optional).
                    {/if}
                </p>
            </div>

            <!-- Form Content -->
            <div class="px-8 pb-6 space-y-5 flex-1">
                {#if currentStep === 1}
                    <div in:fade={{ duration: 200 }}>
                        <!-- Date of Birth -->
                        {@render datePicker("Date of Birth", calendarValue, datePickerOpen, (o) => datePickerOpen = o, (v) => calendarValue = v)}

                        <!-- Years Inputs -->
                        <div class="grid grid-cols-2 gap-4 mt-5">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500" for="onboarding-active-life">
                                    <HeartIcon class="w-3.5 h-3.5" />
                                    Active Life
                                </label>
                                <div class="relative">
                                    <input 
                                        id="onboarding-active-life"
                                        type="number"
                                        min="1" 
                                        max="120" 
                                        bind:value={activeLifeYears}
                                        class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono text-base py-3 font-semibold shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                                    />
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium">yrs</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500" for="onboarding-lifespan">
                                    <SparklesIcon class="w-3.5 h-3.5" />
                                    Lifespan
                                </label>
                                <div class="relative">
                                    <input 
                                        id="onboarding-lifespan"
                                        type="number"
                                        min="1" 
                                        max="120" 
                                        bind:value={lifeSpanYears}
                                        class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center font-mono text-base py-3 font-semibold shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                                    />
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium">yrs</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed mt-4">
                            <strong>Active life</strong> = age until you can adventure freely. <strong>Lifespan</strong> = expected total years.
                        </p>
                    </div>
                {:else if currentStep === 2}
                    <div in:fade={{ duration: 200 }} class="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div class="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                            
                            <!-- Birth Node -->
                            <div class="relative">
                                <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                    <BabyIcon class="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-slate-900 dark:text-white">Born</div>
                                    <div class="text-xs text-slate-500 font-mono mt-0.5">
                                        {formatDate(calendarValue)}
                                    </div>
                                </div>
                            </div>

                            <!-- Past Chapters -->
                            {#each pastChapters as chapter, i}
                                <div class="relative" in:slide|local={{ duration: 200 }}>
                                    <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10"
                                        style="background-color: {chapter.purpose?.color || '#6366f1'}20">
                                        <div class="w-2 h-2 rounded-full" style="background-color: {chapter.purpose?.color || '#6366f1'}"></div>
                                    </div>
                                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                                        <div class="flex justify-between items-start gap-2">
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm font-bold text-slate-900 dark:text-white">{chapter.name}</span>
                                                    {#if chapter.purpose}
                                                        <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium" 
                                                            style="background-color: {chapter.purpose.color}20; color: {chapter.purpose.color}">
                                                            #{chapter.purpose.name}
                                                        </span>
                                                    {/if}
                                                </div>
                                                <div class="text-xs text-slate-500 font-mono mt-1">
                                                    {formatJsDate(chapter.startDate)} - {formatJsDate(chapter.endDate)}
                                                </div>
                                            </div>
                                            {#if i === pastChapters.length - 1}
                                                <button 
                                                    onclick={removeLastChapter}
                                                    class="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Remove last chapter"
                                                >
                                                    <TrashIcon class="w-3.5 h-3.5" />
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}

                            <!-- Add Next Chapter Form -->
                            {#if !isStep2Valid || pastChapters.length === 0}
                                <div class="relative pt-2" in:slide|local>
                                    <div class="absolute -left-[29px] top-6 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                        <PlusIcon class="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    
                                    <div class="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 space-y-4">
                                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            Add Next Chapter
                                        </div>
                                        
                                        <!-- Start Date (Locked) -->
                                        <div class="text-xs text-slate-400 flex items-center gap-2">
                                            <span class="font-semibold">Starts:</span>
                                            <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {formatJsDate(nextStartDate)}
                                            </span>
                                        </div>

                                        <!-- Name Input -->
                                        <input 
                                            type="text"
                                            placeholder="Chapter Name (e.g. High School)"
                                            bind:value={entryName}
                                            class="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />

                                        <!-- End Date or Current -->
                                        <div class="space-y-3">
                                            <div class="flex items-center gap-2">
                                                <input 
                                                    id="current-activity" 
                                                    type="checkbox"
                                                    bind:checked={isCurrentActivity}
                                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label 
                                                    for="current-activity" 
                                                    class="text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                                                >
                                                    I am currently doing this
                                                </label>
                                            </div>

                                            {#if !isCurrentActivity}
                                                <div in:slide|local>
                                                    {@render datePicker("End Date", entryEndValue, entryEndOpen, (o) => entryEndOpen = o, (v) => entryEndValue = v)}
                                                </div>
                                            {/if}
                                        </div>
                                        
                                        <!-- Purpose Selection -->
                                        <div class="space-y-2">
                                            <div class="flex items-center gap-1.5">
                                                <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Purpose</div>

                                            </div>
                                            <div class="flex flex-wrap gap-1.5">
                                                {#each allPurposes as purpose}
                                                    <button
                                                        type="button"
                                                        class="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all {entrySelectedPurpose?.id === purpose.id ? 'border-transparent shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300'}"
                                                        style={entrySelectedPurpose?.id === purpose.id ? `background-color: ${purpose.color}20; color: ${purpose.color}; border-color: ${purpose.color}` : ''}
                                                        onclick={() => entrySelectedPurpose = entrySelectedPurpose?.id === purpose.id ? undefined : purpose}
                                                    >
                                                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: {purpose.color}"></span>
                                                        {purpose.name}
                                                    </button>
                                                {/each}
                                            </div>
                                        </div>

                                        <!-- Add Button -->
                                        <button
                                            onclick={addChapter}
                                            disabled={!entryName || (!entryEndValue && !isCurrentActivity) || !entrySelectedPurpose}
                                            class="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Chapter
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <!-- Completion State -->
                                <div class="relative pt-2" in:slide|local>
                                    <div class="absolute -left-[29px] top-2 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <div class="text-sm text-green-600 dark:text-green-400 font-medium py-2">
                                        Timeline up to date!
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else if currentStep === 3}
                    <div in:fade={{ duration: 200 }} class="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div class="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                            
                            <!-- Now Node -->
                            <div class="relative">
                                <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-green-600 dark:text-green-400">Now</div>
                                    <div class="text-xs text-slate-500 font-mono mt-0.5">
                                        {formatJsDate(new Date())}
                                    </div>
                                </div>
                            </div>

                            <!-- Future Chapters -->
                            {#each futureChapters as chapter, i}
                                <div class="relative" in:slide|local={{ duration: 200 }}>
                                    <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10"
                                        style="background-color: {chapter.purpose?.color || '#8b5cf6'}20">
                                        <div class="w-2 h-2 rounded-full" style="background-color: {chapter.purpose?.color || '#8b5cf6'}"></div>
                                    </div>
                                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                                        <div class="flex justify-between items-start gap-2">
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm font-bold text-slate-900 dark:text-white">{chapter.name}</span>
                                                    {#if chapter.purpose}
                                                        <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium" 
                                                            style="background-color: {chapter.purpose.color}20; color: {chapter.purpose.color}">
                                                            #{chapter.purpose.name}
                                                        </span>
                                                    {/if}
                                                </div>
                                                <div class="text-xs text-slate-500 font-mono mt-1">
                                                    {formatJsDate(chapter.startDate)} - {formatJsDate(chapter.endDate)}
                                                </div>
                                            </div>
                                            {#if i === futureChapters.length - 1}
                                                <button 
                                                    onclick={removeLastFutureChapter}
                                                    class="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Remove last chapter"
                                                >
                                                    <TrashIcon class="w-3.5 h-3.5" />
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/each}

                            <!-- Add Future Chapter Form (only if not at active life end) -->
                            {#if nextFutureStartDate < activeLifeEndDate}
                                <div class="relative pt-2" in:slide|local>
                                    <div class="absolute -left-[29px] top-6 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                        <PlusIcon class="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    
                                    <div class="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 space-y-4">
                                        <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            Add Future Chapter
                                        </div>
                                        
                                        <!-- Start Date (Locked) -->
                                        <div class="text-xs text-slate-400 flex items-center gap-2">
                                            <span class="font-semibold">Starts:</span>
                                            <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {formatJsDate(nextFutureStartDate)}
                                            </span>
                                        </div>

                                        <!-- Name Input -->
                                        <input 
                                            type="text"
                                            placeholder="Chapter Name (e.g. Retirement)"
                                            bind:value={futureEntryName}
                                            class="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />

                                        <!-- End Date -->
                                        {@render datePicker("End Date", futureEntryEndValue, futureEntryEndOpen, (o) => futureEntryEndOpen = o, (v) => futureEntryEndValue = v)}
                                        
                                        <!-- Purpose Selection -->
                                        <div class="space-y-2">
                                            <div class="flex items-center gap-1.5">
                                                <div class="text-xs font-bold uppercase tracking-wider text-slate-500">Purpose</div>

                                            </div>
                                            <div class="flex flex-wrap gap-1.5">
                                                {#each allPurposes as purpose}
                                                    <button
                                                        type="button"
                                                        class="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all {futureEntrySelectedPurpose?.id === purpose.id ? 'border-transparent shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300'}"
                                                        style={futureEntrySelectedPurpose?.id === purpose.id ? `background-color: ${purpose.color}20; color: ${purpose.color}; border-color: ${purpose.color}` : ''}
                                                        onclick={() => futureEntrySelectedPurpose = futureEntrySelectedPurpose?.id === purpose.id ? undefined : purpose}
                                                    >
                                                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: {purpose.color}"></span>
                                                        {purpose.name}
                                                    </button>
                                                {/each}
                                            </div>
                                        </div>

                                        <!-- Add Button -->
                                        <button
                                            onclick={addFutureChapter}
                                            disabled={!futureEntryName || !futureEntryEndValue || !futureEntrySelectedPurpose}
                                            class="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Chapter
                                        </button>
                                    </div>
                                </div>
                            {/if}

                            <!-- Active Life End Node -->
                            <div class="relative">
                                <div class="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                                    <HeartIcon class="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-amber-600 dark:text-amber-400">Active Life Ends</div>
                                    <div class="text-xs text-slate-500 font-mono mt-0.5">
                                        {formatJsDate(activeLifeEndDate)} (Age {activeLifeYears})
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Info Note -->
                        <div class="flex gap-2 items-start p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/20">
                            <SparklesIcon class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <p class="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                                Plan significant future chapters like retirement, big trips, or milestones. This step is <strong>optional</strong> — you can skip or add more later.
                            </p>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Footer with buttons -->
            <div class="px-8 pb-8">
                <div class="flex items-center gap-3">
                    {#if currentStep === 1}
                        <!-- Skip Button -->
                        <button
                            onclick={onSkip}
                            class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                        >
                            <XIcon class="w-4 h-4" />
                            Skip
                        </button>
                    {:else}
                        <!-- Back Button -->
                        <button
                            onclick={handleBack}
                            class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <ArrowLeftIcon class="w-4 h-4" />
                            Back
                        </button>
                    {/if}

                    <!-- Next/Complete Button -->
                    <button
                        onclick={handleNext}
                        disabled={!isValid}
                        class="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
                    >
                        {#if currentStep < totalSteps}
                            Next
                            <ChevronRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        {:else}
                            <RocketIcon class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            Start My Journey
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Footer note -->
            <div class="px-8 pb-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                <p class="text-[10px] text-slate-400 dark:text-slate-500">
                    You can update these settings anytime from the app.
                </p>
            </div>
        </div>
    </div>
</div>
