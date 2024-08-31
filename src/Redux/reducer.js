// store/reducers/myReducer.js


const initialState = {
  currentLayerDataVariable: null,
  currentLayerNameVariable: null,
  queryDataVariable: null,
  venntelGeoPoints: []
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'layerData':
      return {
        ...state,
        currentLayerDataVariable: action.payload,
      };
    case 'queryData':
      return {
        ...state,
        queryDataVariable: action.payload,
      };
    case 'nameData':
      return {
        ...state,
        currentLayerNameVariable: action.payload,
      };
    case 'venntelGeoPoints':
      return {
        ...state,
        venntelGeoPoints: action.payload,
      };
    default:
      return state;
  }
};

export default myReducer;