import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink,
  Monitor,
} from 'lucide-react';

type Width = number | 'full';

export type ViewportPreset = Readonly<{
  id: 'mobile' | 'tablet' | 'laptop' | 'full';
  label: string;
  width: Width;
  Icon: typeof Smartphone;
}>;

export const DEFAULT_VIEWPORT_PRESETS: readonly ViewportPreset[] = [
  { id: 'mobile', label: 'SM', width: 390, Icon: Smartphone },
  { id: 'tablet', label: 'MD', width: 768, Icon: Tablet },
  { id: 'laptop', label: 'LG', width: 1024, Icon: Laptop },
  { id: 'full', label: 'Full', width: 'full', Icon: Monitor },
];

const MIN_WIDTH = 320;

function getSimFrameModifier(width: Width): string {
  if (width === 'full') {
    return '';
  }

  if (Math.round(width) === 390) {
    return ' component-example-tabs__sim-frame--mobile';
  }

  if (Math.round(width) === 768) {
    return ' component-example-tabs__sim-frame--tablet';
  }

  if (Math.round(width) === 1024) {
    return ' component-example-tabs__sim-frame--laptop';
  }

  return '';
}

type PreviewFrameProps = Readonly<{
  id: string;
  previewSrc: string;
  iframeHeight?: string;
  initialWidth?: Width;
  presets?: readonly ViewportPreset[];
  titlePrefix?: string;
}>;

export function PreviewFrame({
  id,
  previewSrc,
  iframeHeight = 'min(80vh, 800px)',
  initialWidth = 'full',
  presets = DEFAULT_VIEWPORT_PRESETS,
  titlePrefix = 'Preview',
}: PreviewFrameProps): JSX.Element {
  const [width, setWidth] = useState<Width>(initialWidth);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const node = containerRef.current;

    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const wrapper = iframeWrapperRef.current;
      const container = containerRef.current;

      if (!wrapper || !container) {
        return;
      }

      event.preventDefault();
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      const startX = event.clientX;
      const startWidth = wrapper.getBoundingClientRect().width;
      const maxWidth = container.getBoundingClientRect().width;

      setIsDragging(true);

      const handleMove = (moveEvent: PointerEvent) => {
        const next = Math.max(
          MIN_WIDTH,
          Math.min(maxWidth, startWidth + (moveEvent.clientX - startX)),
        );
        setWidth(next);
      };

      const handleUp = () => {
        setIsDragging(false);

        if (handle.hasPointerCapture(event.pointerId)) {
          handle.releasePointerCapture(event.pointerId);
        }

        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [],
  );

  const resolvedNumericWidth =
    width === 'full' ? containerWidth || null : Math.round(width);

  const widthLabel =
    width === 'full'
      ? resolvedNumericWidth
        ? `Full · ${resolvedNumericWidth}px`
        : 'Full'
      : `${Math.round(width)}px`;

  const wrapperStyle: CSSProperties = {
    width:
      width === 'full'
        ? '100%'
        : `${Math.min(width, containerWidth || width)}px`,
    maxWidth: '100%',
    transition: isDragging ? 'none' : 'width 0.18s ease',
  };

  const iframeStyle: CSSProperties = {
    width: '100%',
    height: iframeHeight,
    border: 0,
    background: 'var(--background, var(--vp-c-bg))',
    display: 'block',
    pointerEvents: isDragging ? 'none' : undefined,
  };

  const simFrameClass = `component-example-tabs__sim-frame${getSimFrameModifier(width)}`;

  return (
    <div className="flow-preview-frame">
      <div
        className="flow-preview-frame__toolbar"
        role="toolbar"
        aria-label="Preview viewport"
      >
        <div
          className="component-example-tabs__viewport-group"
          role="radiogroup"
          aria-label="Preview width"
        >
          {presets.map((preset) => {
            const isActive =
              (preset.width === 'full' && width === 'full') ||
              (typeof preset.width === 'number' &&
                typeof width === 'number' &&
                Math.round(width) === preset.width);

            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={
                  preset.width === 'full'
                    ? 'Full width preview'
                    : `Preview at ${preset.width}px`
                }
                className={`component-example-tabs__viewport-toggle${
                  isActive ? ' is-active' : ''
                }`}
                onClick={() => setWidth(preset.width)}
              >
                <preset.Icon aria-hidden size={12} />
                <span className="component-example-tabs__viewport-toggle-label">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
        <span className="flow-preview-frame__width-badge" aria-live="polite">
          {widthLabel}
        </span>
        <a
          href={previewSrc}
          target="_blank"
          rel="noreferrer"
          className="flow-preview-frame__open-link"
        >
          <ExternalLink aria-hidden size={12} />
          <span>Open</span>
        </a>
      </div>

      <div className="flow-preview-frame__breakout">
        <div
          ref={containerRef}
          className={`flow-preview-frame__stage${
            isDragging ? ' flow-preview-frame__stage--dragging' : ''
          }`}
        >
          <div
            ref={iframeWrapperRef}
            className={`flow-preview-frame__sizer ${simFrameClass}`}
            style={wrapperStyle}
          >
            <iframe
              src={previewSrc}
              title={`${titlePrefix}: ${id}`}
              data-rk-preview="true"
              data-rk-preview-id={id}
              loading="lazy"
              style={iframeStyle}
              aria-labelledby={titleId}
            />
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Drag to resize preview"
              className="flow-preview-frame__resize-handle"
              onPointerDown={handleResizePointerDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
