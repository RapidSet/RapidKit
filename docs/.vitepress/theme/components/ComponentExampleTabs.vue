<template>
  <div class="component-example-tabs-host">
    <div ref="mountNode"></div>
  </div>
</template>

<script setup lang="ts">
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  ComponentExampleTabs,
  type ComponentExampleId,
} from './ComponentExampleTabs.react';

const props = defineProps<{
  component: ComponentExampleId;
}>();

const mountNode = ref<HTMLDivElement | null>(null);
let root: Root | null = null;

function renderTabs() {
  if (!root) {
    return;
  }

  root.render(
    React.createElement(ComponentExampleTabs, {
      component: props.component,
    }),
  );
}

onMounted(() => {
  if (!mountNode.value) {
    return;
  }

  root = createRoot(mountNode.value);
  renderTabs();
});

watch(
  () => props.component,
  () => {
    renderTabs();
  },
);

onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<style>
.component-example-tabs-host {
  margin-top: 1rem;
}

.component-example-tabs {
  border: 1px solid
    color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-divider));
  border-radius: 14px;
  overflow: visible;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--vp-c-brand-soft) 22%, var(--vp-c-bg-soft)) 0%,
    var(--vp-c-bg-soft) 100%
  );
  box-shadow: 0 12px 30px -26px
    color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
}

.component-example-tabs__controls {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, var(--vp-c-bg));
}

.component-example-tabs__button {
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 85%, transparent);
  background: transparent;
  color: var(--vp-c-text-2);
  padding: 0.38rem 0.82rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.18s ease;
}

.component-example-tabs__button:hover {
  color: var(--vp-c-text-1);
  border-color: color-mix(
    in srgb,
    var(--vp-c-brand-1) 24%,
    var(--vp-c-divider)
  );
  background: color-mix(in srgb, var(--vp-c-brand-soft) 52%, transparent);
}

.component-example-tabs__button.is-active {
  color: var(--vp-c-text-1);
  border-color: color-mix(
    in srgb,
    var(--vp-c-brand-1) 30%,
    var(--vp-c-divider)
  );
  background: color-mix(in srgb, var(--vp-c-brand-soft) 78%, transparent);
}

.component-example-tabs__panel {
  padding: 0.95rem;
  background: var(--vp-c-bg);
  overflow: visible;
}

.component-example-tabs__preview {
  border: 1px dashed
    color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
  border-radius: 12px;
  padding: 1.1rem;
  overflow: visible;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--vp-c-brand-soft) 55%, transparent),
      transparent 48%
    ),
    var(--vp-c-bg-soft);
}

.component-example-tabs__code-viewer {
  border: 1px solid
    color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-code-block-bg);
}

.component-example-tabs__code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: color-mix(
    in srgb,
    var(--vp-c-bg-soft) 88%,
    var(--vp-code-block-bg)
  );
  border-bottom: 1px solid var(--vp-c-divider);
}

.component-example-tabs__code-lang {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.component-example-tabs__copy-btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.35rem 0.62rem;
  transition: all 0.18s ease;
}

.component-example-tabs__copy-btn:hover {
  color: var(--vp-c-text-1);
  border-color: color-mix(
    in srgb,
    var(--vp-c-brand-1) 24%,
    var(--vp-c-divider)
  );
}

.component-example-tabs__code-scroll {
  max-height: 480px;
  overflow: auto;
}

.component-example-tabs__code-lines {
  margin: 0;
  padding: 0.85rem 0;
  list-style: decimal;
  list-style-position: outside;
  margin-left: 3.25rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--vp-c-text-1);
}

.component-example-tabs__code-lines li {
  padding: 0 0.95rem 0 0.45rem;
  white-space: pre;
}

.component-example-tabs__code-lines li::marker {
  color: var(--vp-c-text-3);
}

.component-example-tabs__code-lines code {
  color: inherit;
  background: transparent;
  font-size: inherit;
}

.component-example-tabs__token--keyword {
  color: color-mix(in srgb, var(--vp-c-brand-1) 72%, #64b5f6);
  font-weight: 600;
}

.component-example-tabs__token--string {
  color: #4caf50;
}

.component-example-tabs__token--comment {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.component-example-tabs__token--number {
  color: #ff8f00;
}

.dark .component-example-tabs__token--keyword {
  color: #7cc7ff;
}

.dark .component-example-tabs__token--string {
  color: #8ad67f;
}

.dark .component-example-tabs__token--number {
  color: #ffc166;
}

.component-example-tabs__preview > :deep(*) {
  max-width: 100%;
}

@media (max-width: 640px) {
  .component-example-tabs__panel {
    padding: 0.75rem;
  }

  .component-example-tabs__preview {
    padding: 0.8rem;
  }

  .component-example-tabs__code-lines {
    margin-left: 2.65rem;
    font-size: 0.86rem;
  }

  .component-example-tabs__code-lines li {
    padding-right: 0.7rem;
  }
}
</style>
