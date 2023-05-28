<script lang="ts">

function logout() {
    window.location.href = '/logout';
}

</script>
<div class="absolute right-6 top-4 btn btn-xs btn-outline"><button on:click={logout}>Logout</button></div>

<slot />