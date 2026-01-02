<script lang="ts">
    import { Modal, Switch, UnchangeableIcon, IconType } from '@ously/ui';

    let { isOpen, onClose, user } = $props<{
        isOpen: boolean;
        onClose: () => void;
        user?: {
            name: string;
            since: string;
            avatar: string;
        };
    }>();

    let syncDataEnabled = $state(false);
    let activeTab = $state<'general' | 'account'>('general');

    function handleSave() {
        console.log('Settings saved');
        onClose();
    }

    function handleGoogleLogin() {
        console.log('login eiei');
    }
</script>

<Modal {isOpen} {onClose} title="Application Settings" subtitle="Manage your app preferences">
    {#snippet header()}
        <div>
            <div class="flex items-center gap-2 mb-1">
                <span class="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
                    <UnchangeableIcon name={IconType.SETTINGS} class="text-[18px] text-primary" />
                </span>
                <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">Application Settings</h3>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">Manage your app preferences</p>
        </div>
    {/snippet}

    <!-- Tab Navigation -->
    <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
        <button 
            class="flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all {activeTab === 'general' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            onclick={() => activeTab = 'general'}
        >
            General
        </button>
        <button 
            class="flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all {activeTab === 'account' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
            onclick={() => activeTab = 'account'}
        >
            Account
        </button>
    </div>

    {#if activeTab === 'general'}
        <!-- General Section -->
        <div class="space-y-6">
            <div class="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <UnchangeableIcon name={IconType.TRACK_CHANGES} class="text-[18px] text-primary" />
                            <span class="font-semibold text-slate-900 dark:text-white text-sm">Sync Data</span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            Synchronize your data across devices. Coming soon.
                        </p>
                    </div>
                    <div class="flex-shrink-0">
                        <Switch 
                            checked={syncDataEnabled} 
                            disabled={true}
                            onCheckedChange={(checked) => syncDataEnabled = checked}
                        />
                    </div>
                </div>
                <div class="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                    <p class="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <UnchangeableIcon name={IconType.INFO} class="text-[14px]" />
                        This feature is currently unavailable.
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <!-- Account Section -->
        <div class="space-y-6">
            <!-- User Profile Area -->
            <div class="text-center p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                {#if user}
                    <!-- Logged in user view -->
                    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]">
                        <div class="h-full w-full rounded-full bg-white dark:bg-slate-800 overflow-hidden">
                            <img
                                alt="User Avatar"
                                class="h-full w-full object-cover"
                                src={user.avatar}
                            />
                        </div>
                    </div>
                    <h4 class="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">{user.name}</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">{user.since}</p>
                {:else}
                    <!-- Guest user view -->
                    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                        <UnchangeableIcon name={IconType.LABEL} class="text-[40px] text-slate-400 dark:text-slate-500" />
                    </div>
                    <h4 class="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Guest User</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign in to sync your data across devices</p>
                {/if}
                
                <!-- Google Login Button -->
                <div class="relative">
                    <button
                        disabled
                        class="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 shadow-sm opacity-50 cursor-not-allowed"
                    >
                        <svg class="w-5 h-5 grayscale" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span class="font-semibold text-slate-400 dark:text-slate-500">
                            Continue with Google
                        </span>
                    </button>
                    <span class="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    {/if}

    {#snippet footer()}
        <button 
            type="button"
            class="cursor-pointer flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm" 
            onclick={onClose}
        >
            Cancel
        </button>
        <button 
            type="button"
            class="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            onclick={handleSave}
        >
            Save
        </button>
    {/snippet}
</Modal>
