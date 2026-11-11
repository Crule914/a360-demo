// @ts-nocheck
export type CanvasLayoutMode = 'dual' | 'chat-expanded' | 'content-only';

export interface CanvasLayoutState {
  mode: CanvasLayoutMode;
  chatCanvasItems: any[];
  contentCanvasItems: any[];
  previousMode?: CanvasLayoutMode;
}

export interface LayoutTransition {
  from: CanvasLayoutMode;
  to: CanvasLayoutMode;
  duration: number;
  animationType: 'slide' | 'fade' | 'scale';
}