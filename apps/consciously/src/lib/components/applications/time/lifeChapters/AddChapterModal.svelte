<script lang="ts">
    import type { Tag } from '@ously/core/utils/id';
    import { getWeekNumberFromBirthDate } from '@ously/core/time/app/weekInYourLife';
    import { UnchangeableIcon, Modal, Calendar, IconType } from '@ously/ui';
    import { getLocalTimeZone, CalendarDate, type DateValue } from '@internationalized/date';

    let { isOpen, onClose, mode = 'chapter', onHandleSubmit, allTags, birthDate, onAddTag, prefillStartWeek, prefillEndWeek } = $props<{ 
        isOpen: boolean; 
        onClose: () => void;
        mode?: 'chapter' | 'event';
        allTags: Tag[];
        birthDate: Date;
        onHandleSubmit: (name: string, description: string, startWeek: number | undefined, endWeek: number | undefined, selectedTag: Tag | undefined) => void;
        onAddTag?: (tag: Tag) => void;
        prefillStartWeek?: number;
        prefillEndWeek?: number;
    }>();

    let name = $state('');
    let description = $state('');
    let startWeek = $state<number | undefined>(undefined);
    let endWeek = $state<number | undefined>(undefined);
    let selectedTag = $state<Tag | undefined>(undefined);
    
    // Calendar states
    let showStartCalendar = $state(false);
    let showEndCalendar = $state(false);
    let startCalendarValue = $state<CalendarDate | undefined>(undefined);
    let endCalendarValue = $state<CalendarDate | undefined>(undefined);

    // Tag creation states
    let showAddTag = $state(false);
    let newTagName = $state('');

    // Calendar year range (1920 to 2120)
    const calendarYears = Array.from({ length: 2120 - 1920 + 1 }, (_, i) => 1920 + i);

    // Prefill when modal opens, reset when closed
    $effect(() => {
        if (isOpen) {
            if (prefillStartWeek !== undefined && startWeek === undefined) {
                startWeek = prefillStartWeek;
            }
            if (prefillEndWeek !== undefined && endWeek === undefined) {
                endWeek = prefillEndWeek;
            }
        } else {
            // Reset calendar states when modal closes
            showStartCalendar = false;
            showEndCalendar = false;
        }
    });

    // Available colors for new tags (avoiding existing colors)
    const tagColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];
    
    function getAvailableColor(): string {
        const usedColors = allTags.map((t: Tag) => t.color);
        const available = tagColors.filter(c => !usedColors.includes(c));
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : tagColors[Math.floor(Math.random() * tagColors.length)];
    }

    function calculateWeekFromCalendar(calDate: CalendarDate): number {
        const date = calDate.toDate(getLocalTimeZone());
        return getWeekNumberFromBirthDate(birthDate, date);
    }

    function handleStartCalendarChange(value: DateValue | undefined) {
        if (value) {
            const calDate = value as CalendarDate;
            startWeek = calculateWeekFromCalendar(calDate);
            showStartCalendar = false;
        }
    }

    function handleEndCalendarChange(value: DateValue | undefined) {
        if (value) {
            const calDate = value as CalendarDate;
            endWeek = calculateWeekFromCalendar(calDate);
            showEndCalendar = false;
        }
    }

    let title = $derived(mode === 'chapter' ? 'Add New Life Chapter' : 'Add Special Event');
    let subtitle = $derived(mode === 'chapter' ? 'Define a new era in your life story.' : 'Mark a memorable moment in time.');
    let submitLabel = $derived(mode === 'chapter' ? 'Add Chapter' : 'Add Event');

    function handleSubmit(e: Event) {
        e.preventDefault();
        if (startWeek === undefined || endWeek === undefined) return;

        onHandleSubmit(name, description, startWeek, endWeek, selectedTag);

        // Reset and close
        name = '';
        description = '';
        startWeek = undefined;
        endWeek = undefined;
        selectedTag = undefined;
        startCalendarValue = undefined;
        endCalendarValue = undefined;
        onClose();
    }

    function selectTag(tag: Tag) {
        if (selectedTag?.id === tag.id) {
            selectedTag = undefined;
        } else {
            selectedTag = tag;
        }
    }

    function handleAddTag() {
        if (newTagName.trim() && onAddTag) {
            const newTag: Tag = {
                id: newTagName.toLowerCase().replace(/\s+/g, '-'),
                name: newTagName.trim(),
                color: getAvailableColor()
            };
            onAddTag(newTag);
            selectedTag = newTag;
            newTagName = '';
            showAddTag = false;
        }
    }
</script>

<Modal {isOpen} {onClose} {title} {subtitle}>
    {#snippet header()}
        <div>
            <div class="flex items-center gap-2 mb-1">
                <span class="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                    <UnchangeableIcon name={mode === 'chapter' ? IconType.BOOK_OPEN : IconType.CELEBRATION} class="text-[18px] text-primary" />
                </span>
                <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
    {/snippet}

    <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Name Input -->
        <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="chapter-name">
                Name <span class="text-primary">*</span>
            </label>
            <input 
                id="chapter-name"
                class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm py-3 px-4 font-medium shadow-sm placeholder:text-slate-400" 
                placeholder={mode === 'chapter' ? "e.g., College Years, Career Pivot" : "e.g., Wedding Day, Graduation"}
                required
                bind:value={name}
            />
        </div>

        <!-- Description -->
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <label class="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400" for="chapter-desc">Description</label>
                <span class="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <textarea 
                id="chapter-desc"
                class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none placeholder:text-slate-400 text-sm py-3 px-4 shadow-sm leading-relaxed" 
                placeholder={mode === 'chapter' ? "What defines this chapter of your life?" : "What makes this event special?"}
                bind:value={description}
            ></textarea>
        </div>
        
        <!-- Week Range Section -->
        <div class="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative overflow-visible">
            <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div class="flex items-center justify-between mb-6 relative z-10">
                <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    <span class="p-1 rounded bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600">
                        <UnchangeableIcon name={IconType.DATE_RANGE} class="text-[16px] text-primary block" />
                    </span>
                    Week Range <span class="text-primary">*</span>
                </span>
            </div>

            <div class="flex items-center gap-4 relative z-10 mb-4">
                <div class="group/input flex-1 relative">
                    <label class="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider" for="start-week">Start Week</label>
                    <div class="relative">
                        <input 
                            id="start-week"
                            class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 pr-12 font-semibold shadow-sm transition-all group-hover/input:border-blue-300" 
                            min="0" 
                            placeholder="1560" 
                            required 
                            type="number"
                            bind:value={startWeek}
                        />
                        <button 
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                            onclick={() => showStartCalendar = !showStartCalendar}
                            title="Select from date"
                        >
                            <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[18px]" />
                        </button>
                    </div>
                    {#if showStartCalendar}
                        <div class="absolute top-full left-0 mt-2 z-50 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[320px]">
                            <Calendar
                                type="single"
                                bind:value={startCalendarValue}
                                class="rounded-lg w-full"
                                captionLayout="dropdown"
                                years={calendarYears}
                                onValueChange={handleStartCalendarChange}
                            />
                        </div>
                    {/if}
                </div>
                <div class="pt-6 text-slate-300 dark:text-slate-600">
                    <UnchangeableIcon name={IconType.ARROW_RIGHT_ALT} class="text-2xl" />
                </div>
                <div class="group/input flex-1 relative">
                    <label class="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider" for="end-week">End Week</label>
                    <div class="relative">
                        <input 
                            id="end-week"
                            class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 pr-12 font-semibold shadow-sm transition-all group-hover/input:border-blue-300" 
                            min="0" 
                            placeholder="1768" 
                            required 
                            type="number"
                            bind:value={endWeek}
                        />
                        <button 
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                            onclick={() => showEndCalendar = !showEndCalendar}
                            title="Select from date"
                        >
                            <UnchangeableIcon name={IconType.CALENDAR_MONTH} class="text-[18px]" />
                        </button>
                    </div>
                    {#if showEndCalendar}
                        <div class="absolute top-full right-0 mt-2 z-50 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 min-w-[320px]">
                            <Calendar
                                type="single"
                                bind:value={endCalendarValue}
                                class="rounded-lg w-full"
                                captionLayout="dropdown"
                                years={calendarYears}
                                onValueChange={handleEndCalendarChange}
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
                        class="group relative inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 {selectedTag?.id === tag.id ? 'shadow-lg scale-[1.02]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 hover:border-slate-300'}"
                        style={selectedTag?.id === tag.id ? `border-color: ${tagColor}; background-color: ${tagColor}15; color: ${tagColor}` : ''}
                        onclick={() => selectTag(tag)}
                    >
                        <span class="w-2 h-2 rounded-full mr-2" style="background-color: {tagColor}"></span>
                        #{tag.name}
                    </button>
                {/each}
                
                {#if showAddTag}
                    <div class="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-primary/30 p-1">
                        <input
                            type="text"
                            class="w-28 text-xs px-2 py-1.5 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            placeholder="Tag name"
                            bind:value={newTagName}
                            onkeydown={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <button
                            type="button"
                            class="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all"
                            onclick={handleAddTag}
                        >
                            <UnchangeableIcon name={IconType.CHECK} class="text-[14px]" />
                        </button>
                        <button
                            type="button"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            onclick={() => { showAddTag = false; newTagName = ''; }}
                        >
                            <UnchangeableIcon name={IconType.CLOSE} class="text-[14px]" />
                        </button>
                    </div>
                {:else}
                    <button 
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50/50 transition-all text-xs font-semibold group"
                        onclick={() => showAddTag = true}
                    >
                        <UnchangeableIcon name={IconType.ADD} class="text-[16px] group-hover:scale-110 transition-transform" />
                        New Tag
                    </button>
                {/if}
            </div>
        </div>
    </form>

    {#snippet footer()}
        <button 
            type="button"
            class="cursor-pointer flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm" 
            onclick={onClose}
        >
            Cancel
        </button>
        <button 
            type="submit"
            class="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            onclick={handleSubmit}
        >
            <span>{submitLabel}</span>
            <UnchangeableIcon name={IconType.ARROW_FORWARD} class="text-[18px] group-hover:translate-x-0.5 transition-transform" />
        </button>
    {/snippet}
</Modal>

<style>
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
</style>
