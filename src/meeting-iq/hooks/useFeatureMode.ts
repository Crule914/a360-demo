// @ts-nocheck
import { useAppStore } from '@miq/stores/useAppStore';

export type FeatureMode = 'mvp' | 'post-mvp';
export type CardInteractionMode = 'inline-actions' | 'clickable-card';

export const useFeatureMode = () => {
  const featureMode = useAppStore((s) => (s as any).featureMode as FeatureMode);
  const setFeatureMode = useAppStore((s) => (s as any).setFeatureMode as (mode: FeatureMode) => void);
  const isPostMVP = featureMode === 'post-mvp';

  return { featureMode, setFeatureMode, isPostMVP };
};

export const useCardInteractionMode = () => {
  const cardInteractionMode = useAppStore((s) => (s as any).cardInteractionMode as CardInteractionMode);
  const setCardInteractionMode = useAppStore(
    (s) => (s as any).setCardInteractionMode as (mode: CardInteractionMode) => void
  );
  const isClickableCard = cardInteractionMode === 'clickable-card';
  return { cardInteractionMode, setCardInteractionMode, isClickableCard };
};

export type PrepHeaderLayout = 'right-only' | 'full-width';

export const usePrepHeaderLayout = () => {
  const prepHeaderLayout = useAppStore((s) => (s as any).prepHeaderLayout as PrepHeaderLayout);
  const setPrepHeaderLayout = useAppStore(
    (s) => (s as any).setPrepHeaderLayout as (mode: PrepHeaderLayout) => void
  );
  const isFullWidthHeader = prepHeaderLayout === 'full-width';
  return { prepHeaderLayout, setPrepHeaderLayout, isFullWidthHeader };
};
