<script lang="ts">
// @ts-nocheck
import type { docItem } from "$lib/interfaces/docItem";
import type { docItemSubItem } from "$lib/interfaces/docItemSubItem";
import {dndzone} from 'svelte-dnd-action';
import {flip} from 'svelte/animate';
import PopupWrapper from "$lib/components/shared/PopupWrapper.svelte";
import IconCirleDel from "$lib/components/icons/icon-cirle-del.svelte";
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

const flipDurationMs:number = 200;
export let items: Array<docItem>;
export let type: string = 'draggable';
const dropFromOthersDisabled = true;
const dropTargetStyle = {outline: 'none'};
const dropTargetClasses = [ 'drop-shadow-xl' ];
let addNewItem = false;

let newHeading: string = '';
let newDesc: string = '';
let newType: string = 'reservation';
let newSubItems: Array<docItemSubItem> = [
    {id: Math.floor(Math.random() * 10000), label: ""}
];

let formErrors = {
    newHeadingError: false,
    newDescError: false,
    hasErrors: false
};

function handleSort(e) {
    items = e.detail.items;
}

function handleFinalize(e) {
    items = e.detail.items;
    dispatch('finalize-templates', items);
}

function validateNewTemplate() {
    resetFormErrors();
    if(!newHeading || newHeading === '') {
        formErrors.newHeadingError = true;
        formErrors.hasErrors = true;
    }
    if (!newDesc || newDesc === '') {
        formErrors.newDescError = true;
        formErrors.hasErrors = true;
    }

    return !formErrors.hasErrors;
}

function saveNewTemplate() {
    if (!validateNewTemplate()) {
        return;
    }
    newSubItems = newSubItems.filter((si) => si.label !== '');

    const newTempItem: docItem = {
        id: Math.floor(Math.random() * 10000),
        heading: newHeading,
        desc: newDesc,
        type: newType,
        sub_items: newSubItems
    };
    items = [...items, newTempItem];
    // console.log(items);
    addNewItem = false;
    dispatch('finalize-templates', items);
    resetNewItemForm();
    resetFormErrors();
}

function resetFormErrors() {
    formErrors.newHeadingError = false;
    formErrors.newDescError = false;
    formErrors.hasErrors = false;
}

function resetNewItemForm() {
    newHeading = '';
    newDesc = '';
    newType = 'reservation';
    newSubItems = [
        {id: Math.floor(Math.random() * 10000), label: ""}
    ];
}

function handleNewSubItem() {
    newSubItems = [...newSubItems, {id: Math.floor(Math.random() * 10000), label: ""}];
}

function handleRemoveSubItem(index: number) {
    newSubItems = newSubItems.filter((item, i) => i !== index);
}

function handlePopupClose() {
    addNewItem = false;
    resetNewItemForm();
    resetFormErrors();
}


</script>
    
<ul id="draggable-items-list" class="mt-7 w-full" use:dndzone={{
    items, flipDurationMs, type, dropFromOthersDisabled, dropTargetStyle, dropTargetClasses
}} on:consider={handleSort} on:finalize={handleFinalize}>
    {#each items as item(item.id)}
        <li animate:flip={{duration:flipDurationMs}}>
            {item.heading}	
        </li>
    {/each}
</ul>

<div class="flex mt-8">
    <button on:click={() => addNewItem = true} 
    class="w-10 h-10 border border-2 border-[#CCD2E3] mx-auto rounded-full text-[#CCD2E3] flex hover:border-black hover:text-black">
        <span class="inline-block text-center w-10 my-auto text-2xl">+</span>
    </button>
</div>

{#if addNewItem}
<PopupWrapper on:close={handlePopupClose} clickOutsideClose={true} >
    <h3 class="font-bold text-xl pb-4">Create new element</h3>
    <div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span class:text-red-600={formErrors.newHeadingError}>Heading</span>
            </label>
            <input type="text" class="field" class:has-error={formErrors.newHeadingError} bind:value={newHeading} />
        </div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span class:text-red-600={formErrors.newDescError}>Description</span>
            </label>
            <textarea class="field p-2" class:has-error={formErrors.newDescError} bind:value={newDesc} style="height:6rem"></textarea>
        </div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span>Type</span>
            </label>
            <select bind:value={newType}>
                <option value="reservation">Reservation</option>
                <option value="question">Question</option>
            </select>
        </div>
        <div class="form-control w-full">
            <label class="label">
              <span>Items</span>
            </label>
            {#each newSubItems as subItem, index}
                <div class="flex items-center mb-4">
                    <input type="text" bind:value={subItem.label} class="field w-[90%]" />
                    <button class="w-6 ml-auto" on:click={() => handleRemoveSubItem(index)}>
                        <IconCirleDel class="h-6 w-6 stroke-[#CCD2E3] hover:stroke-black " />
                    </button>
                </div>
            {/each}
        </div>
        <div class="flex mb-2">
            <button on:click={handleNewSubItem}
            class="w-10 h-10 border border-2 border-[#CCD2E3] mx-auto rounded-full text-[#CCD2E3] flex hover:border-black hover:text-black">
                <span class="inline-block text-center w-10 my-auto text-2xl">+</span>
            </button>
        </div>
    </div>
    <div class="flex min-w-[500px] justify-center pt-4">
        <button class="btn btn-sm btn-outline w-40 ml-2 normal-case" on:click={saveNewTemplate}>Save</button>
        <button class="btn btn-sm w-40 ml-2 normal-case" on:click={handlePopupClose}>Cancel</button>
    </div>
    
</PopupWrapper>
{/if}

<style lang="postcss">
#draggable-items-list li {
    @apply w-full font-light text-lg;
    @apply border border-gray-200;
    @apply bg-white rounded-md;
    @apply p-3 mb-2;
}
</style>