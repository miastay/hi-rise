<script>
    import { onMount } from 'svelte';
    import About from '../components/About.svelte';
    import AppBar from '../components/AppBar.svelte';
    import Inputs from '../components/Inputs.svelte';
    import HrScatterplot from '../lib/HRScatterplot.svelte';
    import { darkMode } from '../store';
    import Options from '../components/Options.svelte';

    onMount(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            $darkMode = event.matches;
        });
    })

</script>

<AppBar />
<div class="app-grid">
    <div class="col">
        <About />
        <Inputs />
    </div>
    <div class="col">
        <HrScatterplot />
        <Options />
    </div>
</div>

<style lang="scss">
    $pad: 1rem;
    .app-grid {
        padding: $pad;
        gap: $pad;
        display: grid;
        grid-template-columns: 1fr 2fr;
        .col {
            display: flex;
            flex-direction: column;
            gap: $pad;
            width: 100%;
        }
    }
</style>

  