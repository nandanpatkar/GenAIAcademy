import React from 'react';
import { Book, Home, LayoutTemplate, Plug, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OpenFlowLogo } from '../icons/OpenFlowLogo';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItem } from '../ui/SidebarItem';
import { APP_NAME } from '@/lib/brand';

type HomeSidebarTab = 'home' | 'templates' | 'settings' | 'mcp';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  tab?: HomeSidebarTab;
  testId: string;
  to?: string;
}

interface HomeSidebarProps {
  activeTab: HomeSidebarTab;
  onTabChange: (tab: HomeSidebarTab) => void;
}

export function HomeSidebar({
  activeTab,
  onTabChange,
}: HomeSidebarProps): React.ReactElement {
  const { t } = useTranslation();
  const localizedAppName = t('home.appName', APP_NAME);
  const navigationItems: NavigationItem[] = [
    {
      icon: <Home className="w-4 h-4" />,
      label: t('nav.home', 'Home'),
      tab: 'home',
      testId: 'sidebar-home',
    },
    {
      icon: <LayoutTemplate className="w-4 h-4" />,
      label: t('nav.templates', 'Templates'),
      tab: 'templates',
      testId: 'sidebar-templates',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t('nav.settings', 'Settings'),
      tab: 'settings',
      testId: 'sidebar-settings',
    },
  ];

  return (
    <aside className="flow-glass sticky top-0 z-20 flex w-full flex-col border-b-0 md:fixed md:inset-y-4 md:left-4 md:w-60 md:rounded-[26px] md:border md:border-[var(--brand-glass-border)]">
      <div className="flex h-16 items-center gap-3 border-b border-[var(--color-brand-border)]/60 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--brand-primary)] shadow-[0_8px_18px_rgba(255,153,0,0.28)]">
          <OpenFlowLogo className="h-7 w-7" />
        </div>

        <span className="truncate text-base font-semibold tracking-tight text-[var(--brand-text)]">
          {localizedAppName}
        </span>

        <div className="flex items-center justify-center rounded-[5px] border border-[color-mix(in_srgb,var(--color-brand-border),transparent_20%)] bg-[color-mix(in_srgb,var(--brand-surface),transparent_50%)] px-[5px] py-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
          <span className="text-[9.5px] font-mono font-bold uppercase leading-none tracking-[0.02em] text-[color-mix(in_srgb,var(--brand-secondary),var(--brand-text))]">
            v1.0
          </span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 md:block md:flex-1 md:space-y-5 md:overflow-y-auto md:p-4">
        <div className="flex gap-2 md:block md:space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.testId}
              icon={item.icon}
              isActive={item.tab ? activeTab === item.tab : false}
              onClick={item.tab ? () => onTabChange(item.tab) : undefined}
              to={item.to}
              testId={item.testId}
              className="min-w-fit md:min-w-0"
            >
              {item.label}
            </SidebarItem>
          ))}
        </div>
      </div>

      <div className="hidden md:mt-auto md:block">
        <SidebarFooter />
      </div>
    </aside>
  );
}
