import { useEffect, useRef, useState } from 'react';
import ModuleSidebar from './ModuleSidebar.jsx';
import ModuleContent from './ModuleContent.jsx';
import { unitLabel } from '../data/courses.js';

/*
 * Course Material view: module navigation beside the reading panel.
 *
 * Opening a module marks it complete (see App.jsx) and moves focus to the
 * reading panel so keyboard and screen-reader users land on the new content
 * rather than staying in the module list.
 */

function useIsCompact(breakpoint = 1000) {
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = (event) => setIsCompact(event.matches);
    setIsCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);

  return isCompact;
}

export default function CourseMaterial({
  course,
  currentModuleId,
  completedModuleIds,
  onSelectModule,
}) {
  const isCompact = useIsCompact();
  const readerRef = useRef(null);
  const isFirstRender = useRef(true);
  const units = unitLabel(course);

  const moduleIndex = Math.max(
    0,
    course.modules.findIndex((module) => module.id === currentModuleId)
  );
  const module = course.modules[moduleIndex];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const node = readerRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [currentModuleId]);

  return (
    <div className="shell shell--wide view">
      <div className="material">
        <ModuleSidebar
          modules={course.modules}
          currentModuleId={module.id}
          completedModuleIds={completedModuleIds}
          onSelectModule={onSelectModule}
          isCompact={isCompact}
          units={units}
        />

        <div ref={readerRef} tabIndex={-1} style={{ outline: 'none', minWidth: 0 }}>
          <ModuleContent
            module={module}
            moduleIndex={moduleIndex}
            moduleCount={course.modules.length}
            units={units}
            onPrev={() => onSelectModule(course.modules[moduleIndex - 1]?.id)}
            onNext={() => onSelectModule(course.modules[moduleIndex + 1]?.id)}
          />
        </div>
      </div>
    </div>
  );
}
