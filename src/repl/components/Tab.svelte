<script context="module">
  import svelteIcon from '@iconify-icons/logos/svelte-icon';
  import jsIcon from '@iconify-icons/logos/javascript';
  import { mdiClose } from '@mdi/js';

  const icons = {
    svelte: svelteIcon,
    js: jsIcon,
  };
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { SlideItem } from 'svelte-materialify/src';

  export let id;
  export let name;
  export let type;

  const dispatch = createEventDispatcher();
  const closable = name !== 'App';

  $: icon = icons[type];

  let editable = false;
  function edit() {
    if (closable) editable = true;
  }

  function keydown({ keyCode, target }) {
    if (keyCode === 13) {
      editable = false;
      const text = target.innerText;
      const separatorIndex = text.lastIndexOf('.');
      name = text.substring(0, separatorIndex);
      const newType = text.substring(separatorIndex + 1);
      if (type !== newType) {
        type = newType;
        dispatch('changeType', { id, type});
      }
    }
  }

  function close() {
    dispatch('close', id);
  }
</script>

<style>
  span {
    text-transform: none;
    user-select: none;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    font-weight: 500;
    position: relative;
    border-bottom: 1px solid transparent;
    cursor: pointer;
  }

  .active {
    border-bottom: 1px solid #6200ee;
  }

  .close {
    opacity: 0.8;
  }

  .close:hover {
    opacity: 1;
  }
</style>

<SlideItem value={id} let:active>
  <div class:active>
    <svg class="mr-2 ml-n1" height="18" viewBox="0 0 {icon.width} {icon.height}">
      {@html icon.body}
    </svg>
    <span contenteditable={editable} on:dblclick={edit} on:keydown={keydown}>
      {name}.{type}
    </span>
    {#if closable}
      <svg class="ml-1 mr-n1 close" on:click={close} width="18" viewBox="0 0 24 24">
        <path d={mdiClose} />
      </svg>
    {/if}
  </div>
</SlideItem>
