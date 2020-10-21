<script context="module">
  import { writable } from 'svelte/store';
  export const theme = writable('light');
</script>

<script>
  import { MaterialApp, AppBar, Button, Icon, Footer } from 'svelte-materialify/src';
  import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
  import Repl from './repl/Repl.svelte';

  function toggleTheme() {
    if ($theme === 'light') $theme = 'dark';
    else $theme = 'light';
  }

  let components = [
    {
      id: 0,
      name: 'App',
      type: 'svelte',
      source: `<script>
  let name = 'World';
<\/script>

<h1>Hello {name}</h1>`,
    },
  ];
</script>

<style>
  :global(.s-app) {
    height: 100vh;
  }

  .repl-container {
    height: calc(100% - 84px);
  }
</style>

<MaterialApp theme={$theme}>
  <AppBar dense>
    <span slot="title"> Svelte REPL </span>
    <div style="flex-grow:1" />
    <Button fab depressed on:click={toggleTheme}>
      <Icon path={$theme === 'light' ? mdiWeatherNight : mdiWeatherSunny} />
    </Button>
  </AppBar>
  <div class="repl-container">
    <Repl {components} />
  </div>
  <Footer class="justify-center">
    Made with ❤️ by
    <a href="https://thecomputerm.github.io/">TheComputerM</a>
  </Footer>
</MaterialApp>
