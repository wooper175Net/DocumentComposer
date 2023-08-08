<script lang="ts">
// @ts-nocheck
import type { docItem } from "$lib/interfaces/docItem";
import type { docItemSubItem } from "$lib/interfaces/docItemSubItem";
import {dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME} from 'svelte-dnd-action';
import {flip} from 'svelte/animate';
import PopupWrapper from "$lib/components/shared/PopupWrapper.svelte";
import IconCirleDel from "$lib/components/icons/icon-cirle-del.svelte";
import { createEventDispatcher } from 'svelte';
import CustomMenu from "$lib/components/context-menu/CustomMenu.svelte";
import MenuOption from '$lib/components/context-menu/MenuOption.svelte';
import FaPen from 'svelte-icons/fa/FaPen.svelte';
import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte';
import { api } from "$lib/api";
import { DocType } from "$lib/enums/DocType";
import { SubItemType } from "$lib/enums/SubItemType";
import IoIosCheckboxOutline from "svelte-icons/io/IoIosCheckboxOutline.svelte";
import IconText from "$lib/components/icons/icon-text.svelte";

const dispatch = createEventDispatcher();

const flipDurationMs:number = 200;
export let items: Array<docItem>;
export let type: string = 'draggable';
const dropFromOthersDisabled = true;
const dropTargetStyle = {outline: 'none'};
const dropTargetClasses = [ 'drop-shadow-xl' ];

let addNewItem = false;
let editItem = false; //set this true when editing item

let toEditId: string = '';
let newHeading: string = '';
let newDesc: string = '';
let newType: string = 'reservation';
let newSubItems: Array<docItemSubItem>;
let deletedSubItems: Array<docItemSubItem> = [];

let formErrors = {
    newHeadingError: false,
    newDescError: false,
    hasErrors: false
};

let shouldIgnoreDndEvents:boolean = false;
let confirmDelModal:boolean = false;
let toDeleteId:string;
let restoreId: [number, number] = [];

function handleOnConsider(e) {
    const {trigger, id} = e.detail.info;
    if (trigger === TRIGGERS.DRAG_STARTED) {
        const idx = items.findIndex(item => item.id === id);
        //Keep the real id to restore in handleFinalize
        restoreId = [idx, id];
        const newId = Math.round(Math.random()*10000); 
        e.detail.items = e.detail.items.filter(item => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
        e.detail.items.splice(idx, 0, {...items[idx], id: newId});
        items = e.detail.items;
        shouldIgnoreDndEvents = true;   

        // console.log(items)
    }
    else if (!shouldIgnoreDndEvents) {
        items = e.detail.items;
    }
    else {
        items = [...items];
    }
}

function handleFinalize(e) {
    if (!shouldIgnoreDndEvents) {
        items = e.detail.items;
    }
    else {
        items = [...items];
        shouldIgnoreDndEvents = false;
    }
    const [index, realId] = restoreId

    dispatch('finalize-templates', items); 

    if (index && realId) {
        items[index].id = realId;

    }
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

async function saveNewTemplate() {
    if (!validateNewTemplate()) {
        return;
    }
    newSubItems = newSubItems.filter((si) => si.label !== '');

    if (editItem) {
        const toEdit: docItem = items.find(e => e.id === toEditId);

        toEdit.heading = newHeading;
        toEdit.desc = newDesc;
        toEdit.type = newType;
        toEdit.documentSubItems = newSubItems;
        editItem = false;
        
        try {
            await api.updateDocTemplate(toEdit, deletedSubItems);
            items = [...items];
        } catch (e) {
            console.error("Template not updated");
        }
        
    } else {
        try {
            const newTempItem = await api.createDocTemplate(
                {
                    heading: newHeading,
                    desc: newDesc,
                    type: newType,
                    documentSubItems: newSubItems
                }
            );
            items = [newTempItem, ...items];
            
        } catch(e) {
            console.error('Creating new template failed');
        }
        addNewItem = false;
    }

    resetNewItemForm();
    resetFormErrors();

    dispatch('finalize-templates', items);
}

function resetFormErrors() {
    formErrors.newHeadingError = false;
    formErrors.newDescError = false;
    formErrors.hasErrors = false;
}

function resetNewItemForm() {
    toEditId = null;
    newHeading = '';
    newDesc = '';
    newType = 'reservation';
    newSubItems = [
        {id: Math.floor(Math.random() * 10000), label: "", checked: false, type: SubItemType.TODO}
    ];
    deletedSubItems = [];
}

function handleNewItem() {
    resetNewItemForm();
    addNewItem = true;
}

function handleNewSubItem(subItemType: SubItemType) {
    const newSubItem = {
        id: Math.floor(Math.random() * 10000),
        label: "",
        type: subItemType,
        checked: subItemType === SubItemType.TODO ? false : null
    };

    newSubItems = [...newSubItems, newSubItem];
}

function handleRemoveSubItem(index: number) {
    deletedSubItems.push(newSubItems[index]);
    newSubItems = newSubItems.filter((item, i) => i !== index);
}

function handlePopupClose() {
    addNewItem = false;
    editItem = false;
    resetNewItemForm();
    resetFormErrors();
}

function handleEditItem(item: docItem) {
    resetNewItemForm();
    toEditId = item.id;
    newHeading = item.heading;
    newDesc = item.desc;
    newType = item.type;
    if (item.documentSubItems && item.documentSubItems.length > 0) {
        newSubItems = item.documentSubItems;
    }
    editItem = true;
}

function confirmDeleteItem(itemId:any) {
    toDeleteId = itemId;
    confirmDelModal = true;
}

async function handleDeleteItem() {
    if (!toDeleteId) {
        return;
    }
    console.log(toDeleteId);
    try {
        await api.deleteDocTemplate(toDeleteId);
        items = items.filter(e => e.id !== toDeleteId);
        toDeleteId = null;
        confirmDelModal = false;
    } catch(e) {
        console.error('Delete failed');
    }

    dispatch('finalize-templates', items);
}

</script>
    
<ul id="draggable-items-list" class="mt-7 w-full" use:dndzone={{
    items, flipDurationMs, type, dropFromOthersDisabled, dropTargetStyle, dropTargetClasses
}} on:consider={handleOnConsider} on:finalize={handleFinalize}>
    {#each items as item(item.id)}
        <li animate:flip={{duration:flipDurationMs}}>
            <div>{item.heading}</div>
            <div class="w-6 ml-auto">
                <CustomMenu>
                    <MenuOption on:click={() => handleEditItem(item)} cssClasses={"p-2"}>
                    <span class="text-[#CCD2E3] hover:text-black">
                        <span class="inline-block h-4  pl-2 mr-2"><FaPen /></span>
                        <span class="text-black">Edit</span>
                    </span>
                    </MenuOption>
                    <MenuOption on:click={() => confirmDeleteItem(item.id)} cssClasses={"p-2"}>
                    <span class="text-[#CCD2E3] hover:text-black">
                        <span class="inline-block h-4  pl-2 mr-2"><FaTrashAlt /></span>
                        <span class="text-black">Delete</span>
                    </span>
                    </MenuOption>
                </CustomMenu>
            </div>
        </li>
    {/each}
</ul>

<div class="flex mt-8">
    <button on:click={handleNewItem} data-tip="Tilføj ny skabelon"
    class="w-10 h-10 border border-2 border-[#CCD2E3] mx-auto rounded-full text-[#CCD2E3] flex hover:border-black hover:text-black tooltip">
        <span class="inline-block text-center w-10 my-auto text-2xl">+</span>
    </button>
</div>

{#if addNewItem || editItem}
<PopupWrapper on:close={handlePopupClose} clickOutsideClose={true} >
    <input type="hidden" bind:value={toEditId} />
    <h3 class="font-bold text-xl pb-4">{(toEditId) ? "Rediger element" : "Opret nyt element"}</h3>
    <div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span class:text-red-600={formErrors.newHeadingError}>Overskrift</span>
            </label>
            <input type="text" class="field" class:has-error={formErrors.newHeadingError} bind:value={newHeading} />
        </div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span class:text-red-600={formErrors.newDescError}>Beskrivelse</span>
            </label>
            <textarea class="field p-2" class:has-error={formErrors.newDescError} bind:value={newDesc} style="height:6rem"></textarea>
        </div>
        <div class="form-control w-full pr-10">
            <label class="label">
              <span>Type</span>
            </label>
            <select bind:value={newType} class="select select-sm select-bordered w-full max-w-xs rounded-md h-10 text-lg font-light">
                <option value="{DocType.RESERVATION}">Forbehold</option>
                <option value="{DocType.QUESTION}">Spørgsmål</option>
                <option value="{DocType.INFO}">Information</option>
            </select>
        </div>
        <div class="form-control w-full">
            <label class="label">
              <span>Genstande</span>
            </label>
            {#each newSubItems as subItem, index}
                <div class="flex items-center mb-4">
                    {#if subItem.type === SubItemType.TODO}
                    <span class="w-8 h-8 text-[#CCD2E3] flex-none">
                        <IoIosCheckboxOutline  />
                    </span>
                    {:else}
                        <IconText class="fill-[#CCD2E3] h-6 w-8 flex-none" />
                    {/if}
                    <input type="text" bind:value={subItem.label} class="field grow mx-2" />
                    <button class="w-6 ml-auto flex-none" on:click={() => handleRemoveSubItem(index)}>
                        <IconCirleDel class="h-6 w-6 stroke-[#CCD2E3] hover:stroke-black " />
                    </button>
                </div>
            {/each}
        </div>
        <div class="flex mb-2">
            <div class="group w-10 h-10 border border-2 border-[#CCD2E3] mx-auto rounded-full text-[#CCD2E3] 
                flex hover:w-24 justify-center items-center cursor-pointer hover:animate-jump hover:animate-delay-100 hover:animate-duration-200"
                >
                    <span class="inline-block text-center w-10 my-auto text-2xl group-hover:hidden">+</span>

                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="hidden group-hover:inline-block w-12 h-8 hover:text-black tooltip"
                    data-tip="Tilføj ny opgave"
                    on:click={() => handleNewSubItem(SubItemType.TODO) } 
                    >
                        <IoIosCheckboxOutline  />
                    </span>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="hidden group-hover:inline-block tooltip" 
                    data-tip="Tilføj ny tekst"
                    on:click={() => handleNewSubItem(SubItemType.TEXT)} >
                        <IconText class="fill-[#CCD2E3] h-[1.3rem] w-12 m-auto hover:fill-black" />
                    </span>
            </div>
        </div>
    </div>
    <div class="flex min-w-[500px] justify-center pt-4">
        <button class="btn btn-sm btn-outline w-40 ml-2 normal-case" on:click={saveNewTemplate}>Gem</button>
        <button class="btn btn-sm w-40 ml-2 normal-case" on:click={handlePopupClose}>Afbestille</button>
    </div>
    
</PopupWrapper>
{/if}

{#if confirmDelModal}
    <PopupWrapper on:close={() => confirmDelModal = false} clickOutsideClose={true} >
        <h3 class=" font-normal text-lg text-center">Bekræft sletning?</h3>
        <div class="flex w-full justify-center pt-4">
            <button class="btn btn-sm btn-outline w-20 ml-2" on:click={handleDeleteItem} >Ja</button>
            <button class="btn btn-sm w-20 ml-2" on:click={() => confirmDelModal = false}>Afbestille</button>
        </div>
    </PopupWrapper>
{/if}

<style lang="postcss">
#draggable-items-list li {
    @apply w-full font-light text-lg;
    @apply border border-gray-200;
    @apply bg-white rounded-md;
    @apply p-3 mb-2;
    @apply flex flex-row;
}
</style>