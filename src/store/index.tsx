import type { DrawingInfo, SkPaint, SkPath } from '@shopify/react-native-skia';
import create, { State } from 'zustand';
import utils from '../drawing/utils';

export type CurrentPath = {
  path: SkPath;
  paint: SkPaint;
  color?: string;
};

interface IDrawingStore extends State {
  // Array of completed paths for redrawing
  completedPaths: CurrentPath[];
  // current stroke
  stroke: SkPaint;
  strokeWidth: number;
  color: string;
  canvasInfo: Partial<DrawingInfo> | null;
  //function to update paths
  setCompletedPaths: (completedPaths: CurrentPath[]) => void;
  setStroke: (stroke: SkPaint) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setColor: (color: string) => void;
  setCanvasInfo: (canvasInfo: Partial<DrawingInfo>) => void;
}

const useDrawingStore = create<IDrawingStore>((set, get) => ({
  completedPaths: [],
  strokeWidth: 2,
  color: 'black',
  stroke: utils.getPaint(2, 'black'),
  setCompletedPaths: (completedPaths) => {
    set({ completedPaths });
  },
  setStrokeWidth: (strokeWidth) => {
    set({ strokeWidth });
  },
  setStroke: (stroke) => {
    set({ stroke });
  },
  setColor: (color) => {
    set({ color });
  },
  canvasInfo: null,
  setCanvasInfo: (canvasInfo) => {
    set({ canvasInfo });
  },
}));

export default useDrawingStore;
