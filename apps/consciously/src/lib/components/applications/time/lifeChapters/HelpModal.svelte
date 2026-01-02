<script lang="ts">
    import { Modal } from '@ously/ui';

    let { isOpen, onClose } = $props<{ 
        isOpen: boolean; 
        onClose: () => void;
    }>();
</script>

<Modal {isOpen} {onClose} title="Life in Weeks" subtitle="Visualize your finite time and plan intentionally.">
    <div class="space-y-6 text-sm text-slate-600 dark:text-slate-300">
        <!-- Quote -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 italic text-slate-500 dark:text-slate-400 text-center">
            "Life is short but long enough to make a difference."
            <div class="mt-1 text-xs font-semibold not-italic">— Me when I'm in the shower</div>
        </div>
        <div class="space-y-3">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-primary/10">💡</span>
                The Philosophy
            </h4>
            <p class="leading-relaxed">
                "Life is too short to be lived on <strong>autopilot</strong>, yet it is long enough to build a <strong>legacy</strong> if lived with <strong>intention</strong>." Visualizing your <strong>finite weeks</strong> shifts your focus from the anxiety of running out of time to the <strong>clarity</strong> of how best to spend it.
            </p>
            <p class="leading-relaxed">
                The struggles of a few years are just a <strong>single chapter</strong> in a much larger narrative, <strong>not the final story</strong>. You do not need to rush; you simply need to <strong>trust the process</strong> and ensure the chapters ahead are written with <strong>purpose</strong>.
            </p>
        </div>

        <!-- How It Works -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-blue-500/10">📊</span>
                How To Use
            </h4>
            <ul class="space-y-2 list-none">
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">1.</span>
                    <span>
                        <span><strong>Life Chapters</strong> — Define major phases of your life what is your first priority in that time 
                        <br/>
                        <span class="text-xs text-slate-500 dark:text-slate-400">- ex. Love, First Job, Your Business, Losing weight, etc</span></span>                        
                        <br/>
                        <span class="text-xs text-slate-500 dark:text-slate-400">- some time you're gonna have a lot of thing in your life but i want you to be ask yourself what is the top priority in that time</span>                        
                    </span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">2.</span>
                    <span><strong>Special Weeks</strong> — Mark significant events that you need to prioritize in some period of time like </span>
                    <br/>
                    <span class="text-xs text-slate-500 dark:text-slate-400">- ex. New Year with Family, Your Wedding Week, Trip With your partner, etc</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">3.</span>
                    <span><strong>Tags</strong> — Categorize your time to see where your weeks are going</span>
                </li>
            </ul>
        </div>

        <!-- Markers -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-orange-500/10">🎯</span>
                Timeline Markers
            </h4>
            <div class="flex flex-col gap-2 text-xs">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full bg-primary"></div>
                    <span><strong>Now</strong> — Your current position in life</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span><strong>Active Life</strong> — Estimated end of physically active years</span>
                </div>
            </div>
        </div>


    </div>

    {#snippet footer()}
        <button 
            class="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
            onclick={onClose}
        >
            Got it!
        </button>
    {/snippet}
</Modal>
