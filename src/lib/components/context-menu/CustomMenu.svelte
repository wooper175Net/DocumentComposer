<script lang="ts">
	import Menu from './Menu.svelte';
	import MenuOption from './MenuOption.svelte';
	import FaCircle from 'svelte-icons/fa/FaCircle.svelte';

	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();

	let pos = { x: 0, y: 0 };
	let showMenu: boolean;
	
	async function handleClick(e: any) {
		await new Promise(res => setTimeout(res, 100));
		pos.x = e.clientX - 50;
		pos.y = e.clientY;
		showMenu = true;
	}
	
	function handleEdit(e) {
		dispatch('edit');
	}

	function closeMenu() {
		showMenu = false;
	}
</script>
<button on:click={handleClick} class=" text-[#cecece] hover:border hover:text-black hover:border-black rounded-full w-6 h-6 justify-center flex flex-col items-center">
	<div class="w-[3px] h-[3px] mb-[2px]"><FaCircle /></div>
	<div class="w-[3px] h-[3px] mb-[2px]"><FaCircle /></div>
	<div class="w-[3px] h-[3px]"><FaCircle /></div>
</button>
{#if showMenu}
	<Menu {...pos} on:click={closeMenu}  on:clickoutside={closeMenu} >
		<slot />
	</Menu>
{/if}