const path = require('path');
const fse = require('fs-extra');

function copy(from, to) {
  fse.copySync(from, to, { overwrite: true });
  console.log(`Copied ${from} -> ${to}`);
}

const cesiumBase = path.resolve('node_modules/cesium/Build/Cesium');
const publicCesium = path.resolve('public/cesium');

copy(path.join(cesiumBase, 'Workers'), path.join(publicCesium, 'Workers'));
copy(path.join(cesiumBase, 'ThirdParty'), path.join(publicCesium, 'ThirdParty'));
copy(path.join(cesiumBase, 'Assets'), path.join(publicCesium, 'Assets'));
copy(path.join(cesiumBase, 'Widgets'), path.join(publicCesium, 'Widgets'));