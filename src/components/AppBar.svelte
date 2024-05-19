<script>
    import { Navbar, NavBrand, NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar let:NavContainer color="primary" class="dark:bg-gray-900">
    <NavContainer class="px-5 py-2 bg-primary-50 dark:bg-gray-900">
      <NavBrand href="/">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center whitespace-nowrap text-3xl font-semibold text-primary-600 dark:text-primary-50">hi-rise v1a</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/about">About</NavLi>
        <NavLi href="/docs/components/navbar">Navbar</NavLi>
        <NavLi href="/pricing">Pricing</NavLi>
        <NavLi href="/contact">Contact</NavLi>
      </NavUl>
    </NavContainer>
</Navbar>
  
  