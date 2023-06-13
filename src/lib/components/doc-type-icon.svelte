<script lang="ts">
    import {DocType} from "$lib/enums/DocType"
    export let type: string;
    let iconChar: string;

    switch(type) {
        case DocType.INFO:
            iconChar = "i";
        break;
        case DocType.QUESTION:
            iconChar = "?";
            break;
        default:
            iconChar = "!"
    }

</script>
<div class="head-icon ml-auto" 
    class:red-icon={type === DocType.RESERVATION} 
    class:green-icon={type === DocType.QUESTION}
    class:blue-icon={type === DocType.INFO}
    >
    <span>{iconChar}</span>
</div>