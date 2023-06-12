<script lang="ts">
import { onMount } from 'svelte';
import type { docItem } from "$lib/interfaces/docItem";
import DragFromList from "$lib/components/drag-from-list.svelte";
import DragToList from "$lib/components/drag-to-list.svelte";
import type { caseItem, createdUpdatedFields } from "$lib/interfaces/caseItem";
import {api} from '$lib/api';
    
export let data;

let caseItem: (caseItem & createdUpdatedFields)|undefined = data.caseItem;
let searchStr: string = '';

onMount(() => {
  if (!caseItem) {
    window.location.href = '/admin';
  }
});

const templateItems: Array<docItem> = data.templates;

let commonDocItems = [...templateItems];

let docItems: Array<docItem> = caseItem?.documents ?? [];

async function handleDocDrag(e: any) {
  if (!caseItem) {
    return;
  }

  let newDocList: Array<docItem> = [...e.detail];

  try {
    const responseItems = await api.updateCaseDocs(caseItem, newDocList);
    docItems = [...responseItems];
  } catch(e) {
    console.error("Error updating documents");
  }
}

function handleFinalizeTemplates(e:any) {
}

async function filterItems() {
  commonDocItems = [...templateItems];
  commonDocItems = templateItems.filter((item) => item.heading.search( new RegExp(searchStr, 'i')) > -1 );
}

</script>

<section class="grid grid-cols-12 w-full h-full">
  <section class="container w-[90%] md:w-[70%] mx-auto col-span-9 py-14">
    <div class="card w-full bg-base-100 shadow-lg mb-4 rounded-lg" >
      <div class="card-body p-8 pl-6">
          <div class="flex flex-row text-black">
            <div class="w-1/2">
              <p class="pb-2">Case Number: {caseItem?.caseNumber}</p>
              <p class="pb-2">Address: {caseItem?.address}</p>
              <p>Last Update: {caseItem?.lastUpdate ? caseItem.lastUpdate.toLocaleDateString('da-DK', {dateStyle: "medium"}) : ''}</p>
            </div>
            <div class="w-1/2">
              <p>Public URL: www.domain.reservationer.dk/{caseItem?.caseNumber}</p>
            </div>
          </div>
      </div>
    </div>

    <DragToList items={docItems} caseId={caseItem?.id} adminMode={true} 
      on:finalize={(e) => handleDocDrag(e)}
    />
  </section>

  <section class="min-h-screen col-span-3 bg-[#f1f1f1] border border-l-slate-400 py-14 px-6 ">
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
