<script lang="ts">
	import { setContext, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { key } from './menu.js';

	export let x: number;
	export let y: number;
	export let width: number;

	export let cssClasses: string = '';
	
	// whenever x and y is changed, restrict box to be within bounds
	$: (() => {
		if (!menuEl) return;
		
		const rect = menuEl.getBoundingClientRect();
		x = Math.min(window.innerWidth - rect.width-25, x);
		if (y > window.innerHeight - rect.height) y -= rect.height;
	})();
	
	const dispatch = createEventDispatcher();	
	
	setContext(key, {
		dispatchClick: () => dispatch('click')
	});
	
	let menuEl: any;
	function onPageClick(e: any) {
		//Class ignore-click-outside can be put in elements (i.e. menu items )
		// to ignore clickoutside firing
		if (e.target.classList.contains('ignore-click-outside')) {
			return;
		}
		if (e.target === menuEl || menuEl.contains(e.target)) return;

		dispatch('clickoutside');
	}
</script>

<svelte:body on:click={onPageClick} />

<div transition:fade={{ duration: 100 }} bind:this={menuEl} class="rounded {cssClasses}" style="top: {y}px; left: {x}px; width:{width}px;">
	<slot />
</div>

<style>
	div {
		position: absolute;
		display: grid;
		border: 1px solid #0003;
		box-shadow: 2px 2px 5px 0px #0002;
		background: white;
	}
</style>