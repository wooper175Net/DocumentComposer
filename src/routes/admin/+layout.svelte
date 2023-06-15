<script lang="ts">
import ProfileMenu from '$lib/components/context-menu/ProfileMenu.svelte'; 

export let data;

</script>

<ProfileMenu>
    {data.user.username}
</ProfileMenu>

<slot />