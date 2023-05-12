<script lang="ts">
import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
import { flip } from 'svelte/animate';
import { fly } from "svelte/transition";
import type {caseItem } from "$lib/interfaces/caseItem";
import PopupWrapper from '$lib/components/shared/PopupWrapper.svelte';
import { auth } from '$lib/auth';
import { onMount } from 'svelte';
import {tempdb} from '$lib/temp/tempdb';

let data = tempdb.get();
let cases: Array<caseItem> = data ? [...data] : [];
let confirmationModal: boolean = false;
let addNewModal: boolean = false;
let selectedCase: caseItem;
let username:string|null = '';

let newCaseNum: string;
let newCaseAddress: string;
let newCaseErrors = {
  'newCaseNum': false,
  'newCaseAddress': false,
  'hasErrors': false
};

onMount(() => {
    if (auth.isLogged()) {
        username = auth.isLogged();
    }
});

function handleDeleteCase() {
  cases = cases.filter((item) => item.case_number !== selectedCase.case_number);
  tempdb.set(cases);
  confirmationModal = false;
}

function resetFormValidation() {
  newCaseNum = '';
  newCaseAddress = '';
  newCaseErrors.newCaseNum = false;
  newCaseErrors.newCaseAddress = false;
  newCaseErrors.hasErrors = false;
}

function addNew() {
  if (!newCaseNum || newCaseNum === '') {
    newCaseErrors.newCaseNum = true;
    newCaseErrors.hasErrors = true;
  }
  if (!newCaseAddress || newCaseAddress === '') {
    newCaseErrors.newCaseAddress = true;
    newCaseErrors.hasErrors = true;
  }
  if (newCaseErrors.hasErrors) {
    return;
  }

  let newCase: caseItem = {
    case_number: newCaseNum,
    address: newCaseAddress
  };
  cases = [newCase, ...cases];
  addNewModal = false;
  resetFormValidation();
  tempdb.set(cases);
}

</script>

<section class="flex flex-col w-[90%] md:w-[60%] mx-auto pt-16 pb-8">
  <div><h2 class="text-lg font-bold">{username}</h2></div>
  <div class="form-control flex flex-row items-center justify-end">
    <label class="label cursor-pointer flex pr-4 text-lg text-[#7a7a7a]">Show only my cases</label>
    <input type="checkbox" class="toggle" checked />
  </div>
  {#each cases as caseItem (caseItem.case_number)}
    <a href="/admin/{caseItem.case_number}" in:fly animate:flip={{duration:600}} 
      class="block card bg-white w-full rounded-md py-6 px-5 drop-shadow-md flex flex-row items-center text-lg font-light mb-3">
      <div class="w-1/5">{caseItem.case_number}</div>
      <div class="w-5/6">{caseItem.address}</div>
      <button on:click|preventDefault={() => {confirmationModal = true; selectedCase = caseItem; }}
      class="text-[#9a9a9a] hover:text-black h-5 w-5 justify-end">
        <FaRegTrashAlt />
      </button>
    </a>
  {:else}
    <div>No cases found.</div>
  {/each}
</section>
<section class="flex flex-col w-[90%] md:w-[70%] mx-auto pb-16 place-items-end">
  <button on:click={() => addNewModal = true}
  class="w-10 h-10 border border-2 border-[#CCD2E3] rounded-full text-[#CCD2E3] flex hover:border-black hover:text-black">
      <span class="inline-block text-center w-10 my-auto text-2xl">+</span>
  </button>
</section>

{#if confirmationModal}
  <PopupWrapper on:close={() => confirmationModal = false} clickOutsideClose={true} >
    <h3 class=" font-normal text-lg text-center">Confirm deletion?</h3>
    <div class="flex w-full justify-center pt-4">
        <button class="btn btn-sm btn-outline w-20 ml-2" on:click={handleDeleteCase}>Yes</button>
        <button class="btn btn-sm w-20 ml-2" on:click={() => confirmationModal = false}>Cancel</button>
    </div>
  </PopupWrapper>
{/if}

{#if addNewModal}
  <PopupWrapper on:close={() => addNewModal = false}>
  <div class="md:w-[350px]">
    <div class="card-title">Create new case</div>
    <div class="form-control w-full">
      <label class="label px-0">
        <span>Case Number</span>
      </label>
      <input type="text" class="field" bind:value={newCaseNum} />
    </div>
    <div class="form-control w-full">
      <label class="label px-0">
        <span>Address</span>
      </label>
      <input type="text" class="field" required bind:value={newCaseAddress} />
    </div>
    <div class="flex justify-center mt-16">
      <button on:click={addNew}
        class="btn btn-sm btn-outline w-40 normal-case">
        Create
      </button>
    </div>
  </div>
  </PopupWrapper>
{/if}

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }
</style>
