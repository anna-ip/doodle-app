import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, SafeAreaView } from 'react-native';
import { Header } from '../components/Header';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Path,
  SkiaView,
  useDrawCallback,
  SkCanvas,
  useTouchHandler,
  TouchInfo,
  Skia,
  ExtendedTouchInfo,
} from '@shopify/react-native-skia';
import useDrawingStore, { CurrentPath } from '../store';
import { updateParenthesizedType } from 'typescript';

const { width } = Dimensions.get('window');

export const Drawing = () => {
  // Is user touching the screen
  const touchState = useRef(false);
  // solve to import ICanvas from shopify/skia
  // Instance of canvas for imperative access
  const canvas = useRef<SkCanvas>();
  // The current path which the user is drawing. The value is reset when finger is raised from screen
  const currentPath = useRef<CurrentPath | null>();
  // Array of completed paths from global state
  const completedPaths = useDrawingStore((state) => state.completedPaths);
  // A function in global state to add/remove paths
  const setCompletedPaths = useDrawingStore((state) => state.setCompletedPaths);
  // Stroke value from global state
  const stroke = useDrawingStore((state) => state.stroke);
  // Height of canvas, set on layout of View wrapping Canvas
  const [canvasHeight, setCanvasHeight] = useState(400);

  const onDrawingStart = useCallback(
    (touchInfo: TouchInfo) => {
      if (currentPath.current) return;
      const { x, y } = touchInfo;
      currentPath.current = {
        path: Skia.Path.Make(),
        paint: stroke.copy(),
      };

      touchState.current = true;
      currentPath.current.path?.moveTo(x, y);

      if (currentPath.current) {
        canvas.current?.drawPath(
          currentPath.current.path,
          currentPath.current.paint
        );
      }
    },
    [stroke]
  );

  const onDrawingActive = useCallback((touchInfo: ExtendedTouchInfo) => {
    const { x, y } = touchInfo;
    if (!currentPath.current?.path) return;
    if (touchState.current) {
      currentPath.current.path.lineTo(x, y);
      if (currentPath.current) {
        canvas.current?.drawPath(
          currentPath.current.path,
          currentPath.current.paint
        );
      }
    }
  }, []);

  const onDrawingFinished = useCallback(() => {
    updatePaths();
    // reset the path. prepare for the next draw
    currentPath.current = null;
    // set touchState to false
    touchState.current = false;
  }, [completedPaths.length]);

  const updatePaths = () => {
    if (!currentPath.current) return;
    // copy paths in global state
    let updatedPaths = [...completedPaths];

    //Push newly updated path
    updatedPaths.push({
      path: currentPath.current?.path.copy(),
      paint: currentPath.current?.paint.copy(),
      // Add current color of the stroke
      // The current color of the stroke
      color: useDrawingStore.getState().color,
    });
    // Update the state
    setCompletedPaths(updatePaths);
  };

  const touchHandler = useTouchHandler({
    onActive: onDrawingActive,
    onStart: onDrawingStart,
    onEnd: onDrawingFinished,
  });

  const onDraw = useDrawCallback((_canvas, info) => {
    touchHandler(info.touches);
    if (!canvas.current) {
      useDrawingStore.getState().setCanvasInfo({
        width: info.width,
        height: info.height,
      });
      canvas.current = _canvas;
    }
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    setCanvasHeight(event.nativeEvent.layout.height);
  };

  {
    /* SkiaView draws the current when touches the screen and move fingers */
  }
  {
    /* Todo: add styles zIndex: 10 */
  }
  {
    /* When user lift their finger from the skiaView the path is rendered on the canvas, The Canvas is rendered absolutley under the SkiaView */
  }
  {
    /* Once the path is drawn on SkiaView and added to completedPaths. Completed paths is rendered using Path component declaratively  */
  }

  console.log(completedPaths);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header />
        <View onLayout={onLayout} style={styles.canvas}>
          <SkiaView
            style={{ height: canvasHeight, width: width - 24, zIndex: 10 }}
            onDraw={onDraw}
          />
          <Canvas
            style={{
              height: canvasHeight,
              width: width - 24,
              position: 'absolute',
            }}
          >
            {completedPaths?.map((path) => (
              <Path
                key={path.path.toSVGString()}
                path={path.path}
                paint={{ current: path.paint }}
              />
            ))}
          </Canvas>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  canvas: {
    backgroundColor: '#fff',
    flexGrow: 1,
    width,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});
