<script>
  import * as monaco from 'monaco-editor';
  import uid from 'uid';
  import { mdiPlus } from '@mdi/js';
  import { SlideGroup, Button, Icon } from 'svelte-materialify/src';
  import Tab from './components/Tab.svelte';
  import { theme } from '../App.svelte';
  import { onMount } from 'svelte';

  export let components = [];
  let editor;
  let models = new Map();

  // This has to be a single item array of the id of the active component
  let currentID = [components[0].id];

  // This is the index of the active component in `components`
  $: currentComponent = components.findIndex(({ id }) => id === currentID[0]);

  const languages = { svelte: 'html', js: 'javascript' };

  onMount(() => {
    components.forEach(({ id, source, type }) => {
      models.set(id, monaco.editor.createModel(source, languages[type]));
    });

    editor = monaco.editor.create(document.getElementById('editor'), {
      model: models.get(currentID[0]),
      automaticLayout: true,
      fontFamily: 'Fira Code',
      fontWeight: '500',
      fontLigatures: true,
      lineNumbersMinChars: 3,
      tabSize: 2,
      autoClosingBrackets: true,
      scrollbar: {
        vertical: false,
      },
      minimap: {
        enabled: false,
      },
    });

    editor.onDidChangeModelContent(() => {
      components[currentComponent].source = models.get(currentID[0]).getValue();
    });

    theme.subscribe((v) => {
      editor.updateOptions({
        theme: v === 'light' ? 'vs' : 'vs-dark',
      });
    });
  });

  function changeComponent() {
    editor.setModel(models.get(currentID[0]));
  }

  function newComponent() {
    const id = uid();

    components = components.concat({
      id,
      name: `Component${components.length}`,
      type: 'svelte',
      source: '',
    });

    models.set(id, monaco.editor.createModel('', 'html'));

    currentID = [id];
  }

  function closeComponent({ detail }) {
    models.get(detail).dispose();
    models.delete(detail);
    const index = components.findIndex(({ id }) => id === detail);
    components.splice(index, 1);
    components = components;
    currentID = [components[index - 1].id];
  }

  function changeType({ detail }) {
    monaco.editor.setModelLanguage(models.get(detail.id), languages[detail.type]);
  }
</script>

<style>
  #editor {
    margin-top: 4px;
    width: 100%;
    height: 100%;
  }
</style>

<SlideGroup mandatory bind:value={currentID} on:change={changeComponent}>
  {#each components as { name, type, id }}
    <Tab on:close={closeComponent} on:changeType={changeType} {id} bind:name bind:type />
  {/each}
  <Button on:click={newComponent} class="align-self-center mt-1" size="small" fab text>
    <Icon path={mdiPlus} />
  </Button>
</SlideGroup>
<div id="editor" />
