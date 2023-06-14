<script lang="ts">
	import Menu from './Menu.svelte';
	import FaCircle from 'svelte-icons/fa/FaCircle.svelte';

	let pos = { x: 0, y: 0, width: 100 };
	let showMenu: boolean;
	
	async function handleClick(e: any) {
		const rect = e.target.getBoundingClientRect();
		await new Promise(res => setTimeout(res, 50));
		pos.x = e.clientX - pos.width / 2;
		pos.y = rect.bottom;

		showMenu = !showMenu;
	}

	function closeMenu() {
		showMenu = false;
	}
</script>
<button on:click={handleClick} 
	class="bg-white text-[#cecece] hover:border hover:text-black hover:border-black rounded-full w-6 h-6 justify-center flex flex-col items-center">
	<div class="w-[3px] h-[3px] mb-[2px]"><FaCircle /></div>
	<div class="w-[3px] h-[3px] mb-[2px]"><FaCircle /></div>
	<div class="w-[3px] h-[3px]"><FaCircle /></div>
</button>
{#if showMenu }
	<Menu {...pos} on:click={closeMenu} on:clickoutside={ closeMenu }>
		<slot />
	</Menu>
{/if}