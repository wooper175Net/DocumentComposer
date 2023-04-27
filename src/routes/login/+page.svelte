<script lang="ts">
import { auth } from "$lib/auth"

let username: string;
let passowrd: string;
let formErrors = {
  username: false,
  passowrd: false
};

function login() {
  if(!username || username === '') {
    formErrors.username = true;
    return;
  }
  formErrors.username = false;
  auth.login(username, passowrd);
  window.location.href = '/admin';
}

function handleKeyDown(e:any) {
  if (e.key === "Enter") {
    login();
  } 
}

</script>

<svelte:window on:keypress={handleKeyDown} />

<section class="container w-[90%] md:w-[45%] lg:w-[25%] mx-auto col-span-4 py-14 flex" style="height: 100vh">
  <div class="card w-full min-h-[100px] h-[24rem] bg-base-100 shadow-lg rounded-lg mt-0 md:mt-20" >
    <div class="card-body">
      <div class="card-title font-bold text-xl flex items-baseline">
        <span>Login</span>
      </div>
      <div>
      <div class="form-control w-full">
          <label class="label px-0">
            <span>Username</span>
          </label>
          <input type="text" bind:value={username} class="field" class:has-error={formErrors.username} required />
      </div>
      <div class="form-control w-full">
        <label class="label px-0">
          <span>Password</span>
        </label>
        <input type="password" class="field" required />
      </div>
      <div class="flex justify-center mt-16">
        <button class="btn btn-sm btn-outline w-40 normal-case" on:click={login}>Login</button>
    </div>
    </div>
  </div>

</section>

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }
</style>
