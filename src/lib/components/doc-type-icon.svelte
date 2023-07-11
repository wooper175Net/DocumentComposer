<script lang="ts">
    import {DocType} from "$lib/enums/DocType"
    import IoMdCheckmark from 'svelte-icons/io/IoMdCheckmark.svelte'

    export let type: string;

    export let done: boolean;

    let iconChar: string;

    switch(type) {
        case DocType.INFO:
            iconChar = "i";
        break;
        case DocType.QUESTION:
            iconChar = "?";
            break;
        default:
            iconChar = "!";
    }

</script>
<div class="head-icon ml-auto" 
    class:red-icon={!done && type === DocType.RESERVATION} 
    class:green-icon={!done && type === DocType.QUESTION}
    class:blue-icon={!done && type === DocType.INFO}
    class:gray-icon={done}
    >
    <span>
        {#if done}
            <IoMdCheckmark />
        {:else}
            {iconChar}
        {/if}
        
    </span>
</div>