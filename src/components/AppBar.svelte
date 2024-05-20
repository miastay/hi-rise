<script>
    import { Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar let:NavContainer color="primary" class="dark:bg-gray-900">
    <NavContainer class="px-5 py-2 bg-primary-50 dark:bg-gray-900 self-center justify-center">
      <NavBrand href="/" class="text-primary-500 flex items-center">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12.832 3.445a1 1 0 0 0-1.664 0l-4 6A1 1 0 0 0 8 11h8a1 1 0 0 0 .832-1.555l-4-6Zm-1.664 17.11a1 1 0 0 0 1.664 0l4-6A1 1 0 0 0 16 13H8a1 1 0 0 0-.832 1.555l4 6Z" clip-rule="evenodd"/>
        </svg>
        <span class="self-center whitespace-nowrap text-3xl font-semibold text-primary-600 dark:text-primary-50">hi-rise v1a</span>
      </NavBrand>
    </NavContainer>
</Navbar>
  
  