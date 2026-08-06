/*
 * Accessible progress indicator.
 *
 * The visible bar is decorative; the semantics live on a role="progressbar"
 * element carrying aria-valuenow/min/max and an aria-valuetext that reads as a
 * sentence rather than a bare number.
 */

export default function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  showHeader = true,
  tone = 'primary',
}) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);

  return (
    <div className="progress">
      {showHeader && label ? (
        <div className="progress__head">
          <span>{label}</span>
          <span className="progress__value">{percent}%</span>
        </div>
      ) : null}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={valueText ?? `${percent} percent complete`}
        aria-label={showHeader && label ? undefined : label}
      >
        <div
          className={`progress__fill${tone === 'success' ? ' progress__fill--success' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
