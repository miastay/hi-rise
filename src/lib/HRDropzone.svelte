<script>
    import { Dropzone } from 'flowbite-svelte';

    export let value = [];
    export let accepts = "";
  
    const dropHandle = (event) => {
      value = [];
      event.preventDefault();
      if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            value.push(file);
            value = value;
          }
        });
      } else {
        [...event.dataTransfer.files].forEach((file, i) => {
          value = file;
        });
      }
    };
  
    const handleChange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        value.push(files[0]);
        value = value;
      }
    };
  
    const showFiles = (files) => {
        return files[0];
    };
  </script>
  
<Dropzone
    id="dropzone"
    accept=".assoc, .txt, .csv, .tsv"
    defaultClass='flex flex-col justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
    on:drop={dropHandle}
    on:dragover={(event) => {
        event.preventDefault();
    }}
    on:change={handleChange}>
    <svg aria-hidden="true" class="mb-1 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
    {#if value.length === 0}
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">.assoc, .txt, .csv, .tsv (MAX. 500MB)</p>
    {:else}
        <p>{value[0].name}</p>
    {/if}
</Dropzone>