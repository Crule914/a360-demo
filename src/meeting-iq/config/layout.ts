// @ts-nocheck
// Layout configuration for easy header/footer positioning toggle
export const layoutConfig = {
  // Change this to 'top' to move navigation to header, 'bottom' for footer
  navigationPosition: 'bottom' as 'top' | 'bottom',
  
  // When navigation is at top, add this much padding to content
  headerHeight: '20', // pt-20 = 80px (64px nav + 16px extra padding)
  
  // Show full navigation features when at top (dropdowns, etc.)
  showFullNavigation: true,
};

export const getLayoutConfig = () => layoutConfig;

export const toggleNavigationPosition = () => {
  layoutConfig.navigationPosition = layoutConfig.navigationPosition === 'top' ? 'bottom' : 'top';
  return layoutConfig.navigationPosition;
};