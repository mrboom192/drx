// cluster.ts
import Supercluster from "supercluster";

export interface Place {
  id: string | number;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

// GeoJSON point feature that supercluster expects
export function toPointFeature(
  item: Place,
  coordinates: [longitude: number, latitude: number]
): Supercluster.PointFeature<Place> {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: item,
  };
}
