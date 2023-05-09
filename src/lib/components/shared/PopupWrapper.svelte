<script>
    export let clickOutsideClose = false;

    import { scale, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function handleEscape(e) {
        if (e.key !== "Escape") return;
        dispatch("close");
    }
</script>

<svelte:window on:keydown={handleEscape} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    in:fade
    on:click|self={() => (clickOutsideClose ? dispatch("close") : {})}
    class="fixed z-20 left-0 top-0 flex flex-row flex-grow w-full h-full justify-center items-center bg-black bg-opacity-40 cursor-pointer"
>
    <div
        in:scale={{ delay: 100, duration: 300, easing: quintOut }}
        class="bg-white px-8 py-10 pb-4 z-40 shadow-sm w-fit relative popup rounded-md max-h-full  overflow-auto "
    >
        <button
            on:click={() => dispatch("close")}
            class="absolute right-2 top-2 hover:text-red-400"
        >
            <svg
                class="w-10 fill-current hover:rotate-90 transition-transform"
                viewBox="0 0 752 752"
            >
                <path
                    d="m524.71 203.62-138.76 138.76c-5.6836 5.6836-14.68 5.6836-19.891 0l-138.76-138.76c-5.6836-5.6836-14.68-5.6836-19.891 0-5.6836 5.6836-5.6836 14.68 0 19.891l138.76 138.76c5.6836 5.6836 5.6836 14.68 0 19.891l-139.23 139.23c-5.6836 5.6836-5.6836 14.68 0 19.891 5.6836 5.6836 14.68 5.6836 19.891 0l138.76-138.76c5.6836-5.6836 14.68-5.6836 19.891 0l139.23 139.23c5.6836 5.6836 14.68 5.6836 19.891 0 5.6836-5.6836 5.6836-14.68 0-19.891l-138.29-139.23c-5.6836-5.6836-5.6836-14.68 0-19.891l138.76-138.76c5.6836-5.6836 5.6836-14.68 0-19.891-5.6836-5.6836-14.68-5.6836-20.363-0.47656z"
                />
            </svg>
        </button>
        <slot />
    </div>
</div>

<style>
    .popup {
        min-width: 360px;
    }
</style>
