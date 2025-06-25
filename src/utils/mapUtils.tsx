// cluster.ts
import Supercluster from "supercluster";

export interface Place {
  id: string | number;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

// GeoJSON point feature that supercluster expects
export function toPointFeature(place: Place): Supercluster.PointFeature<Place> {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [place.longitude, place.latitude],
    },
    properties: place,
  };
}
