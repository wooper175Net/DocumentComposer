<script lang="ts">
import Menu from '$lib/components/context-menu/Menu.svelte'
import MenuOption from '$lib/components/context-menu/MenuOption.svelte';
import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte'

let pos = { 
    x: 0, 
    y: 0, 
    width: 140,
};
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

function handleLogout() {
    window.location.href = '/logout';
}

</script>
<div class="ignore-click-outside absolute right-6 top-4 flex flex-row h-6 items-center cursor-pointer" 
    on:click={handleClick}>
    <div class="ignore-click-outside w-6 h-6 border-2 border-[#AE64AF] rounded-full mr-4 bg-[#E9B5EA]"></div>
    <slot />
</div>

{#if showMenu}
    <Menu {...pos} on:click={closeMenu} on:clickoutside={ closeMenu }>
        <MenuOption on:click={handleLogout}>
            <div class="text-[#CCD2E3] hover:text-black h-10 w-[120px] items-center flex flex-row pl-4">
                <span class="inline-block h-6 pl-2 mr-2"><IoIosLogOut /></span>
                <span class="text-black">Logout</span>
            </div>
        </MenuOption>
    </Menu>
{/if}