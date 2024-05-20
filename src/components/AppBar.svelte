<script>
    import { Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar let:NavContainer color="primary" class="dark:bg-gray-900">
    <NavContainer class="px-5 py-2 bg-primary-50 dark:bg-gray-900 self-center justify-center">
      <NavBrand href="/" class="text-primary-500 flex items-center">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <!-- <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12.832 3.445a1 1 0 0 0-1.664 0l-4 6A1 1 0 0 0 8 11h8a1 1 0 0 0 .832-1.555l-4-6Zm-1.664 17.11a1 1 0 0 0 1.664 0l4-6A1 1 0 0 0 16 13H8a1 1 0 0 0-.832 1.555l4 6Z" clip-rule="evenodd"/>
        </svg> -->
        <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" height=32 viewBox="0 0 5.29 11.43" class="mt-1">
            <defs>
              <style>
                .cls-1 {
                  fill: none;
                }
          
                .cls-1, .cls-2 {
                  stroke: currentColor;
                  stroke-miterlimit: 10;
                  stroke-width: .5px;
                }
          
                .cls-2 {
                  fill: currentColor;
                }
              </style>
            </defs>
            <g id="svg284677">
              <circle class="cls-2" cx="2.64" cy="2.64" r="2.39"/>
              <circle class="cls-1" cx="2.64" cy="8.78" r="2.39"/>
            </g>
        </svg>
        <span class="ml-2 self-center whitespace-nowrap text-3xl font-semibold text-primary-600 dark:text-primary-50">hi-rise v1a</span>
      </NavBrand>
    </NavContainer>
</Navbar>
  
  