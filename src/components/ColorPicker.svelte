<script>
    import { Button, Modal } from 'flowbite-svelte';

    export let color = "#ffeedd";
    export let name = "Color"

    let modalOpen = false;

</script>

<div class="picker" role="button" on:click={() => modalOpen = true}>
    <div class="color" style={`background: ${color}`}/>
    <span>{name}</span>
</div>
<Modal title={`Pick color for ${name}`} bind:open={modalOpen}>
    <input type="text" placeholder="hex value" bind:value={color} on:blur={() => modalOpen = false}/>
    <svelte:fragment slot="footer">
    <Button on:click={() => modalOpen = false}>Set color</Button>
    </svelte:fragment>
</Modal>

<style lang="scss">
    .picker {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        &:active {
            .color {
                outline: solid 2px white;
                outline-offset: -1px;
                border: solid 3px black;
                transition: all 0.1s ease;
            }
        }
        span {
            margin-bottom: 3px;
        }
        .color {
        width: 25px;
        height: 25px;
        border-radius: 15px;
        }
    }
</style>

