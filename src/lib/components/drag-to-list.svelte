<script lang="ts">
// @ts-nocheck
import type { docItem } from "$lib/interfaces/docItem";
import type { docItemSubItem } from "$lib/interfaces/docItemSubItem"
import {dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME} from 'svelte-dnd-action';
import {flip} from 'svelte/animate';
import {fade} from 'svelte/transition';
import {cubicIn} from 'svelte/easing';
import PopupWrapper from "$lib/components/shared/PopupWrapper.svelte";
import IconFolderDel from "$lib/components/icons/icon-folder-del.svelte";
import IconCircleDblCheck from "$lib/components/icons/icon-circle-dbl-check.svelte";
import IconCircleDblCheckStrout from "$lib/components/icons/icon-circle-dbl-check-strout.svelte";
import IconCirleDel from "$lib/components/icons/icon-cirle-del.svelte";
import DocTypeIcon from "./doc-type-icon.svelte";
import FaPen from 'svelte-icons/fa/FaPen.svelte'
import { createEventDispatcher } from 'svelte';
import { api } from "$lib/api";
import {CaseStatus} from "$lib/enums/CaseStatus"
import {DocType} from "$lib/enums/DocType"

const dispatch = createEventDispatcher();

const flipDurationMs:number = 200;

export let caseId: number|undefined;
export let items: Array<docItem>;
export let type: string = 'draggable';
const dropTargetStyle = {outline: 'none'};
const dropTargetClasses = [ 'drop-shadow-xl' ];
const morphDisabled = true;
let dragDisabled = true;

$: {
    if (!adminMode) {
        dragDisabled = true;
    } else {
        dragDisabled = items.length === 0;
    }
}

let subItemModal = false;
let confirmDelModal = false;
let confirmDoneModal = false;
let confirmUndoneModal = false;
export let adminMode = false;

let tempDocItem: docItem;
let tempDocSubItem;
let whatToDelete: Function;

let newSubItemTitle: string;
let newSubItemError = false;

let showEditHead:number|null;
let showEditDesc:number|null;
let editItemHead:number|null;
let editItemDesc:number|null;

function handleSort(e) {
    items = e.detail.items;
}

function handleFinalize(e) {
    items = e.detail.items;
    dispatch('finalize', items);
}


function confirmDocItemToDel(item: docItem) {
    confirmDelModal = true;
    tempDocItem = item;
    whatToDelete = deleteDocItem;
}

function confirmSubItemToDel(item:docItem, subItem: docItemSubItem) {
    confirmDelModal = true;
    tempDocItem = item;
    tempDocSubItem = subItem;
    whatToDelete = deleteDocSubItem;
}

const deleteDocItem = async function() {
    try {
        await api.deleteDoc(tempDocItem.id);
        items = items.filter((item) => item.id !== tempDocItem.id);
    } catch(e) {
        console.error("Deletion failed");
    }
    confirmDelModal = false;
};

const deleteDocSubItem = async function() {
    try {
        await api.deleteSubItem(tempDocSubItem.id);
        tempDocItem.documentSubItems = tempDocItem.documentSubItems.filter((item) => item.id !== tempDocSubItem.id);

        items = items.map((item) => {
            if (item.id === tempDocItem.id) {
            return tempDocItem;
            }
            return item;
        });
    } catch(e) {
        console.error('Deletion failed');
    }

    confirmDelModal = false;
}

function addDocSubItem(item: docItem) {
    subItemModal = true;
    tempDocItem = item;
}

async function saveDocSubItem() {
    newSubItemError = false;

    if (!newSubItemTitle || newSubItemTitle === '') {
        newSubItemError = true;
        return;
    }
    try {
        const newSubItem = await api.addSubItem(tempDocItem.id, {label: newSubItemTitle});

        if (!tempDocItem.documentSubItems) {
            tempDocItem.documentSubItems = [];
        }

        tempDocItem.documentSubItems.push(newSubItem);
        newSubItemTitle = '';
        
        items = items.map((item) => {
            if (item.id === tempDocItem.id) {
            return tempDocItem;
            }
            return item;
        });
    } catch(e) {
        console.error('Saving failed');
    }

    subItemModal = false;
}

function confirmItemDoneToggle(item) {
    if (item.done) {
        confirmUndoneModal = true;
    } else {
        confirmDoneModal = true;
    }
    tempDocItem = item;

    //sort items by sequence to maintain proper ordering
    items.sort((a,b) => {
        if (a.sequence < b.sequence) {
            return -1;
        }
        if (a.sequence > b.sequence) {
            return 1;
        }
        return 0;
    })
}

async function checkItemDone() {
    if (!caseId) {
        return;
    }

    const isDone = confirmDoneModal;
    try {
        await api.toggleDoc(tempDocItem.id, isDone);
    
        let itemToCheck = tempDocItem;
        items = items.map((item) => {
            if (item.id === itemToCheck.id) {
                item.done = isDone;
                item.documentSubItems?.forEach((subItem) => subItem.checked = isDone);
            }
            return item;
        });

        const status = isDone ? CaseStatus.DONE : CaseStatus.PENDING;
        
        await api.toggleCaseStatus(caseId, status);
        
    } catch(e) {
        console.error("Updating item failed");
    }
    confirmDoneModal = false;
    confirmUndoneModal = false;
}

$: items.sort((a,b) => {
    if (a.done && !b.done)
        return 1;
    if (!a.done && !b.done)
        return 0;
    if (!a.done && b.done)
        return -1;
});


function handleEscape(e) {
    if (e.key === 'Escape') {
        editItemDesc = null;
        editItemHead = null;
    }
}

async function handleEnterKey(e, item: docItem) {
    if (!adminMode)
        return;
    if (e.key !== 'Enter' || (!editItemDesc && !editItemHead)) {
        return;
    }
    try {
        await api.updateDoc(item);
    } catch(e) {
        console.error('Update failed')
    }

    editItemDesc = null;
    editItemHead = null;
}

function inlineEditHeadClick(item: docItem) {
    if (!adminMode)
    return;
    if(editItemHead || item.done) {
        return;
    }
    editItemHead = item.id;
}

function inlineEditDescClick(item: docItem) {
    if (!adminMode)
        return;
    if(editItemDesc || item.done) {
        return;
    }
    editItemDesc = item.id;
}

function closeConfirmDone() {
    confirmDoneModal = false;
    confirmUndoneModal = false;
}

function checkSubItems(item: docItem, subItem: docItemSubItem) {
    tempDocItem = item;

    try {
        api.toggleSubItem(subItem.id, subItem.checked);

        const unchecked: Array<docItemSubItem> = item.documentSubItems?.filter(e => !e.checked);
        if (unchecked.length === 0) {
            confirmDoneModal = true;
        }
    } catch(e) {
        console.error('Changing sub-item failed');
    }
}


</script>


<svelte:window on:keydown={handleEscape} />



<section use:dndzone={{
    items, flipDurationMs, type, dropTargetStyle, dropTargetClasses, morphDisabled, dragDisabled
}} on:consider={handleSort} on:finalize={handleFinalize}>

{#each items as item(item.id)}
    <div class="card w-full bg-base-100 shadow-lg mb-4 rounded-lg" class:done={item.done} animate:flip={{duration:flipDurationMs}}>
        <div class="card-body p-4 pl-6">
            <div class="card-title font-medium text-xl flex items-baseline">
                <span class="w-full" class:cursor-pointer={adminMode && !item.done}
                    on:mouseenter={() => showEditHead = item.id}
                    on:mouseleave={() => showEditHead = null}
                    on:click={() => inlineEditHeadClick(item)}
                    on:keyup={(e) => handleEnterKey(e, item)}
                >
                    {#if adminMode && editItemHead === item.id}
                        <input type="text" bind:value="{item.heading}" class="input input-md input-bordered w-[90%] rounded-md" />
                    {:else}
                        <span>{item.heading}</span>
                    {/if}
                    {#if adminMode && showEditHead === item.id && editItemHead !== item.id}
                        <span class="inline-block h-4 text-[#CCD2E3] pl-2"><FaPen /></span>
                    {/if}
                </span>    
                <DocTypeIcon type={item.type} />
            </div>
            <div class:cursor-pointer={adminMode && !item.done}
                on:mouseenter={() => showEditDesc = item.id}  
                on:mouseleave={() => showEditDesc = null}
                on:click={() => inlineEditDescClick(item)}
                on:keyup={(e) => handleEnterKey(e, item)}
            >
            {#if adminMode && editItemDesc === item.id}
                <textarea bind:value={item.desc} class="textarea textarea-bordered w-full h-[5rem] rounded-md"></textarea>
            {:else}
                <p class="text-[#787878] text-lg">
                    {item.desc ?? ''}
                {#if adminMode && showEditDesc === item.id && editItemDesc !== item.id}
                <span class="inline-block h-4 text-[#CCD2E3] pl-2"><FaPen /></span>
                {/if}
                </p>
            {/if}
            </div>
            {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
				<div in:fade={{duration:200, easing: cubicIn}} class='card-body custom-shadow-item'>
                    <h2 class="card-title font-medium">{item.heading}</h2>
                </div>
			{/if}
            {#if item.documentSubItems}
            <ul class="chckbox-list my-6">
                {#each item.documentSubItems as sub_item(sub_item.id)}
                <li class="flex items-center"><label class="w-[90%]">
                    <input type="checkbox" bind:checked={sub_item.checked} disabled={item.done} on:change={() => checkSubItems(item, sub_item)} />
                    <span>{sub_item.label}</span>
                    </label>
                    {#if adminMode && !item.done}
                    <button class="w-6 ml-auto" on:click={() => confirmSubItemToDel(item, sub_item)}>
                        <IconCirleDel class="h-6 w-6 stroke-[#CCD2E3] hover:stroke-black " />
                    </button>
                    {/if}
                </li>
                {/each}
            </ul>
            {/if}
            {#if adminMode && !item.done}
            <div class="flex">
                <button on:click={()=> addDocSubItem(item) } data-tip="Add new sub-item"
                class="tooltip w-10 h-10 border border-2 border-[#CCD2E3] mx-auto rounded-full text-[#CCD2E3] flex hover:border-black hover:text-black">
                    <span class="inline-block text-center w-10 my-auto text-2xl">+</span>
                </button>
            </div>
            
            <div class="flex justify-end h-6 gap-2">
                <button on:click={() => confirmDocItemToDel(item) } class="tooltip" data-tip="Delete item">
                    <IconFolderDel class="stroke-[#cecece] w-6 h-6 hover:stroke-black " />
                </button>
                <button on:click={() => confirmItemDoneToggle(item)} class="tooltip" data-tip="Mark item as DONE">
                    <IconCircleDblCheck class="stroke-[#cecece] w-6 h-6 hover:stroke-black " />
                </button>
            </div>
            {/if}
            {#if item.done}
            <div class="flex justify-end h-6 gap-2">
                <button on:click={() => confirmItemDoneToggle(item)} class="tooltip" data-tip="Mark item as UNDONE">
                    <IconCircleDblCheckStrout class="stroke-red-800 w-6 h-6 hover:stroke-black " />
                </button>
            </div>
            {/if}
        </div>
        
    </div>
{:else} 
    <div class="h-40 border rounded-lg bg-gray-100 border-dashed border-gray-400"></div>
{/each}
</section>
{#if subItemModal}
    <PopupWrapper on:close={() => subItemModal = false} clickOutsideClose={false} >
        <h3 class=" font-normal text-lg">Add Sub Item</h3>
        <div class="flex py-2 w-[500px]">
            <input type="text" class="input input-sm input-bordered w-2/3 rounded-sm" class:border-red-600={newSubItemError} bind:value={newSubItemTitle} />
            <button class="btn btn-sm btn-outline w-1/6 ml-2 normal-case" on:click={saveDocSubItem}>Add</button>
            <button class="btn btn-sm w-1/6 ml-2 normal-case" on:click={() => subItemModal = false}>Cancel</button>
        </div>
    </PopupWrapper>
{/if}

{#if confirmDelModal}
    <PopupWrapper on:close={() => confirmDelModal = false} clickOutsideClose={true} >
        <h3 class=" font-normal text-lg text-center">Confirm deletion?</h3>
        <div class="flex w-full justify-center pt-4">
            <button class="btn btn-sm btn-outline w-20 ml-2" on:click={whatToDelete} >Yes</button>
            <button class="btn btn-sm w-20 ml-2" on:click={() => confirmDelModal = false}>Cancel</button>
        </div>
    </PopupWrapper>
{/if}

{#if confirmDoneModal || confirmUndoneModal}
    <PopupWrapper on:close={closeConfirmDone} clickOutsideClose={true} >
        <h3 class=" font-normal text-lg text-center">
            {confirmDoneModal ? 'Mark item as done?' : 'Mark item (and all sub-items) as undone?'}
        </h3>
        <div class="flex w-full justify-center pt-4">
            <button class="btn btn-sm btn-outline w-20 ml-2" on:click={checkItemDone} >Yes</button>
            <button class="btn btn-sm w-20 ml-2" on:click={closeConfirmDone}>Cancel</button>
        </div>
    </PopupWrapper>
{/if}


<style lang="postcss">
.chckbox-list li label {
    @apply label cursor-pointer justify-start;
}
.chckbox-list label input {
    @apply rounded-md w-6 h-6 drop-shadow-md;
}
.chckbox-list label input:checked {
    @apply accent-[#59FF60];
}
.chckbox-list label span {
    @apply pl-4;
}

.done {
    @apply bg-[#cecece] text-[#787878];
}
</style>