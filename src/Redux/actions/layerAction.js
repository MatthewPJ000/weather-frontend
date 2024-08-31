// store/actions/myActions.js
export const saveCurrentLayerDataVariable = (value) => ({
    type: 'layerData',
    payload: value,
  });