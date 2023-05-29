<script lang="ts">
import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
import { flip } from 'svelte/animate';
import { fly } from "svelte/transition";
import type {caseItem, createdUpdatedFields } from "$lib/interfaces/caseItem";
import PopupWrapper from '$lib/components/shared/PopupWrapper.svelte';
import { onMount } from 'svelte';
import type { PageData } from './$types';
import type { Case } from '@prisma/client';


export let data: PageData;

let {user, cases} = data;

let confirmationModal: boolean = false;
let addNewModal: boolean = false;
let selectedCase: Case;

let newCaseNum: string;
let newCaseAddress: string;
let newCaseErrors = {
  'newCaseNum': false,
  'newCaseAddress': false,
  'hasErrors': false
};

let showOnlyMine:boolean = true;
let searchStr:string;
let statusFilter:string;

let newCaseForm: HTMLFormElement;

onMount(() => {
    filterCases();
});

function handleDeleteCase() {
  casesTmp = casesTmp ? casesTmp.filter((item) => item.caseNumber !== selectedCase.caseNumber) : [];
  confirmationModal = false;
  let frm = new FormData();
  frm.append('del-id', selectedCase.id.toString());
  fetch("?/delete", {method:'POST', body:frm});
}

function resetFormValidation() {
  newCaseErrors.newCaseNum = false;
  newCaseErrors.newCaseAddress = false;
  newCaseErrors.hasErrors = false;
}

async function addNew() {
  resetFormValidation();
  if (!newCaseNum || newCaseNum === '') {
    newCaseErrors.newCaseNum = true;
    newCaseErrors.hasErrors = true;
  }
  if (!newCaseAddress || newCaseAddress === '') {
    newCaseErrors.newCaseAddress = true;
    newCaseErrors.hasErrors = true;
  }
  if ( cases.find((e: caseItem) => e.caseNumber === newCaseNum) ) {
    newCaseErrors.newCaseNum = true;
    newCaseErrors.hasErrors = true;
  }
  
  if (newCaseErrors.hasErrors) {
    return;
  }
  newCaseForm.submit();
  addNewModal = false;
  
}

function filterCases() {
  casesTmp = [...cases ?? []];
  if (showOnlyMine) {
    casesTmp = cases.filter((e: caseItem) => e.createdBy === user.id );
  }
  if (searchStr && searchStr.length >= 3) {
    casesTmp = cases.filter((e: caseItem) => e.address.search( new RegExp(searchStr, 'i')) > -1 || e.caseNumber.search( new RegExp(searchStr, 'i')) > -1 );
  }
  if (statusFilter && statusFilter !== '') {
    casesTmp = cases.filter((e: caseItem) => e.status === statusFilter );
  }
}

$: casesTmp = [...cases ?? []];
$: {
  filterCases();
}
</script>

<section class="flex flex-col w-[90%] md:w-[60%] mx-auto pt-16 pb-8">
  <div><h2 class="text-lg font-bold">{user.username}</h2></div>
  <div class="form-control flex flex-row items-center mt-3">

    <div class="form-control w-1/3 mr-6">
      <input type="text" class="input input-sm input-bordered rounded-md" placeholder="Search" on:keyup={filterCases} bind:value={searchStr}  />
    </div>
    <div class="form-control w-1/6">
      <select class="select select-sm select-bordered rounded-md w-full font-normal" bind:value={statusFilter} on:change={filterCases}>
        <option value="">Filter by Status</option>
        <option value="new">New</option>
        <option value="pending">Pending</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div class="form-control w-[14rem] flex flex-row items-center ml-auto">
      <label class="label cursor-pointer flex pr-2 text-lg text-[#7a7a7a] w-[13em]">Show only my cases</label>
      <input type="checkbox" class="toggle"  bind:checked={showOnlyMine} on:change={filterCases} />
    </div>

  </div>
  {#each casesTmp as caseItem (caseItem.caseNumber)}
    <a href="/admin/{caseItem.caseNumber}" in:fly animate:flip={{duration:600}} 
      class="block card bg-white w-full rounded-md py-6 px-5 drop-shadow-md flex flex-row items-center text-lg font-light mb-3">
      <div class="w-1/5">{caseItem.caseNumber}</div>
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
    <form method="post" action="?/create" bind:this={newCaseForm}>
    <div class="form-control w-full">
      <label class="label px-0">
        <span>Case Number</span>
      </label>
      <input type="text" name="case-number" class="field" 
        class:has-error={newCaseErrors.hasErrors && newCaseErrors.newCaseNum} 
        bind:value={newCaseNum} />
    </div>
    <div class="form-control w-full">
      <label class="label px-0">
        <span>Address</span>
      </label>
      <input type="text" class="field"
        class:has-error={newCaseErrors.hasErrors && newCaseErrors.newCaseAddress}
        name="case-address" required bind:value={newCaseAddress} />
    </div>
    <div class="flex justify-center mt-16">
      <button on:click|preventDefault={addNew}
        class="btn btn-sm btn-outline w-40 normal-case" type="submit">
        Create
      </button>
    </div>
    </form>
  </div>
  </PopupWrapper>
{/if}

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }
</style>
