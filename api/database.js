let sequentialId = 1;
let data = {};

module.exports.set = value => {
  const id = sequentialId++;
  const _data = { ...value, id };
  data[id] = _data;
  return _data;
};

module.exports.get = id => {
  return data[id];
}

module.exports.getAll = () => {
  const arr = [];
  for (const _data of Object.values(data)) {
    arr.push(_data); 
  }
  return arr;
}

module.exports.clear = () => {
  sequentialId = 0;
  data = {};
}
