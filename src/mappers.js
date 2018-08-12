export function mapServerData(serverData) {
  
  return {
    type: "FeatureCollection",
    features: serverData.map((obj, index) => ({
      type: "Feature",
      id: index,
      geometry: 
      {
        type: "Point",
        // *** координаты перепутаны сначала широта
        coordinates: [obj.lat, obj.long]
      },
      properties: {
        iconCaption: obj.serialNumber,
        // *** добавил isActive для фильтрации, т.к. details подгружаются динамически
        // *** также можно было бы изменить условие фильтрации проверяя тип точки по options.preset 
        isActive: obj.isActive
      },
      options: {
        preset: getObjectPreset(obj)
      }
    }))
  };
}

function getObjectPreset(obj) {
  return obj.isActive
    ? 'islands#blueCircleDotIconWithCaption'
    : 'islands#redCircleDotIconWithCaption';
}
