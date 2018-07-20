import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

// *** Добавил export default потому что экспорт только одной функции 
export default function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: [],
    zoom: 11
  });
  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',
    // *** лишнее св-во которое false по умолчанию clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps),
  });
  // *** лишняя команда, мешает отображению кластеров в виде диаграмм
  // objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

  loadList().then(data => {
    objectManager.add(data);
  });

  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);
    // *** построил условие динамической подргузки балуна по примеру в документации 
    if (obj.properties.details) {
      objectManager.objects.balloon.open(objectId);
    } else {
      obj.properties.balloonContent = "Идет загрузка данных...";
      objectManager.objects.balloon.open(objectId);

      loadDetails(objectId).then(data => {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      });
    }
  });
  
  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      // *** добавил obj.properties.isActive, т.к. этот флаг передаю в properties
      obj => filters[obj.properties.isActive ? 'active' : 'defective']
    );
  });
  // *** добавил objectManager on map
  myMap.geoObjects.add(objectManager);

}
