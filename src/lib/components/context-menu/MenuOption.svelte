<script>
	export let isDisabled = false;
	export let text = '';
	export let cssClasses = '';
	
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();	
	
	const handleClick = () => {
		if (isDisabled) return;
		
		dispatch('click');
	}
</script>

<style>
	div {
		cursor: default;
		font-size: 14px;
		display: flex;
		align-items: center;
		grid-gap: 5px;
	}
	div:hover {
		background: #0002;
	}
	div.disabled {
		color: #0006;
	}
	div.disabled:hover {
		background: white;
	}
</style>

<div class="{cssClasses}"
  class:disabled={isDisabled}
  on:click={handleClick}
>
	{#if text}
		{text}
	{:else}
		<slot />
	{/if}
</div>
