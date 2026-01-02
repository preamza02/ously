<script lang="ts">
    import { Modal } from '@ously/ui';
    import { UserCog, Plus } from 'lucide-svelte';

    let { isOpen, onClose } = $props<{ 
        isOpen: boolean; 
        onClose: () => void;
    }>();
</script>

<Modal {isOpen} {onClose} title="Life in Weeks" subtitle="Visualize your finite time and plan intentionally.">
    <div class="space-y-6 text-sm text-slate-600 dark:text-slate-300">
        <div class="space-y-3">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-primary/10">💡</span>
                The Philosophy
            </h4>
            <p class="leading-relaxed italic text-slate-500 dark:text-slate-400">
                "Your time is finite. So stop trying to do everything and focus on what truly matters."
            </p>
            <p class="text-xs text-right font-semibold text-slate-400 dark:text-slate-500">— Oliver Burkeman, <span class="italic">Four Thousand Weeks</span></p>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-green-500/10">🛠️</span>
                What is this tool?
            </h4>
            <p class="leading-relaxed">
                This tool maps your entire life into a <strong>segmented timeline</strong>. It visualizes your distinct <strong>life chapters</strong> to give you a tangible perspective on your <strong>limited 4,000 weeks</strong>, helping you discover <strong>what truly matters</strong> in your lifetime.
            </p>
        </div>
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-blue-500/10">📊</span>
                How to Use
            </h4>
            <ul class="space-y-2 list-none">
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">1.</span>
                    <span>Click <span class="inline-flex items-center justify-center p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><UserCog class="w-3 h-3" /></span> <strong>Personalize</strong> and add your birthday, expected active life, and expected lifespan.</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">2.</span>
                    <span>Think about your <strong>Life Chapters</strong> and add them <span class="inline-flex items-center justify-center p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><Plus class="w-3 h-3" /></span>.</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">3.</span>
                    <span>Fill up your entire life timeline to see what truly matters to you.</span>
                </li>
            </ul>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="p-1 rounded bg-purple-500/10">📚</span>
                Key Concepts
            </h4>
            <ul class="space-y-2 list-none">
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">•</span>
                    <span>
                        <span><strong>Life Chapters</strong> — Define major phases of your life what is your first priority in that time 
                        <br/>
                        <span class="text-xs text-slate-500 dark:text-slate-400">- ex. Love, First Job, Your Business, Losing weight, etc</span></span>                        
                        <br/>
                        <span class="text-xs text-slate-500 dark:text-slate-400">- some time you're gonna have a lot of thing in your life but i want you to be ask yourself what is the top priority in that time</span>                        
                    </span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">•</span>
                    <span>
                    <span><strong>Special Weeks</strong> — Mark significant events that you need to prioritize in some period of time like </span>
                    <br/>
                    <span class="text-xs text-slate-500 dark:text-slate-400">- ex. New Year with Family, Your Wedding Week, Trip With your partner, etc</span>

                    </span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-primary font-bold">•</span>
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
