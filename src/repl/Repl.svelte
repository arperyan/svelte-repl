<script>
  import Input from './Input.svelte';
  import Output from './Output.svelte';
  import { Divider } from 'svelte-materialify/src';

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
</script>

<style>
  #input-section,
  #output-section {
    flex-basis: 50%;
  }
</style>

<div class="d-flex" style="height:100%">
  <div class="d-flex flex-column" id="input-section">
    <Input bind:components />
  </div>
  <Divider vertical />
  <div id="output-section">
    <Output {compiled} />
  </div>
</div>
