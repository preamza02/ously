<script lang="ts">
    import { Modal, Button, Calendar, Popover } from '@ously/ui';
    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
    import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';

    let { isOpen, onClose, onHandleSubmit, birthDate, lifeSpanYears, activeLifeYears } = $props<{ 
        birthDate: Date;
        lifeSpanYears: number;
        activeLifeYears: number;
        isOpen: boolean; 
        onClose: () => void,
        onHandleSubmit: (birthDate: Date, lifeSpanYears: number, activeLifeYears: number) => void
    }>();

    // Convert Date to CalendarDate
    function toCalendarDate(date: Date): CalendarDate {
        const d = new Date(date);
        return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }

    let datePickerOpen = $state(false);
    let calendarValue = $state<CalendarDate | undefined>(undefined);
    let localLifeSpanYears = $state(0);
    let localActiveLifeYears = $state(0);

    // Sync local state when modal opens or props change
    $effect(() => {
        if (isOpen) {
            calendarValue = toCalendarDate(birthDate);
            localLifeSpanYears = lifeSpanYears;
            localActiveLifeYears = activeLifeYears;
        }
    });

    function handleSubmit() {
        if (calendarValue) {
            const parsedBirthDate = calendarValue.toDate(getLocalTimeZone());
            onHandleSubmit(parsedBirthDate, localLifeSpanYears, localActiveLifeYears);
        }
    }
</script>

<Modal {isOpen} {onClose} title="Settings" subtitle="Configure your life parameters.">
    <div class="space-y-8">
        <!-- Date of Birth -->
        <div class="space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-slate-500">Date of Birth</span>
            <Popover.Root bind:open={datePickerOpen}>
                <Popover.Trigger>
                    {#snippet child({ props }: { props: Record<string, unknown> })}
                        <Button
                            {...props}
                            variant="outline"
                            class="w-full justify-between font-normal rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-6 px-4 shadow-sm hover:border-blue-300"
                        >
                            {calendarValue
                                ? calendarValue.toDate(getLocalTimeZone()).toLocaleDateString()
                                : "Select birth date"}
                            <ChevronDownIcon class="h-4 w-4 text-slate-400" />
                        </Button>
                    {/snippet}
                </Popover.Trigger>
                <Popover.Content class="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        type="single"
                        bind:value={calendarValue}
                        captionLayout="dropdown"
                        onValueChange={() => {
                            datePickerOpen = false;
                        }}
                        maxValue={today(getLocalTimeZone())}
                    />
                </Popover.Content>
            </Popover.Root>
        </div>

        <!-- Years Inputs Row -->
        <div class="flex items-end gap-4">
            <div class="flex-1 space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="settings-active-life">Active Life (Years)</label>
                <input 
                    id="settings-active-life"
                    type="number"
                    min="1" 
                    max="120" 
                    bind:value={localActiveLifeYears}
                    class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 font-semibold shadow-sm transition-all hover:border-blue-300"
                />
            </div>
            <div class="flex-1 space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="settings-lifespan">Lifespan (Years)</label>
                <input 
                    id="settings-lifespan"
                    type="number"
                    min="1" 
                    max="120" 
                    bind:value={localLifeSpanYears}
                    class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-mono text-sm py-3 font-semibold shadow-sm transition-all hover:border-blue-300"
                />
            </div>
        </div>

        <p class="text-[10px] text-slate-400 dark:text-slate-500 -mt-2">Active life = age until you can still adventure. Lifespan = expected total years.</p>
    </div>

    {#snippet footer()}
        <button 
            class="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" 
            onclick={onClose}
        >
            Cancel
        </button>
        <button 
            class="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
            onclick={handleSubmit}
        >
            Update
        </button>
    {/snippet}
</Modal>
