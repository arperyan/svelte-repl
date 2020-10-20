<script>
  import Split from 'split.js';
  import { onMount } from 'svelte';
  import Input from './Input.svelte';
  import Output from './Output.svelte';

  export let components;

  const worker = new Worker('./compiler.js');

  let compiled;

  worker.addEventListener('message', ({ data }) => {
    compiled = data;
  });

  function compile(_components) {
    worker.postMessage(_components);
  }

  $: compile(components);

  onMount(() => {
    Split(['#input-section', '#output-section'], {
      elementStyle: (dimension, size, gutter) => ({
        'flex-basis': `calc(${size}% - ${gutter}px)`,
      }),
      gutterStyle: (dimension, gutter) => ({
        'flex-basis': `${gutter}px`,
      }),
      gutterSize: 4,
    });
  });
</script>

<style>
  :global(.gutter) {
    cursor: ew-resize;
    background-color: var(--theme-dividers);
  }
</style>

<div class="d-flex" style="height:100%">
  <div class="d-flex flex-column" id="input-section">
    <Input bind:components />
  </div>
  <div id="output-section">
    <Output {compiled} />
  </div>
</div>
