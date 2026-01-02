<script lang="ts">
	import { Heart, ExternalLink, Mail, Github } from 'lucide-svelte';
</script>

<div class="px-3 py-3 mb-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
	<div class="flex items-center gap-2 mb-2">
		<div class="p-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30">
			<Heart class="h-3.5 w-3.5 text-pink-500" />
		</div>
		<p class="text-xs font-medium text-slate-600 dark:text-slate-400">
			Made with care by a solo creator
		</p>
	</div>
	<p class="text-start text-[10px] text-slate-500 dark:text-slate-500 mb-3 leading-relaxed indent-4">
        Hi I'm Prame, I want to build this software to help people manage their life better. I plan this application to be a Collection of Personal Resource Planning (PRP) Tools.
	</p>
	<p class="text-start text-[10px] text-slate-500 dark:text-slate-500 mb-3 leading-relaxed indent-4">
        This application is in early stage development, and Feedback is very appreciated and will greatly affect the product direction!. Please reach out to me if you have any questions or suggestions.
	</p>
	<div class="flex flex-wrap gap-1.5 text-[10px]">
		<a 
			href="https://supakone.me" 
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-colors"
		>
			<ExternalLink class="h-3 w-3" />
			supakone.me
		</a>
		<a 
			href="https://github.com/preamza02/ously" 
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-colors"
		>
			<Github class="h-3 w-3" />
			GitHub
		</a>
		<a 
			href="mailto:supakone.kongprapan@gmail.com"
			class="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-colors truncate"
		>
			<Mail class="h-3 w-3 flex-shrink-0" />
			<span class="truncate">supakone.kongprapan@gmail.com</span>
		</a>
	</div>
</div>
