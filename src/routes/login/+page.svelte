<script lang="ts">
import { auth } from "$lib/auth"

export let form;
let loginForm: HTMLFormElement;
let username: string;
let passowrd: string;
let formErrors = {
  username: false,
  passowrd: false
};

async function login() {
  if(!username || username === '') {
    formErrors.username = true;
    return;
  }
  if(!passowrd || passowrd === '') {
    formErrors.passowrd = true;
    return;
  }

  formErrors.username = false;
  formErrors.passowrd = false;
  // auth.login(username, passowrd);

  loginForm.submit();
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
      <form action="?/login" method="post" bind:this={loginForm}>
      <div class="form-control w-full">
          <label class="label px-0">
            <span class:text-red-600={formErrors.username || form?.credentials}>Username</span>
          </label>
          <input type="text" bind:value={username} name="username" class="field" class:has-error={formErrors.username || form?.credentials} required />
      </div>
      <div class="form-control w-full">
        <label class="label px-0">
          <span class:text-red-600={formErrors.passowrd || form?.credentials}>Password</span>
        </label>
        <input type="password" bind:value={passowrd} class:has-error={formErrors.passowrd || form?.credentials} name="password" class="field" required />
      </div>
      <div class="flex justify-center mt-16">
        <button class="btn btn-sm btn-outline w-40 normal-case" on:click|preventDefault={login}>Login</button>
      </div>
      </form>
    </div>
  </div>

</section>

<style lang="postcss">
  #draggable-items-list li {
    @apply w-full border border-red-400 bg-white rounded-md;
  }
</style>
