<script lang="ts">
import type { docItem } from "$lib/interfaces/docItem";
import type { caseItem } from "$lib/interfaces/caseItem";
import DragToList from "$lib/components/drag-to-list.svelte";
import ProfileMenu from "$lib/components/context-menu/ProfileMenu.svelte";
    
export let data;

console.log(data);
let caseItem: caseItem = data.case_item;
let docItems: Array<docItem> = caseItem.documents ?? [];

</script>

{#if (data.user)}
  <ProfileMenu>
    {data.user.username}
  </ProfileMenu>
{/if}

<section class="container w-[90%] md:w-[60%] mx-auto py-14">
  <div class="card w-full bg-base-100 shadow-lg mb-4 rounded-lg" >
    <div class="card-body p-8 pl-6">
        <div class="flex flex-row text-black">
          <div class="w-1/2">
            <p class="pb-2">Case Number: {caseItem.caseNumber}</p>
            <p class="pb-2">Address: {caseItem.address}</p>
            <p>Last Update: 27/04/2023</p> 
          </div>
        </div>
    </div>
  </div>

  <DragToList items={docItems} caseId={caseItem.id} />
</section>

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }
</style>
