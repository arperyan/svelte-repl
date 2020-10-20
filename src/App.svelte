<script>
  import { MaterialApp, AppBar, Button, Icon, Footer } from 'svelte-materialify/src';
  import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
  import Repl from './repl/Repl.svelte';

  let theme = 'light';

  function toggleTheme() {
    if (theme === 'light') theme = 'dark';
    else theme = 'light';
  }

  let components = [
    {
      id: 0,
      name: 'App',
      type: 'svelte',
      source: `lol lol`,
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

<MaterialApp {theme}>
  <AppBar dense>
    <span slot="title"> Svelte REPL </span>
    <div style="flex-grow:1" />
    <Button fab depressed on:click={toggleTheme}>
      <Icon path={theme === 'light' ? mdiWeatherNight : mdiWeatherSunny} />
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
