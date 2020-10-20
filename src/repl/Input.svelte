<script>
  import * as monaco from 'monaco-editor';
  import uid from 'uid';
  import { Tabs, Tab } from 'svelte-materialify/src';
  import { onMount } from 'svelte';

  export let components = [];
  let editor;
  let models = new Map();

  // This has to be a single item array of the id of the active component
  let currentID = [components[0].id];

  // This is the index of the active component in `components`
  $: currentComponent = components.findIndex(({ id }) => id === currentID[0]);

  function changeComponent() {}

  function newComponent() {
    const id = uid();

    components = components.concat({
      id,
      name: `Component${id}`,
      type: 'svelte',
      source: '',
    });

    currentID = [id];
  }

  onMount(() => {
    editor = monaco.editor.create(document.getElementById('editor'), {
      automaticLayout: true,
      fontFamily: 'Fira Code',
      fontWeight: '500',
      fontLigatures: true,
      lineNumbersMinChars: 3,
      minimap: {
        enabled: false,
      },
    });

    editor.onDidChangeModelContent(() => {
      components[currentComponent].source =  models.get(currentID[0]).getValue();
    });

    components.forEach(({ id, source, language }) => {
      models.set(id, monaco.editor.createModel(source, 'html'));
    });

    editor.setModel(models.get(currentID[0]));
  });
</script>

<style>
  #editor {
    margin-top: 8px;
    width: 100%;
    height: 100%;
  }
</style>

<Tabs bind:value={currentID} on:change={changeComponent}>
  <div slot="tabs">
    {#each components as { name, type, id }}
      <Tab value={id}><span>{name}</span>.<span>{type}</span></Tab>
    {/each}
  </div>
</Tabs>
<div id="editor" />
