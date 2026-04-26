import { useState, type JSX } from 'react';
import {
  ComponentExampleTabs,
  type ComponentExampleId,
} from './ComponentExampleTabs';

type PropDoc = Readonly<{
  name: string;
  description: string;
}>;

type ComponentDoc = Readonly<{
  title: string;
  summary: string;
  highlights: readonly string[];
  importCode: string;
  keyProps: readonly PropDoc[];
  accessibility: string;
  guidance?: string;
  accessBehavior?: string;
}>;

type ComponentDocsPageProps = Readonly<{
  component: ComponentExampleId;
}>;

type CodeSnippetProps = Readonly<{
  code: string;
}>;

type CopyState = 'idle' | 'done' | 'error';

function getCopyLabel(copyState: CopyState): string {
  if (copyState === 'done') {
    return 'Copied';
  }

  if (copyState === 'error') {
    return 'Failed';
  }

  return 'Copy';
}

const COMPONENT_DOCS: Record<ComponentExampleId, ComponentDoc> = {
  autocomplete: {
    title: 'Autocomplete',
    summary:
      'Autocomplete helps people find the right record quickly with async search, optional pagination, and a controlled selected value.',
    highlights: ['Async search', 'Controlled selection', 'Custom option rows'],
    importCode: "import { Autocomplete } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Keeps the field identifiable in forms and change handlers.',
      },
      {
        name: 'value',
        description:
          'Controls the selected item id from your page or form state.',
      },
      {
        name: 'searchOptions',
        description:
          'Fetches matching items with query, page, and page size values.',
      },
      {
        name: 'onSelectOption',
        description:
          'Receives the chosen item or null when the field is cleared.',
      },
      {
        name: 'getOptionById',
        description:
          'Hydrates an existing value when you already know the selected id.',
      },
      {
        name: 'renderOption',
        description:
          'Lets you add richer labels, icons, or metadata to each result row.',
      },
    ],
    accessibility:
      'The field follows combobox patterns, keeps label text connected to the input, and supports keyboard navigation through the result list.',
    guidance:
      'This component stays API-agnostic. Keep your data fetching in your app layer and pass the async callbacks in as props.',
    accessBehavior:
      'If your app supplies access rules, Autocomplete can stay hidden when the field should not be visible or visible-but-disabled when it should be read only.',
  },
  avatar: {
    title: 'Avatar',
    summary:
      'Avatar displays profile imagery with graceful fallback text, predictable sizing, and optional visibility access checks.',
    highlights: [
      'Image and fallback',
      'Size variants',
      'Access-aware visibility',
    ],
    importCode: "import { Avatar } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'src',
        description: 'Supplies the avatar image URL when media is available.',
      },
      {
        name: 'alt',
        description:
          'Provides descriptive text and initials source for fallback rendering.',
      },
      {
        name: 'fallback',
        description: 'Overrides derived initials with custom fallback content.',
      },
      {
        name: 'size',
        description:
          'Applies sm, md, or lg dimensions with token-friendly utility classes.',
      },
      {
        name: 'imageClassName and fallbackClassName',
        description:
          'Lets consumers style image and fallback surfaces independently.',
      },
      {
        name: 'accessRequirements and resolveAccess',
        description:
          'Keeps visibility injectable through host-defined access rules.',
      },
    ],
    accessibility:
      'Alt text is forwarded to the underlying avatar image, and fallback content ensures a visible representation when image media is unavailable.',
    accessBehavior:
      'When access rules are provided, Avatar returns null only when view access is denied; write-only requirements keep it visible by convention.',
  },
  'base-modal': {
    title: 'BaseModal',
    summary:
      'BaseModal gives you a reusable dialog shell for confirmation flows, editors, and detail views without tying the content to a specific workflow.',
    highlights: [
      'Composable body',
      'Save and cancel actions',
      'Custom footer buttons',
    ],
    importCode:
      "import { BaseModal, ButtonVariant } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'isOpen',
        description: 'Controls whether the dialog is currently shown.',
      },
      {
        name: 'onClose',
        description:
          'Closes the dialog from escape, overlay, or button actions.',
      },
      {
        name: 'title and description',
        description:
          'Adds a clear heading and supporting context for the dialog content.',
      },
      {
        name: 'onSave and onCancel',
        description: 'Wires the default footer actions without custom markup.',
      },
      {
        name: 'customButtons',
        description:
          'Adds extra footer actions when your flow needs more than save and cancel.',
      },
      {
        name: 'preventOutsideClose',
        description:
          'Keeps the dialog open when the surrounding workflow should not be dismissed accidentally.',
      },
    ],
    accessibility:
      'The dialog uses accessible modal primitives for focus trapping, escape handling, and announced title and description content.',
    accessBehavior:
      'Optional access props let you hide the dialog entirely or gate save and custom actions without moving that logic into the modal itself.',
  },
  'base-table': {
    title: 'BaseTable',
    summary:
      'BaseTable is a flexible data grid for operational lists, admin screens, and reporting views with sorting, pagination hooks, and row-level actions.',
    highlights: [
      'Typed columns',
      'Sorting and selection',
      'Server-friendly pagination',
    ],
    importCode: "import { BaseTable } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'data',
        description: 'Supplies the current page of rows to render.',
      },
      {
        name: 'columns',
        description:
          'Defines what each column shows and how each cell should behave.',
      },
      {
        name: 'queryParams',
        description:
          'Keeps search and pagination state in sync with your page.',
      },
      {
        name: 'onQueryParamsChange',
        description:
          'Receives search and paging updates whenever the user changes the table state.',
      },
      {
        name: 'sortBy and sortOrder',
        description: 'Lets your page own the current sorting state.',
      },
      {
        name: 'enableSelection',
        description:
          'Turns on row selection for bulk actions and review flows.',
      },
    ],
    accessibility:
      'Table selection controls include accessible labels, and the underlying table semantics stay intact for screen readers and keyboard users.',
    guidance:
      'Use this component as a presentational shell around your data source. Fetching, filters, and persistence stay in your host application.',
    accessBehavior:
      'Optional access props let you hide the table or lock editing interactions while keeping the surrounding page logic simple.',
  },
  button: {
    title: 'Button',
    summary:
      'Button covers primary actions, secondary actions, and busy states with a small API that still leaves room for icons and access-aware behavior.',
    highlights: [
      'Primary and secondary actions',
      'Loading feedback',
      'Optional icons',
    ],
    importCode: "import { Button, ButtonVariant } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'label or children',
        description:
          'Sets the button text using whichever pattern fits your codebase.',
      },
      {
        name: 'variant',
        description:
          'Switches between visual emphasis levels such as primary and outlined.',
      },
      {
        name: 'leftIcon and rightIcon',
        description:
          'Adds directional or status icons without custom layout work.',
      },
      {
        name: 'loading',
        description: 'Shows a busy state while an action is in progress.',
      },
      {
        name: 'disabled',
        description: 'Prevents interaction when the action is not available.',
      },
      {
        name: 'accessDeniedBehavior',
        description:
          'Chooses whether gated actions stay visible but disabled or stay hidden.',
      },
    ],
    accessibility:
      'Button renders a native button element, so keyboard activation, focus handling, and standard ARIA attributes work as expected.',
    accessBehavior:
      'If you provide access rules, Button can either stay disabled or disappear based on the experience you want for unavailable actions.',
  },
  checkbox: {
    title: 'Checkbox',
    summary:
      'Checkbox handles simple binary choices with optional labels, helper copy, and validation messaging that fits naturally into forms.',
    highlights: [
      'Form friendly',
      'Helper and error text',
      'Controlled or uncontrolled',
    ],
    importCode: "import { Checkbox } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Identifies the checkbox in change handlers and form payloads.',
      },
      {
        name: 'checked',
        description:
          'Keeps the current state controlled from your form or page state.',
      },
      {
        name: 'onCheckChange',
        description: 'Receives the new boolean value with the field name.',
      },
      {
        name: 'label and title',
        description:
          'Adds visible copy for the checkbox and supporting context when needed.',
      },
      {
        name: 'helperText and error',
        description:
          'Explains expected input and shows validation feedback below the field.',
      },
    ],
    accessibility:
      'Checkbox keeps native checkbox semantics and connects label text to the input so users can click or tap the visible copy.',
    accessBehavior:
      'Optional access props let the field stay hidden or read only without coupling the component to any specific authorization system.',
  },
  chip: {
    title: 'Chip',
    summary:
      'Chip is a compact surface for status, filters, and selected values, with optional icons, pulse feedback, and removable behavior.',
    highlights: ['Status labels', 'Filter tokens', 'Optional remove action'],
    importCode: "import { Chip } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'label',
        description: 'Shows the text users should see at a glance.',
      },
      {
        name: 'variant',
        description:
          'Adjusts the visual tone for emphasis or subtle secondary labels.',
      },
      {
        name: 'size',
        description:
          'Scales the chip for dense tables, forms, or detail views.',
      },
      {
        name: 'icon',
        description: 'Adds quick visual context for statuses and categories.',
      },
      {
        name: 'pulse',
        description: 'Draws attention to a live or changing state.',
      },
      {
        name: 'onRemove',
        description:
          'Turns the chip into a removable token for selected items and filters.',
      },
    ],
    accessibility:
      'When the remove action is enabled, the chip exposes a descriptive button label so screen-reader users know which token will be removed.',
    accessBehavior:
      'Optional access rules let the chip stay hidden or keep its action disabled without introducing product-specific logic into the component.',
  },
  'date-picker': {
    title: 'DatePicker',
    summary:
      'DatePicker gives you a calendar-driven date field with controlled value updates, helper text, and optional range boundaries.',
    highlights: [
      'Calendar selection',
      'Controlled value',
      'Optional month bounds',
    ],
    importCode: "import { DatePicker } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Keeps the field identifiable in form-level change handling.',
      },
      {
        name: 'value',
        description: 'Controls the selected date from your page or form state.',
      },
      {
        name: 'onChange',
        description:
          'Receives the updated field name and value when a date is picked.',
      },
      {
        name: 'label, helperText, and error',
        description:
          'Adds the copy users need before and after they make a selection.',
      },
      {
        name: 'startMonth and endMonth',
        description:
          'Limits the visible calendar range when your flow only allows a specific window.',
      },
      {
        name: 'open and onOpenChange',
        description: 'Lets parent state fully control the popover when needed.',
      },
    ],
    accessibility:
      'The trigger and calendar use keyboard-friendly popover behavior, and validation state is surfaced with the expected invalid field messaging.',
    accessBehavior:
      'Optional access props let the field stay hidden when unavailable or visible but disabled when it should be read only.',
  },
  'details-card': {
    title: 'DetailsCard',
    summary:
      'DetailsCard organizes record-level content into a reusable detail surface with a strong header, tabbed sections, and action slots.',
    highlights: ['Record detail layouts', 'Tabbed content', 'Header actions'],
    importCode:
      "import { ButtonVariant, DetailsCard } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'title and icon',
        description:
          'Sets the identity of the record or view at the top of the card.',
      },
      {
        name: 'isLoading',
        description:
          'Shows a loading state while the backing record is still being fetched.',
      },
      {
        name: 'tabs',
        description: 'Breaks larger detail views into focused sections.',
      },
      {
        name: 'renderCustomContent',
        description:
          'Lets you swap in a fully custom body when tabs are not the right fit.',
      },
      {
        name: 'onSave, onDelete, and onClose',
        description:
          'Wires the common record-level actions in the card header.',
      },
      {
        name: 'customButtons',
        description: 'Adds extra actions without rebuilding the header layout.',
      },
    ],
    accessibility:
      'The tabbed layout follows expected tablist semantics, and loading content is announced in a polite live region.',
    accessBehavior:
      'Header actions inherit the same optional access-aware behavior used elsewhere in the kit, so you can gate actions without custom wrappers.',
  },
  'drop-down': {
    title: 'DropDown',
    summary:
      'DropDown is a select-style field for curated choices, with labels, validation states, and optional custom rendering for richer options.',
    highlights: [
      'Single selection',
      'Form labels and errors',
      'Custom option rendering',
    ],
    importCode: "import { DropDown } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'options',
        description: 'Supplies the available label and value pairs.',
      },
      {
        name: 'value',
        description: 'Controls the currently selected option.',
      },
      {
        name: 'onChange',
        description: 'Receives the next selected value.',
      },
      {
        name: 'label and placeholder',
        description:
          'Gives the field a visible title and a helpful empty state.',
      },
      {
        name: 'renderOption',
        description:
          'Lets you add icons or supporting text inside the option list.',
      },
      {
        name: 'helperText and error',
        description:
          'Explains the field and surfaces validation feedback clearly.',
      },
    ],
    accessibility:
      'The trigger announces invalid state when needed and keeps the field label and required marker visible to all users.',
    accessBehavior:
      'Optional access rules let the control stay hidden or visible-but-disabled based on what the current user is allowed to do.',
  },
  icon: {
    title: 'Icon',
    summary:
      'Icon is a thin typed wrapper around Lucide icons so consumers can keep package imports consistent without losing SVG flexibility.',
    highlights: ['Typed icon prop', 'Lucide friendly', 'Forwards SVG props'],
    importCode: "import { Icon } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'icon',
        description: 'Passes the Lucide icon component you want to render.',
      },
      {
        name: 'className',
        description:
          'Styles the icon with the same utility classes you already use elsewhere.',
      },
      {
        name: 'size and strokeWidth',
        description:
          'Fine-tunes icon scale and line weight through standard SVG props.',
      },
      {
        name: 'aria-* props',
        description:
          'Adds labels or hides decorative icons based on the job the icon is doing.',
      },
    ],
    accessibility:
      'Accessibility is fully consumer-controlled: label meaningful icons and hide decorative ones with the standard SVG ARIA attributes.',
  },
  image: {
    title: 'Image',
    summary:
      'Image renders avatars and small media with consistent sizing and a reliable fallback when the source is missing or fails.',
    highlights: [
      'Avatar-friendly sizes',
      'Graceful fallback',
      'Native image props',
    ],
    importCode: "import { Image } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'src',
        description: 'Supplies the image URL when media is available.',
      },
      {
        name: 'alt',
        description:
          'Provides the user-facing description required for non-decorative images.',
      },
      {
        name: 'size',
        description: 'Applies a consistent small, medium, or large footprint.',
      },
      {
        name: 'loading',
        description:
          'Keeps lazy loading enabled when media should wait until it nears the viewport.',
      },
      {
        name: 'srcSet',
        description:
          'Supports responsive images when you have multiple asset sizes available.',
      },
    ],
    accessibility:
      'The component forwards alt text to the native image element so the same accessibility expectations apply as with any standard img tag.',
    accessBehavior:
      'Optional access rules let images stay hidden when the current user should not see them, while keeping the component itself presentational.',
  },
  logo: {
    title: 'Logo',
    summary:
      'Logo renders your brand lockup and icon states with simple props for collapsed navigation and size variants.',
    highlights: ['Brand lockup', 'Collapsed icon state', 'Size variants'],
    importCode: "import { Logo } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'open',
        description:
          'When false, the component switches to icon mode for collapsed sidebar layouts.',
      },
      {
        name: 'showIcon and showText',
        description:
          'Controls whether the icon, full lockup, or icon-only state should render.',
      },
      {
        name: 'size',
        description:
          'Applies small, medium, or large sizing presets for common layout contexts.',
      },
      {
        name: 'logoSrc and iconSrc',
        description:
          'Lets consumers provide app-specific logo and icon assets while keeping the component reusable.',
      },
      {
        name: 'alt and testId',
        description:
          'Sets image accessibility text and deterministic selectors for tests.',
      },
    ],
    accessibility:
      'The underlying image forwards alt text so assistive technology can announce the brand asset meaningfully.',
    guidance:
      'Use brand assets from your public app path and keep this component presentational by handling brand selection outside the component.',
  },
  'nav-menu': {
    title: 'NavMenu',
    summary:
      'NavMenu wraps shadcn Navigation Menu into a package-friendly grouped navigation API with optional descriptions and custom item rendering.',
    highlights: [
      'Grouped nav sections',
      'Optional item descriptions',
      'External links',
    ],
    importCode: "import { NavMenu } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'sections',
        description:
          'Defines top-level menu triggers and the list of links shown in each section.',
      },
      {
        name: 'renderItem',
        description:
          'Lets you replace the default item text block with custom content for each link.',
      },
      {
        name: 'linkClassName and descriptionClassName',
        description:
          'Styles item containers and description text while keeping menu behavior unchanged.',
      },
      {
        name: 'value and onValueChange',
        description:
          'Allows controlled menu state when the host app needs to manage open sections.',
      },
      {
        name: 'ariaLabel',
        description:
          'Sets a descriptive label for the menu root for assistive technologies.',
      },
    ],
    accessibility:
      'The component is built on Radix Navigation Menu semantics and keeps disabled items non-interactive with aria-disabled markers.',
    guidance:
      'Keep routing logic in the host app by passing href values only; this component stays presentational and router-agnostic.',
  },
  input: {
    title: 'Input',
    summary:
      'Input is a controlled text field for forms and search-like entry points, with labels, validation feedback, and optional access-aware behavior.',
    highlights: [
      'Controlled text input',
      'Labels and validation',
      'Works with form state',
    ],
    importCode: "import { Input } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Keeps the field addressable in change handlers and form payloads.',
      },
      {
        name: 'value',
        description: 'Controls the current text from parent state.',
      },
      {
        name: 'onChange',
        description:
          'Receives the native input event whenever the value changes.',
      },
      {
        name: 'type',
        description:
          'Adjusts the field for email, password, number, and other native input modes.',
      },
      {
        name: 'label, helperText, and error',
        description:
          'Adds the right amount of field guidance before and after input.',
      },
      {
        name: 'disabled',
        description: 'Keeps the field visible while preventing editing.',
      },
    ],
    accessibility:
      'Input connects labels and error state to the field so assistive technology can announce context and validation feedback clearly.',
    accessBehavior:
      'Optional access rules let the field stay hidden or visible-but-disabled without forcing an app-specific authorization dependency into the component.',
  },
  page: {
    title: 'Page',
    summary:
      'Page is a layout shell for list and dashboard screens, giving you a predictable header area for search, filters, and primary actions.',
    highlights: [
      'Page-level layout',
      'Header actions',
      'Search and filter slot',
    ],
    importCode: "import { ButtonVariant, Page } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'children',
        description: 'Renders the main page content inside the layout shell.',
      },
      {
        name: 'actions',
        description:
          'Adds primary page actions such as create, export, or sync.',
      },
      {
        name: 'enableSearch and onSearch',
        description:
          'Turns on a search field and receives query updates from the header.',
      },
      {
        name: 'filterSlot',
        description:
          'Lets you place chips, filters, or summaries next to the search field.',
      },
      {
        name: 'searchPlaceholder',
        description:
          'Tailors the header copy to the page content being searched.',
      },
    ],
    accessibility:
      'Page composes the kit search and button components, so keyboard behavior and standard button semantics remain intact.',
    guidance:
      'Use Page as a layout primitive, not as a state container. Search logic, filters, and action handlers should stay in your screen code.',
  },
  search: {
    title: 'Search',
    summary:
      'Search is a compact text field with a leading icon and a string-based change callback for toolbars, headers, and inline filtering.',
    highlights: [
      'Toolbar friendly',
      'String callback',
      'Decorative icon included',
    ],
    importCode: "import { Search } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'placeholder',
        description: 'Sets the hint text users see before they type.',
      },
      {
        name: 'value',
        description:
          'Controls the current search text when parent state owns the input.',
      },
      {
        name: 'onChange',
        description:
          'Receives the next string value directly, without native event plumbing.',
      },
      {
        name: 'onKeyDown',
        description:
          'Hooks into key handling when the surrounding screen needs shortcuts or command behavior.',
      },
      {
        name: 'ariaLabel',
        description:
          'Adds a clearer accessible name when the placeholder alone is not enough.',
      },
    ],
    accessibility:
      'Search uses a native input, keeps the icon decorative, and supports a custom accessible label when the default placeholder is not descriptive enough.',
    guidance:
      'The component returns a plain string on change so you can connect it quickly to client-side filters or debounced server queries.',
  },
  'side-bar': {
    title: 'SideBar',
    summary:
      'SideBar composes shadcn sidebar primitives into a package-safe navigation shell with injectable access checks and customizable child sections.',
    highlights: [
      'Composable layout slots',
      'Nested menu support',
      'Optional access-aware rendering',
    ],
    importCode: "import { SideBar } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'menuItems',
        description:
          'Provides top-level and nested navigation items while keeping routing behavior owned by the host app.',
      },
      {
        name: 'user and userActions',
        description:
          'Configures the footer identity surface and action menu in a domain-neutral shape.',
      },
      {
        name: 'accessRequirements and resolveAccess',
        description:
          'Injects optional view/edit checks so access control can be enforced without app-specific imports.',
      },
      {
        name: 'brandSlot, navSlot, footerSlot',
        description:
          'Lets consumers replace default sections with custom wrappers while preserving the base sidebar shell.',
      },
      {
        name: 'children',
        description:
          'Overrides the default composed sections entirely when full custom sidebar content is needed.',
      },
    ],
    accessibility:
      'The component builds on accessible sidebar/menu primitives and keeps keyboard-friendly interactive controls for menu and user actions.',
    guidance:
      'Keep permission resolution and route handling in your app layer. Pass plain navigation metadata and callbacks into SideBar props.',
    accessBehavior:
      'When view access is denied the sidebar returns null. When view is allowed but edit is denied, interactive menu and user actions are rendered as read-only.',
  },
  text: {
    title: 'Text',
    summary:
      'Text is a lightweight typography primitive for rendering copy with semantic HTML tags, package-owned token colors, and optional access gating.',
    highlights: [
      'Semantic tag selection',
      'Tone and weight controls',
      'Optional view access rules',
    ],
    importCode: "import { Text } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'children',
        description:
          'Provides the copy or inline content to render with consistent typography tokens.',
      },
      {
        name: 'as',
        description:
          'Chooses the semantic element such as span, paragraph, strong, or small text.',
      },
      {
        name: 'tone and weight',
        description:
          'Applies semantic foreground colors and font emphasis without ad-hoc class names.',
      },
      {
        name: 'truncate',
        description:
          'Trims overflowing single-line copy while preserving full text in DOM output.',
      },
      {
        name: 'accessRequirements and resolveAccess',
        description:
          'Optionally hides content when view access is denied by your host authorization rules.',
      },
    ],
    accessibility:
      'Text preserves native semantics through the chosen HTML tag and remains non-interactive by default, which keeps document structure and assistive reading behavior predictable.',
    accessBehavior:
      'When access rules are provided, Text renders null if view access is denied; without rules or resolver it remains visible.',
  },
  'text-area': {
    title: 'TextArea',
    summary:
      'TextArea is a controlled multi-line input for notes, descriptions, and longer freeform content with optional access-aware behavior.',
    highlights: [
      'Multi-line input',
      'Helper and error text',
      'Access-aware visibility/editing',
    ],
    importCode: "import { TextArea } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Identifies the field for change handlers and form submission mapping.',
      },
      {
        name: 'value',
        description:
          'Controls the text area value when parent state owns the field.',
      },
      {
        name: 'onChange',
        description:
          'Receives the native textarea change event to support standard form workflows.',
      },
      {
        name: 'label, helperText, and error',
        description:
          'Provides clear guidance and validation messaging around longer text input.',
      },
      {
        name: 'rows and placeholder',
        description:
          'Controls visible height and hint copy for better writing ergonomics.',
      },
    ],
    accessibility:
      'TextArea connects labels and invalid state to a native textarea so assistive technology can announce context and validation feedback clearly.',
    accessBehavior:
      'Optional access rules let TextArea stay hidden when view is denied or visible-but-disabled when edit is denied, with no host-app coupling.',
  },
  toggle: {
    title: 'Toggle',
    summary:
      'Toggle provides an accessible on/off switch with optional labels, helper text, and validation messaging for settings and preference screens.',
    highlights: [
      'Switch semantics',
      'Controlled or uncontrolled',
      'Access-aware visibility/editing',
    ],
    importCode: "import { Toggle } from '@rapidset/rapidkit';",
    keyProps: [
      {
        name: 'name',
        description:
          'Identifies the toggle in handlers and form submissions when used inside forms.',
      },
      {
        name: 'checked and defaultChecked',
        description:
          'Support both controlled state and initial uncontrolled state for flexible integration.',
      },
      {
        name: 'onCheckedChange and onToggleChange',
        description:
          'Receives value updates as a boolean, with optional field name payload for form coordination.',
      },
      {
        name: 'label, title, helperText, and error',
        description:
          'Provides context, guidance, and validation feedback around the switch control.',
      },
      {
        name: 'accessRequirements and resolveAccess',
        description:
          'Injects host access checks without coupling the component to app-specific authorization models.',
      },
    ],
    accessibility:
      'Toggle uses accessible switch primitives and connects visible label text to the control using id/htmlFor for stronger screen reader context.',
    accessBehavior:
      'Optional access rules let Toggle render null when view access is denied or remain visible but disabled when edit access is denied.',
  },
};

function ComponentDocsSections({
  accessibility,
  guidance,
  accessBehavior,
}: Pick<
  ComponentDoc,
  'accessibility' | 'guidance' | 'accessBehavior'
>): JSX.Element {
  return (
    <div className="component-doc-note-grid">
      <section className="component-doc-note-card">
        <h2>Accessibility</h2>
        <p>{accessibility}</p>
      </section>

      {guidance ? (
        <section className="component-doc-note-card">
          <h2>Integration notes</h2>
          <p>{guidance}</p>
        </section>
      ) : null}

      {accessBehavior ? (
        <section className="component-doc-note-card">
          <h2>Optional access rules</h2>
          <p>{accessBehavior}</p>
        </section>
      ) : null}
    </div>
  );
}

function CodeSnippet({ code }: CodeSnippetProps): JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  async function copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('done');
    } catch {
      setCopyState('error');
    }

    setTimeout(() => {
      setCopyState('idle');
    }, 1500);
  }

  return (
    <div className="component-doc-code-snippet component-example-tabs__code-viewer">
      <button
        type="button"
        className="component-example-tabs__copy-btn"
        onClick={copyCode}
        aria-label="Copy code snippet"
      >
        {getCopyLabel(copyState)}
      </button>

      <div className="component-example-tabs__code-scroll">
        <pre className="component-doc-code-block">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function ComponentDocsPage({
  component,
}: ComponentDocsPageProps): JSX.Element {
  const doc = COMPONENT_DOCS[component];
  const installCode = 'pnpm add @rapidset/rapidkit';

  if (!doc) {
    return (
      <article className="component-doc-page">
        <header className="component-doc-hero">
          <p className="component-doc-hero__eyebrow">UI component</p>
          <h1>Documentation unavailable</h1>
          <p className="component-doc-hero__summary">
            No documentation metadata was found for this component.
          </p>
        </header>
      </article>
    );
  }

  return (
    <article className="component-doc-page">
      <header className="component-doc-hero">
        <p className="component-doc-hero__eyebrow">UI component</p>
        <h1>{doc.title}</h1>
        <p className="component-doc-hero__summary">{doc.summary}</p>
      </header>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>Installation</h2>
          <p>Install the package in your app.</p>
        </div>

        <CodeSnippet code={installCode} />
      </section>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>Usage</h2>
          <p>Import components from the package entrypoint.</p>
        </div>

        <CodeSnippet code={doc.importCode} />
      </section>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>Examples</h2>
          <p>Preview the component and copy the snippet.</p>
        </div>

        <ComponentExampleTabs component={component} />
      </section>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>API Reference</h2>
          <p>Commonly used props at a glance.</p>
        </div>

        <div className="component-doc-api-table-wrap">
          <table className="component-doc-api-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {doc.keyProps.map((prop) => (
                <tr key={prop.name}>
                  <td>{prop.name}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ComponentDocsSections
        accessibility={doc.accessibility}
        guidance={doc.guidance}
        accessBehavior={doc.accessBehavior}
      />
    </article>
  );
}

export function ComponentDocsIndexPage(): JSX.Element {
  return (
    <article className="component-doc-page">
      <header className="component-doc-hero">
        <p className="component-doc-hero__eyebrow">Component library</p>
        <h1>Components</h1>
        <p className="component-doc-hero__summary">
          Browse reusable building blocks for forms, tables, overlays, page
          layouts, and supporting UI. Each page focuses on real usage, the most
          important props, and what end users can expect from the component.
        </p>
      </header>

      <section className="component-doc-section">
        <div className="component-doc-section__header">
          <h2>Overview</h2>
          <p>
            RapidKit is designed as a reusable UI kit for application teams that
            want consistent building blocks without inheriting product-specific
            workflows or styling constraints.
          </p>
        </div>

        <div className="component-doc-note-grid">
          <section className="component-doc-note-card">
            <h2>What the library emphasizes</h2>
            <p>
              The component set focuses on forms, tables, layout shells, and
              lightweight supporting UI that can be composed into admin,
              dashboard, and workflow-heavy applications.
            </p>
          </section>

          <section className="component-doc-note-card">
            <h2>How to use the docs</h2>
            <p>
              Individual component pages are the reference point for real usage.
              Each page keeps the import path, live preview, minimal example,
              key props, and accessibility expectations close together.
            </p>
          </section>
        </div>
      </section>

      <div className="component-doc-note-grid">
        <section className="component-doc-note-card">
          <h2>What these pages cover</h2>
          <p>
            The docs focus on consumer-facing usage: import paths, the props
            that matter most in day-to-day integration, accessibility
            expectations, and optional access-aware behavior where a component
            supports it.
          </p>
        </section>

        <section className="component-doc-note-card">
          <h2>Theming</h2>
          <p>
            All components are designed to work with package-owned tokens and
            the shipped theme files. Start with the default theme, then swap
            theme CSS files without rewriting component APIs.
          </p>
        </section>
      </div>
    </article>
  );
}
