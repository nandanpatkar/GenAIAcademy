import { useId, useState } from 'react';
import Icon from './Icon.jsx';
import ProgressBar from './ProgressBar.jsx';

/*
 * Module navigation.
 *
 * Desktop: a sticky sidebar list. Mobile (<1000px): the same list collapsed
 * behind a disclosure button, so the reading panel gets the full width.
 * The CSS hides the toggle at desktop widths and the `hidden` attribute is
 * only applied below that breakpoint via the `isCompact` flag.
 */

export default function ModuleSidebar({
  modules,
  currentModuleId,
  completedModuleIds,
  onSelectModule,
  isCompact,
  units = { one: 'module', many: 'modules', Cap: 'Module' },
}) {
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const listId = useId();

  const total = modules.length;
  const done = completedModuleIds.size;
  const current = modules.find((module) => module.id === currentModuleId);
  const listHidden = isCompact && !openOnMobile;

  return (
    <nav className="card module-sidebar" aria-label={`Course ${units.many}`}>
      <div className="module-sidebar__head">
        <ProgressBar
          value={done}
          max={total}
          label={`${done} of ${total} ${units.many} read`}
          valueText={`${done} of ${total} ${units.many} read`}
        />
      </div>

      <button
        type="button"
        className="module-sidebar__toggle"
        aria-expanded={openOnMobile}
        aria-controls={listId}
        onClick={() => setOpenOnMobile((value) => !value)}
      >
        <span>
          <Icon name="list" /> {units.Cap} {current?.number}: {current?.shortTitle}
        </span>
        <Icon name="chevronDown" className="icon--chev" />
      </button>

      <ul className="module-sidebar__list" id={listId} hidden={listHidden}>
        {modules.map((module) => {
          const isCurrent = module.id === currentModuleId;
          const isDone = completedModuleIds.has(module.id);
          return (
            <li key={module.id}>
              <button
                type="button"
                className="module-sidebar__link"
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => {
                  onSelectModule(module.id);
                  setOpenOnMobile(false);
                }}
              >
                <span
                  className={`module-sidebar__state${isDone ? ' module-sidebar__state--done' : ''}`}
                >
                  <Icon
                    name={isDone ? 'checkCircle' : 'circle'}
                    title={isDone ? 'Read' : 'Not read yet'}
                  />
                </span>
                <span>
                  <span className="module-sidebar__label">
                    {module.number}. {module.shortTitle}
                  </span>
                  <span className="module-sidebar__hint">{module.duration}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
