<script lang="ts">
    import LifeSummary from './LifeSummary.svelte';
    import YearlyWaffleChart from './YearlyWaffleChart.svelte';
    import LifeTimeline from './LifeTimeline.svelte';
    import PurposeRadar from './PurposeRadar.svelte';
    import Onboarding from './Onboarding.svelte';
    import SettingsModal from './SettingsModal.svelte';
    import HelpModal from './HelpModal.svelte';
    import { lifeInWeeksState, actions, derivedValues, initPersistence, isStateLoaded, FIXED_PURPOSES } from '$lib/stores/lifeInWeeks';
	import { getLifeSpanWeeks } from '@ously/core/time/app/weekInYourLife';
	import ShareButton from '@ously/ui/components/customComponents/ShareButton.svelte';
    import type { LifeChapter } from '@ously/core/time/repo/lifeChapter';
    import type { Tag } from '@ously/core/utils/id';
    import { getWeekStartDateAndEndDate } from '@ously/core/time/app/weekInYourLife';
    import { UnchangeableIcon, IconType } from '@ously/ui';

    // Initialize persistence to save state to localStorage
    initPersistence();

    let { id = '' } = $props();
    let isSettingsModalOpen = $state(false);
    let isHelpModalOpen = $state(false);
    
    // Settings state
    let birthDateState = $state<Date>(lifeInWeeksState.birthDate);
    let lifeSpanYearsState = $state<number>(lifeInWeeksState.lifeSpanWeeks / 52);
    let lifeSpanWeeksState = $derived(getLifeSpanWeeks(birthDateState, lifeSpanYearsState));
    let activeLifeYearsState = $state<number>(lifeInWeeksState.activeLifeYears);
    
    // Data state (reactive to store)
    let allTagsState = $state<Tag[]>(lifeInWeeksState.tags);

    // Derived values from store for child components
    let timeline = $derived(derivedValues.timeline);
    let currentWeekNumber = $derived(derivedValues.currentWeekNumber);
    let remainingWeeks = $derived(derivedValues.remainingWeeks);
    let lifeProgress = $derived(derivedValues.lifeProgress);
    let tagStats = $derived(derivedValues.tagStats);
    let remainingActiveYears = $derived(derivedValues.remainingActiveYears);

    function getWeekNumber(date: Date, birthDate: Date): number {
        const diffTime = date.getTime() - birthDate.getTime();
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        return diffWeeks;
    }

    function openSettingsModal() {
        isSettingsModalOpen = true;
    }

    function closeSettingsModal() {
        isSettingsModalOpen = false;
    }

    function openHelpModal() {
        isHelpModalOpen = true;
        actions.setHelpModalOpened();
    }

    function closeHelpModal() {
        isHelpModalOpen = false;
    }
    
    function handleResetToDefaults() {
        actions.clearStorage();
        actions.reset();
        window.location.reload();
    }
    
    function handleAddTag(tag: Tag) {
        allTagsState = [...allTagsState, tag];
        actions.addTag(tag);
    }

    // Handle onboarding completion
    function handleOnboardingComplete(
        birthDate: Date, 
        lifeSpanYears: number, 
        activeLifeYearsVal: number,
        pastChapters: { name: string; startDate: Date; endDate: Date; purpose?: { id: string; name: string; color: string } }[],
        futureChapters: { name: string; startDate: Date; endDate: Date; purpose?: { id: string; name: string; color: string } }[]
    ) {
        birthDateState = birthDate;
        lifeSpanYearsState = lifeSpanYears;
        activeLifeYearsState = activeLifeYearsVal;
        
        actions.setBirthDate(birthDate);
        actions.setLifeSpan(lifeSpanYears);
        actions.setActiveLifeYears(activeLifeYearsVal);

        // Add Past Chapters
        pastChapters.forEach(chapter => {
            const startWeek = getWeekNumber(chapter.startDate, birthDate);
            const endWeek = getWeekNumber(chapter.endDate, birthDate);
            
            actions.addChapter({
                id: crypto.randomUUID(),
                name: chapter.name,
                description: 'Added during onboarding',
                startWeekNumber: Math.max(0, startWeek),
                endWeekNumber: Math.max(0, endWeek),
                tags: chapter.purpose ? [{ id: chapter.purpose.id, name: chapter.purpose.name, color: chapter.purpose.color }] : []
            });
        });

        // Add Future Chapters
        futureChapters.forEach(chapter => {
            const startWeek = getWeekNumber(chapter.startDate, birthDate);
            const endWeek = getWeekNumber(chapter.endDate, birthDate);
            
            actions.addChapter({
                id: crypto.randomUUID(),
                name: chapter.name,
                description: 'Added during onboarding',
                startWeekNumber: Math.max(0, startWeek),
                endWeekNumber: Math.max(0, endWeek),
                tags: chapter.purpose ? [{ id: chapter.purpose.id, name: chapter.purpose.name, color: chapter.purpose.color }] : []
            });
        });

        actions.completeOnboarding();
    }

    function handleSkipOnboarding() {
        actions.completeOnboarding();
    }

</script>

{#if !isStateLoaded.value}
    <!-- Wait for state to load -->
    <div class="max-w-6xl mx-auto pb-12 scroll-mt-8 flex items-center justify-center min-h-[400px]">
        <div class="animate-pulse text-slate-400">Loading...</div>
    </div>
{:else if !lifeInWeeksState.hasCompletedOnboarding}
    <Onboarding 
        onComplete={handleOnboardingComplete} 
        onSkip={handleSkipOnboarding} 
        allPurposes={FIXED_PURPOSES}
    />
{:else}
    <div {id} class="max-w-6xl mx-auto pb-12 scroll-mt-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UnchangeableIcon name={IconType.SCHEDULE} class="w-6 h-6 text-slate-900 dark:text-white" />
                    Life Chapters
                </h2>
                <p class="text-slate-500 dark:text-slate-400 mt-1">
                    Visualize your life in weeks. Every dot is a week of your life.
                </p>
            </div>
            <div class="flex items-center gap-2">
                <ShareButton 
                    title="Life Chapters" 
                    text="Check out my life chapters visualization!" 
                    url={window.location.href} 
                />
                <button 
                    onclick={openHelpModal}
                    class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label="Help"
                >
                    <UnchangeableIcon name={IconType.INFO} class="w-5 h-5" />
                </button>
                <button 
                    onclick={openSettingsModal}
                    class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label="Settings"
                >
                    <UnchangeableIcon name={IconType.SETTINGS} class="w-5 h-5" />
                </button>
            </div>
        </div>

        <SettingsModal 
            isOpen={isSettingsModalOpen} 
            onClose={closeSettingsModal}
            onReset={handleResetToDefaults}
            birthDate={birthDateState}
            lifeSpanYears={lifeSpanYearsState}
            activeLifeYears={activeLifeYearsState}
            onUpdate={(newBirthDate, newLifeSpanYears, newActiveLifeYears) => {
                birthDateState = newBirthDate;
                lifeSpanYearsState = newLifeSpanYears;
                activeLifeYearsState = newActiveLifeYears;
                
                actions.setBirthDate(newBirthDate);
                actions.setLifeSpan(newLifeSpanYears);
                actions.setActiveLifeYears(newActiveLifeYears);
            }}
        />

        <HelpModal 
            isOpen={isHelpModalOpen} 
            onClose={closeHelpModal} 
        />

        <LifeSummary 
            {remainingWeeks} 
            {lifeProgress} 
            {remainingActiveYears}
            {tagStats}
            currentAge={derivedValues.currentAge}
        />

        <YearlyWaffleChart
            birthDate={birthDateState}
            {timeline}
            lifeSpanYears={lifeSpanYearsState}
            {currentWeekNumber}
            activeLifeYears={activeLifeYearsState}
        />

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <LifeTimeline
                birthDate={birthDateState}
                lifeSpanYears={lifeSpanYearsState}
                activeLifeYears={activeLifeYearsState}
                lifeChapters={lifeInWeeksState.lifeChapters}
            />
            <PurposeRadar
                lifeChapters={lifeInWeeksState.lifeChapters}
                purposes={FIXED_PURPOSES}
            />
        </div>
    </div>
{/if}
