<script lang="ts">
import { onMount } from 'svelte';
import type { docItem } from "$lib/interfaces/docItem";
import DragFromList from "$lib/components/drag-from-list.svelte";
import DragToList from "$lib/components/drag-to-list.svelte";
import type { caseItem } from "$lib/interfaces/caseItem";
import {tempdb, templatedb} from '$lib/temp/tempdb';
    
export let data;
let cases: Array<caseItem> = tempdb.get() ?? [];
let caseItem: caseItem|undefined = cases.find((item) => item.case_number == data.case_num);
let searchStr: string = '';

onMount(() => {
  if (!caseItem) {
    window.location.href = '/admin';
  }
  
});

let commonDocItems: Array<docItem> = templatedb.get() ?? [];

let docItems: Array<docItem> = caseItem?.doc_itmes ?? [];

function handleFinalize(e: any) {
  if (!caseItem)
    return;
  caseItem.doc_itmes = [...e.detail];
  caseItem.status = 'pending';
  let checkDone = true;
	caseItem.doc_itmes.forEach((e: docItem) => {
		checkDone = checkDone && (e.done ?? false);
		checkDone ? caseItem.status = 'done' : caseItem.status = 'pending'
	});
  let caseIndex = cases.findIndex((item) => item.case_number === caseItem?.case_number);
  cases[caseIndex].doc_itmes = caseItem.doc_itmes;
  tempdb.set(cases);
}

function handleFinalizeTemplates(e:any) {
  console.log(e.detail);
  templatedb.set([...e.detail]);
}

async function filterItems() {
  commonDocItems = templatedb.get() ?? [];
  commonDocItems = commonDocItems.filter((item) => item.heading.search( new RegExp(searchStr, 'i')) > -1 );
}

</script>

<section class="grid grid-cols-12 w-full h-full">
  <section class="container w-[90%] md:w-[70%] mx-auto col-span-9 py-14">
    <div class="card w-full bg-base-100 shadow-lg mb-4 rounded-lg" >
      <div class="card-body p-8 pl-6">
          <div class="flex flex-row text-black">
            <div class="w-1/3">
              <p class="pb-2">Case Number: {caseItem?.case_number}</p>
              <p class="pb-2">Address: {caseItem?.address}</p>
              <p>Last Update: {caseItem?.last_update}</p>
            </div>
            <div class="w-2/3">
              <p>Public URL: www.domain.reservationer.dk/{data.case_num}</p>
            </div>
          </div>
      </div>
    </div>

    <DragToList items={docItems} on:finalize={handleFinalize} adminMode={true} />
  </section>

  <section class="min-h-screen col-span-3 bg-[#f1f1f1] border border-l-slate-400 py-14 px-6">
    <input on:keyup={filterItems} bind:value={searchStr} 
      type="text" placeholder="Search Templates" class="input input-bordered input-lg h-[3rem] p-4 w-full"  />
    <DragFromList items={commonDocItems} on:finalize-templates={handleFinalizeTemplates} />
  </section>
</section>

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }

</style>
