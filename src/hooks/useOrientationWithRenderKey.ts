// useOrientationWithRenderKey.ts
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";

export function useOrientationWithRenderKey() {
  const [orientation, setOrientation] = useState<"PORTRAIT" | "LANDSCAPE">(
    "PORTRAIT"
  );
  const [isRotating, setIsRotating] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleOrientationChange = ({
      orientationInfo,
    }: ScreenOrientation.OrientationChangeEvent) => {
      setIsRotating(true); // start loading

      const isLandscape =
        orientationInfo.orientation ===
          ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientationInfo.orientation ===
          ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

      const isPortrait =
        orientationInfo.orientation ===
          ScreenOrientation.Orientation.PORTRAIT_UP ||
        orientationInfo.orientation ===
          ScreenOrientation.Orientation.PORTRAIT_DOWN;

      if (isLandscape) setOrientation("LANDSCAPE");
      if (isPortrait) setOrientation("PORTRAIT");

      // Delay updating renderKey until layout stabilizes
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsRotating(false); // end loading
        setRenderKey((prev) => prev + 1); // force rerender
      }, 300); // Adjust this delay if needed
    };

    const sub = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );

    // Get initial orientation
    (async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      if (
        current === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setOrientation("LANDSCAPE");
      }
    })();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub);
      clearTimeout(timeout);
    };
  }, []);

  return { orientation, isRotating, renderKey };
}
