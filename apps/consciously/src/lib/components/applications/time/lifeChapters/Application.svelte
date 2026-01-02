<script lang="ts">
    import TimelineOverview from './TimelineOverview.svelte';
    import ActiveChapterCard from './ActiveChapterCard.svelte';
    import RecordList from './RecordList.svelte';
    import TimeInsights from './TimeInsights.svelte';
    import AddChapterModal from './AddChapterModal.svelte';
    import SettingsModal from './SettingsModal.svelte';
    import HelpModal from './HelpModal.svelte';
    import { actions, lifeInWeeksState, derivedValues, initPersistence, type LifeChapter , type Tag } from '$lib/stores/lifeInWeeks';
	import { getLifeSpanWeeks } from '@ously/core/time/app/weekInYourLife';
	import { generateId } from '@ously/core/utils/id';

    // Initialize persistence to save state to localStorage
    initPersistence();

    let { id = '' } = $props();
    let isAddChapterModalOpen = $state(false);
    let isSettingsModalOpen = $state(false);
    let isHelpModalOpen = $state(false);
    let addModalMode = $state<'chapter' | 'event'>('chapter');
    
    // Settings state
    let birthDateState = $state<Date>(lifeInWeeksState.birthDate);
    let lifeSpanYearsState = $state<number>(lifeInWeeksState.lifeSpanWeeks / 52);
    let lifeSpanWeeksState = $derived(getLifeSpanWeeks(birthDateState, lifeSpanYearsState));
    let activeLifeYearsState = $state<number>(lifeInWeeksState.activeLifeYears);
    
    // Data state (reactive to store)
    let allTagsState = $state<Tag[]>(lifeInWeeksState.tags);
    let allChapterState = $state<LifeChapter[]>(lifeInWeeksState.lifeChapters);
    let allSpecialWeeksState = $state<LifeChapter[]>(lifeInWeeksState.specialWeeks);

    // Derived values from store for child components
    let timeline = $derived(derivedValues.timeline);
    let currentWeekNumber = $derived(derivedValues.currentWeekNumber);
    let currentChapter = $derived(derivedValues.currentChapter);
    let upcomingEvents = $derived(derivedValues.upcomingEvents);
    let remainingWeeks = $derived(derivedValues.remainingWeeks);
    let lifeProgress = $derived(derivedValues.lifeProgress);
    let tagStats = $derived(derivedValues.tagStats);
    let remainingActiveYears = $derived(derivedValues.remainingActiveYears);
    let unplannedWeeks = $derived(derivedValues.unplannedWeeks);

    function openAddChapterModal() {
        addModalMode = 'chapter';
        isAddChapterModalOpen = true;
    }

    function closeAddModel() {
        isAddChapterModalOpen = false;
    }
    
    function openAddSpecialEventModal() {
        addModalMode = 'event';
        isAddChapterModalOpen = true;
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
    function settingOnHandleSubmit(birthDate: Date, lifeSpanYears: number, activeLifeYears: number) {
        birthDateState = birthDate;
        lifeSpanYearsState = lifeSpanYears;
        activeLifeYearsState = activeLifeYears;
        actions.setBirthDate(birthDate);
        actions.setLifeSpan(lifeSpanYears);
        actions.setActiveLifeYears(activeLifeYears);

        closeSettingsModal();
    }

    function handleResetToDefaults() {
        actions.clearStorage();
        actions.reset();
        window.location.reload();
    }
    
    function addModalOnHandleSubmit(name: string, description: string, startWeek: number | undefined, endWeek: number | undefined, selectedTag: Tag | undefined) {
        if (!name || startWeek == undefined || endWeek == undefined || !selectedTag) {
            console.log('Missing required fields', name, description, startWeek, endWeek, selectedTag);
            return;
        }
        if (addModalMode === 'chapter') {
            const newChapter: LifeChapter = {
                id: generateId(),
                name,
                description,
                startWeekNumber: startWeek,
                endWeekNumber: endWeek,
                tags: selectedTag ? [selectedTag] : []
            };
            allChapterState = [...allChapterState, newChapter];
            actions.addChapter(newChapter);
        } else {
            const newSpecialEvent: LifeChapter = {
                id: generateId(),
                name,
                description,
                startWeekNumber: startWeek,
                endWeekNumber: endWeek,
                tags: selectedTag ? [selectedTag] : []
            };
            allSpecialWeeksState = [...allSpecialWeeksState, newSpecialEvent];
            actions.addSpecialEvent(newSpecialEvent);
        }

        closeAddModel();
    }

    function handleDeleteRecord(id: string, type: 'chapter' | 'special') {
        if (type === 'chapter') {
            allChapterState = allChapterState.filter(c => c.id !== id);
            actions.removeChapter(id);
        } else {
            allSpecialWeeksState = allSpecialWeeksState.filter(s => s.id !== id);
            actions.removeSpecialEvent(id);
        }
    }

    function handleUpdateRecord(record: LifeChapter, type: 'chapter' | 'special') {
        if (type === 'chapter') {
            allChapterState = allChapterState.map(c => c.id === record.id ? record : c);
            actions.updateChapter(record);
        } else {
            allSpecialWeeksState = allSpecialWeeksState.map(s => s.id === record.id ? record : s);
            actions.updateSpecialEvent(record);
        }
    }

    function handleAddTag(tag: Tag) {
        allTagsState = [...allTagsState, tag];
        actions.addTag(tag);
    }

    // Find first unplanned slot for prefilling
    let firstUnplannedSlot = $derived(() => {
        const unplanned = timeline.find(w => w.focus === undefined);
        if (!unplanned) return undefined;
        
        // Check if it's the last slot (no more slots after it)
        const currentIndex = timeline.indexOf(unplanned);
        const isLastSlot = currentIndex === timeline.length - 1;
        
        return {
            startWeek: unplanned.weekNumberStart,
            endWeek: isLastSlot ? undefined : unplanned.weekNumberEnd,
            isLastSlot
        };
    });

</script>

<div {id} class="max-w-6xl mx-auto pb-12 scroll-mt-8">
    <div class="mb-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">Life Chapters</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your life's narrative and future planning.</p>
            </div>
        </div>

        <!-- Timeline Overview -->
        <TimelineOverview 
            {timeline}
            {currentWeekNumber}
            lifeSpanWeeks={lifeSpanWeeksState}
            activeLifeYears={activeLifeYearsState}
            hasOpenedHelpBefore={lifeInWeeksState.isOpenHelpModal}
            onAddChapter={openAddChapterModal} 
            onAddSpecialEvent={openAddSpecialEventModal}
            onOpenSettings={openSettingsModal}
            onShowHelp={openHelpModal}
        />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div class="xl:col-span-2 space-y-8">
            <!-- Active Chapter / Upcoming Event -->
            <ActiveChapterCard 
                {currentChapter}
                {upcomingEvents}
                {currentWeekNumber}
            />

            <!-- Record List -->
            <RecordList 
                lifeChapters={allChapterState}
                specialWeeks={allSpecialWeeksState}
                birthDate={birthDateState}
                allTags={allTagsState}
                onDelete={handleDeleteRecord}
                onUpdate={handleUpdateRecord}
            />
        </div>

        <div class="xl:col-span-1 space-y-6">
            <!-- Time Insights -->
            <TimeInsights 
                {remainingWeeks}
                {lifeProgress}
                {tagStats}
                {remainingActiveYears}
                {unplannedWeeks}
            />
        </div>
    </div>
</div>

<!-- Modals -->
<AddChapterModal 
    isOpen={isAddChapterModalOpen} 
    onClose={closeAddModel} 
    mode={addModalMode}
    onHandleSubmit={addModalOnHandleSubmit}
    allTags={allTagsState}
    birthDate={birthDateState}
    onAddTag={handleAddTag}
    prefillStartWeek={firstUnplannedSlot()?.startWeek}
    prefillEndWeek={firstUnplannedSlot()?.endWeek}
/>

<SettingsModal
    birthDate={birthDateState}
    lifeSpanYears={lifeSpanYearsState}
    activeLifeYears={activeLifeYearsState}
    isOpen={isSettingsModalOpen}
    onClose={closeSettingsModal}
    onHandleSubmit={settingOnHandleSubmit}
    onReset={handleResetToDefaults}
/>

<HelpModal
    isOpen={isHelpModalOpen}
    onClose={closeHelpModal}
/>
