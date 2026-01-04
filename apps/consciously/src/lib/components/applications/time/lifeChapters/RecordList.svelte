<script lang="ts">
    import type { LifeChapter } from '@ously/core/time/repo/lifeChapter';
    import type { Tag } from '@ously/core/utils/id';
    import { formatAgeRange, formatWeeks, getIconForTag } from './helpers';
    import { getAgeRangeFromChapter, getChapterDuration, getWeekNumberFromBirthDate, getWeekStartDateAndEndDate } from '@ously/core/time/app/weekInYourLife';
    import { UnchangeableIcon, Modal, Calendar, IconType } from '@ously/ui';
    import { getLocalTimeZone, CalendarDate, type DateValue } from '@internationalized/date';

    let { lifeChapters, specialWeeks, birthDate, onDelete, onUpdate, allTags } = $props<{
        lifeChapters: LifeChapter[];
        specialWeeks: LifeChapter[];
        birthDate: Date;
        allTags: Tag[];
        onDelete: (id: string, type: 'chapter' | 'special') => void;
        onUpdate: (chapter: LifeChapter, type: 'chapter' | 'special') => void;
    }>();

    // UI-only derived values (stay here)
    let recentChapters = $derived([...lifeChapters].reverse().slice(0, 3));
    let recentSpecialWeeks = $derived([...specialWeeks].reverse().slice(0, 3));
    
    // Local UI state (stays here)
    let activeTab = $state<'chapter' | 'special'>('chapter');
    let showRecord = $derived(activeTab === 'chapter' ? recentChapters : recentSpecialWeeks);
    let allRecords = $derived(activeTab === 'chapter' ? lifeChapters : specialWeeks);

    // Modal states
    let isDetailModalOpen = $state(false);
    let isViewAllModalOpen = $state(false);
    let selectedRecord = $state<LifeChapter | null>(null);
    let openedFromViewAll = $state(false);

    // Edit form state
    let editName = $state('');
    let editDescription = $state('');
    let editStartWeek = $state<number | undefined>(undefined);
    let editEndWeek = $state<number | undefined>(undefined);
    let editSelectedTag = $state<Tag | undefined>(undefined);
    
    // Calendar states
    let showEditStartCalendar = $state(false);
    let showEditEndCalendar = $state(false);
    let editStartCalendarValue = $state<CalendarDate | undefined>(undefined);
    let editEndCalendarValue = $state<CalendarDate | undefined>(undefined);

    function calculateWeekFromCalendar(calDate: CalendarDate): number {
        const date = calDate.toDate(getLocalTimeZone());
        return getWeekNumberFromBirthDate(birthDate, date);
    }

    // Calendar year range (1920 to 2120)
    const calendarYears = Array.from({ length: 2120 - 1920 + 1 }, (_, i) => 1920 + i);

    function handleEditStartCalendarChange(value: DateValue | undefined) {
        if (value) {
            const calDate = value as CalendarDate;
            editStartWeek = calculateWeekFromCalendar(calDate);
            showEditStartCalendar = false;
        }
    }

    function handleEditEndCalendarChange(value: DateValue | undefined) {
        if (value) {
            const calDate = value as CalendarDate;
            editEndWeek = calculateWeekFromCalendar(calDate);
            showEditEndCalendar = false;
        }
    }
    
    // Helper to format date as DD/MM/YY
    function formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString()
        return `${day}/${month}/${year}`;
    }
    
    // Date helpers for showing what week corresponds to what date
    function getStartDateForWeek(weekNum: number | undefined): string {
        if (weekNum === undefined || weekNum < 1) return "-";
        try {
            const { startDate } = getWeekStartDateAndEndDate(birthDate, weekNum, weekNum);
            return formatDate(startDate);
        } catch {
            return "-";
        }
    }
    
    function getEndDateForWeek(weekNum: number | undefined): string  {
        if (weekNum === undefined || weekNum < 1) return "-";
        try {
            const { endDate } = getWeekStartDateAndEndDate(birthDate, weekNum, weekNum);
            return formatDate(endDate);
        } catch {
            return "-";
        }
    }
    
    // Helper to get CalendarDate from week number for calendar preselection
    function getCalendarDateFromWeek(weekNum: number | undefined): CalendarDate | undefined {
        if (weekNum === undefined || weekNum < 1) return undefined;
        try {
            const { startDate } = getWeekStartDateAndEndDate(birthDate, weekNum, weekNum);
            return new CalendarDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        } catch {
            return undefined;
        }
    }
    
    // Derived date displays for edit modal
    let editStartWeekStartDate = $derived(getStartDateForWeek(editStartWeek));
    let editEndWeekEndDate = $derived(getEndDateForWeek(editEndWeek));

    function getColorStyles(tag: Tag | undefined): { bg: string; bgLight: string; text: string } {
        const color = tag?.color || '#94a3b8';
        return {
            bg: color,
            bgLight: `${color}20`,
            text: color
        };
    }

    function openDetailModal(record: LifeChapter, fromViewAll: boolean = false) {
        selectedRecord = record;
        editName = record.name;
        editDescription = record.description || '';
        editStartWeek = record.startWeekNumber;
        editEndWeek = record.endWeekNumber;
        editSelectedTag = record.tags[0];
        openedFromViewAll = fromViewAll;
        isDetailModalOpen = true;
    }

    function closeDetailModal() {
        isDetailModalOpen = false;
        selectedRecord = null;
        showEditStartCalendar = false;
        showEditEndCalendar = false;
        if (openedFromViewAll) {
            isViewAllModalOpen = true;
            openedFromViewAll = false;
        }
    }

    function openViewAllModal() {
        isViewAllModalOpen = true;
    }

    function closeViewAllModal() {
        isViewAllModalOpen = false;
    }

    function handleDelete(id: string, e: Event) {
        e.stopPropagation();
        onDelete(id, activeTab);
    }

    function handleDeleteFromModal() {
        if (selectedRecord) {
            const shouldReturnToViewAll = openedFromViewAll;
            onDelete(selectedRecord.id, activeTab);
            isDetailModalOpen = false;
            selectedRecord = null;
            showEditStartCalendar = false;
            showEditEndCalendar = false;
            if (shouldReturnToViewAll) {
                isViewAllModalOpen = true;
            }
            openedFromViewAll = false;
        }
    }

    function handleUpdate() {
        if (selectedRecord && editName && editStartWeek !== undefined && editEndWeek !== undefined) {
            const shouldReturnToViewAll = openedFromViewAll;
            const updatedRecord: LifeChapter = {
                ...selectedRecord,
                name: editName,
                description: editDescription,
                startWeekNumber: editStartWeek,
                endWeekNumber: editEndWeek,
                tags: editSelectedTag ? [editSelectedTag] : []
            };
            onUpdate(updatedRecord, activeTab);
            isDetailModalOpen = false;
            selectedRecord = null;
            showEditStartCalendar = false;
            showEditEndCalendar = false;
            if (shouldReturnToViewAll) {
                isViewAllModalOpen = true;
            }
            openedFromViewAll = false;
        }
    }

    function selectTag(tag: Tag) {
        editSelectedTag = editSelectedTag?.id === tag.id ? undefined : tag;
    }
</script>

<div>
    <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <UnchangeableIcon name={IconType.HISTORY_EDU} class="text-[18px]" />
            Record
        </h3>
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
                onclick={() => activeTab = 'chapter'} 
                class="px-3 py-1 text-xs font-semibold rounded-md transition-all {activeTab === 'chapter' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
                Chapter
            </button>
            <button 
                onclick={() => activeTab = 'special'} 
                class="px-3 py-1 text-xs font-semibold rounded-md transition-all {activeTab === 'special' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            >
                Special
            </button>
        </div>
    </div>

    <div class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card overflow-hidden border border-border-light dark:border-border-dark">
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
            {#each showRecord as chapter}
                {@const duration = getChapterDuration(chapter)}
                {@const ageRange = getAgeRangeFromChapter(chapter)}
                {@const tag = chapter.tags[0]}
                {@const colors = getColorStyles(tag)}
                
                <div 
                    class="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onclick={() => openDetailModal(chapter)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && openDetailModal(chapter)}
                >
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                        <div 
                            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style="background-color: {colors.bgLight}; color: {colors.text}"
                        >
                            <UnchangeableIcon name={getIconForTag(tag?.id)} class="text-[20px]" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <h4 class="font-display text-sm font-bold text-slate-900 dark:text-white truncate">{chapter.name}</h4>
                                <span class="text-xs font-medium flex-shrink-0" style="color: {colors.text}">{formatWeeks(duration)}</span>
                            </div>
                            <p class="text-xs text-slate-500 mt-0.5 truncate">{chapter.description || 'No description'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-4 pl-14 sm:pl-0">
                        <div class="text-xs text-slate-400 whitespace-nowrap sm:pl-4 sm:border-l sm:border-slate-100 dark:sm:border-slate-800">
                            {formatAgeRange(ageRange.startAge, ageRange.endAge)}
                        </div>
                        <!-- Delete Button -->
                        <button 
                            class="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            onclick={(e) => handleDelete(chapter.id, e)}
                            title="Delete"
                        >
                            <UnchangeableIcon name={IconType.DELETE} class="text-[18px]" />
                        </button>
                    </div>
                </div>
            {/each}
            
            {#if showRecord.length === 0}
                <div class="p-8 text-center text-slate-400 text-sm">
                    No {activeTab === 'chapter' ? 'chapters' : 'special events'} recorded yet.
                </div>
            {/if}
        </div>
        
        <div class="p-3 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-6">
            <span class="text-[10px] text-slate-400">Showing {showRecord.length} most recent</span>
            <button 
                class="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                onclick={openViewAllModal}
            >
                View All
                <UnchangeableIcon name={IconType.ARROW_FORWARD} class="text-[14px]" />
            </button>
        </div>
    </div>
</div>

<!-- Detail/Edit Modal -->
<Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={selectedRecord?.name || ''} subtitle="Edit or delete this record">
    <div class="space-y-6">
        <!-- Name Input -->
        <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="edit-name">
                Name <span class="text-primary">*</span>
            </label>
            <input 
                id="edit-name"
                type="text"
                class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm py-3 px-4 font-medium shadow-sm transition-all placeholder:text-slate-400"
                placeholder="Enter name"
                bind:value={editName}
            />
        </div>
        
        <!-- Description -->
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="edit-desc">Description</label>
                <span class="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <textarea 
                id="edit-desc"
                class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none placeholder:text-slate-400 text-sm py-3 px-4 shadow-sm leading-relaxed" 
                placeholder="What defines this chapter?"
                bind:value={editDescription}
            ></textarea>
        </div>

        <!-- Week Range Section -->
        <div class="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative overflow-visible">
            <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-4">
                <span class="p-1 rounded bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
                    <UnchangeableIcon name={IconType.DATE_RANGE} class="text-[16px] text-primary block" />
                </span>
                Week Range <span class="text-primary">*</span>
            </span>

            <div class="flex items-center gap-4 relative z-10 mb-4">
                <div class="flex-1 relative">
                    <label class="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider" for="edit-start">Start Week</label>
                    <div class="relative">
                        <input 
                            id="edit-start"
                            type="number"
                            min="1"
                            class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 pr-12 font-semibold shadow-sm transition-all hover:border-blue-300" 
                            bind:value={editStartWeek}
                        />
                        <button 
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                            onclick={() => {
                                showEditEndCalendar = false;
                                showEditStartCalendar = !showEditStartCalendar;
                                if (showEditStartCalendar && editStartWeek !== undefined && editStartWeek >= 1) {
                                    editStartCalendarValue = getCalendarDateFromWeek(editStartWeek);
                                }
                            }}
                            title="Select from date"
                        >
                            <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[18px]" />
                        </button>
                    </div>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 ml-1 text-center">Starts: {editStartWeekStartDate}</p>
                    {#if showEditStartCalendar}
                        <div class="absolute top-full left-0 mt-2 z-50 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[320px]">
                            <Calendar
                                type="single"
                                bind:value={editStartCalendarValue}
                                class="rounded-lg"
                                captionLayout="dropdown"
                                years={calendarYears}
                                onValueChange={handleEditStartCalendarChange}
                            />
                        </div>
                    {/if}
                </div>
                <div class="pt-6 text-slate-300 dark:text-slate-600">
                    <UnchangeableIcon name={IconType.ARROW_RIGHT_ALT} class="text-2xl" />
                </div>
                <div class="flex-1 relative">
                    <label class="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider" for="edit-end">End Week</label>
                    <div class="relative">
                        <input 
                            id="edit-end"
                            type="number"
                            min="1"
                            class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 pr-12 font-semibold shadow-sm transition-all hover:border-blue-300" 
                            bind:value={editEndWeek}
                        />
                        <button 
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                            onclick={() => {
                                showEditStartCalendar = false;
                                showEditEndCalendar = !showEditEndCalendar;
                                if (showEditEndCalendar && editEndWeek !== undefined && editEndWeek >= 1) {
                                    editEndCalendarValue = getCalendarDateFromWeek(editEndWeek);
                                }
                            }}
                            title="Select from date"
                        >
                            <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[18px]" />
                        </button>
                    </div>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 ml-1 text-center">Ends: {editEndWeekEndDate}</p>
                    {#if showEditEndCalendar}
                        <div class="absolute top-full right-0 mt-2 z-50 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[320px]">
                            <Calendar
                                type="single"
                                bind:value={editEndCalendarValue}
                                class="rounded-lg"
                                captionLayout="dropdown"
                                years={calendarYears}
                                onValueChange={handleEditEndCalendarChange}
                            />
                        </div>
                    {/if}
                </div>
            </div>

            <div class="flex gap-3 items-start p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                <UnchangeableIcon name={IconType.INFO} class="text-[16px] text-primary mt-0.5" />
                <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    Click the calendar icon to select a date — it will be converted to your life week automatically.
                </p>
            </div>
        </div>

        <!-- Tags Section -->
        <div class="space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tag (Select One)</span>
            <div class="flex flex-wrap gap-2">
                {#each allTags as tag}
                    {@const tagColor = tag.color || '#94a3b8'}
                    <button 
                        type="button"
                        class="group relative inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 {editSelectedTag?.id === tag.id ? 'shadow-lg scale-[1.02]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 hover:border-slate-300'}"
                        style={editSelectedTag?.id === tag.id ? `border-color: ${tagColor}; background-color: ${tagColor}15; color: ${tagColor}` : ''}
                        onclick={() => selectTag(tag)}
                    >
                        <span class="w-2 h-2 rounded-full mr-2" style="background-color: {tagColor}"></span>
                        #{tag.name}
                    </button>
                {/each}
            </div>
        </div>
    </div>

    {#snippet footer()}
        <button 
            class="py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-all"
            onclick={handleDeleteFromModal}
        >
            Delete
        </button>
        <div class="flex-1"></div>
        <button 
            class="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 transition-all" 
            onclick={closeDetailModal}
        >
            Cancel
        </button>
        <button 
            class="py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
            onclick={handleUpdate}
        >
            Update
        </button>
    {/snippet}
</Modal>

<!-- View All Modal -->
<Modal isOpen={isViewAllModalOpen} onClose={closeViewAllModal} title="All {activeTab === 'chapter' ? 'Chapters' : 'Special Events'}" size="lg">
    <div class="divide-y divide-slate-100 dark:divide-slate-800 -mx-8">
        {#each allRecords as record}
            {@const duration = getChapterDuration(record)}
            {@const ageRange = getAgeRangeFromChapter(record)}
            {@const tag = record.tags[0]}
            {@const colors = getColorStyles(tag)}
            
            <div 
                class="px-8 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center gap-4"
                onclick={() => { closeViewAllModal(); openDetailModal(record, true); }}
                role="button"
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && openDetailModal(record, true)}
            >
                <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style="background-color: {colors.bgLight}; color: {colors.text}"
                >
                    <UnchangeableIcon name={getIconForTag(tag?.id)} class="text-[20px]" />
                </div>
                <div class="flex-1">
                    <h4 class="font-display text-sm font-bold text-slate-900 dark:text-white">{record.name}</h4>
                    <p class="text-xs text-slate-500">{record.description || 'No description'}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-medium" style="color: {colors.text}">{formatWeeks(duration)}</span>
                    <p class="text-[10px] text-slate-400">{formatAgeRange(ageRange.startAge, ageRange.endAge)}</p>
                </div>
            </div>
        {/each}
        
        {#if allRecords.length === 0}
            <div class="px-8 py-12 text-center text-slate-400 text-sm">
                No records yet.
            </div>
        {/if}
    </div>
</Modal>
