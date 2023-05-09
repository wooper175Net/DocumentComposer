<script lang="ts">
import { onMount } from "svelte";
import {auth} from '$lib/auth'

onMount(() => {
    if (!auth.isLogged()) {
        window.location.href = '/login';
    }
});

function logout() {
    auth.logout();
    window.location.href = '/login';
}

</script>
<div class="absolute right-6 top-4 btn btn-xs btn-outline"><button on:click={logout}>Logout</button></div>

<slot />