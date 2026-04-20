<template>
  <div
    class="mz-docs-theme-selector"
    :class="{ 'mz-docs-theme-selector--mobile': mobile }"
  >
    <label class="mz-docs-theme-selector__label">
      <span>Theme</span>
      <select
        class="mz-docs-theme-selector__select"
        :value="theme"
        aria-label="Select docs theme"
        @change="handleChange"
      >
        <option
          v-for="option in THEME_OPTIONS"
          :key="option.id"
          :value="option.id"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
  THEME_CHANGE_EVENT,
  THEME_OPTIONS,
  type BuiltInThemeId,
  initializeDocsTheme,
  setDocsTheme,
} from './docsTheme';

defineProps<{
  mobile?: boolean;
}>();

const theme = ref<BuiltInThemeId>('default');

const handleThemeChange = (event: Event) => {
  theme.value = (event as CustomEvent<BuiltInThemeId>).detail;
};

const handleChange = (event: Event) => {
  const nextTheme = (event.target as HTMLSelectElement).value as BuiltInThemeId;
  setDocsTheme(nextTheme);
};

onMounted(() => {
  theme.value = initializeDocsTheme();
  globalThis.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
});
</script>

<style scoped>
.mz-docs-theme-selector {
  display: none;
}

@media (min-width: 960px) {
  .mz-docs-theme-selector {
    display: flex;
    align-items: center;
    margin-left: 6px;
  }

  .mz-docs-theme-selector--mobile {
    display: none;
  }
}

.mz-docs-theme-selector--mobile {
  display: block;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.mz-docs-theme-selector__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  line-height: 24px;
}

.mz-docs-theme-selector--mobile .mz-docs-theme-selector__label {
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
}

.mz-docs-theme-selector__select {
  min-width: 108px;
  height: 28px;
  padding: 0 24px 0 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.mz-docs-theme-selector__select:hover {
  border-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.mz-docs-theme-selector__select:focus {
  outline: none;
  border-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.mz-docs-theme-selector--mobile .mz-docs-theme-selector__select {
  min-width: 148px;
}
</style>
