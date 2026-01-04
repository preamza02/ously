<script lang="ts">
    import { Modal, UnchangeableIcon, IconType } from '@ously/ui';

    let { isOpen, onClose } = $props<{
        isOpen: boolean;
        onClose: () => void;
    }>();
</script>

<Modal isOpen={isOpen} onClose={onClose} title="Time Insights" subtitle="Coming Soon">
    <div class="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <UnchangeableIcon name={IconType.TIMELAPSE} class="text-[40px] text-primary" />
        </div>
        
        <div class="space-y-2 max-w-xs">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Incoming: Work in Progress</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                We are building advanced analytics to help you visualize your life patterns and optimize your time allocation.
            </p>
        </div>
    </div>

    {#snippet footer()}
        <div class="flex-1"></div>
        <button 
            class="py-3 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
            onclick={onClose}
        >
            Got it
        </button>
    {/snippet}
</Modal>
