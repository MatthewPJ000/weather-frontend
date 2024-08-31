// BasicSelect Component
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const MapStyleSelection = ({ onTileStyleChange }) => {
  const [tileStyle, setTileStyle] = React.useState('');

  const handleChange = (event) => {
    const newTileStyle = event.target.value;
    setTileStyle(newTileStyle);
    onTileStyleChange(newTileStyle);
  };

  return (
    <Box
      sx={{ minWidth: 120 }}
      style={{
        width: '80%',
        position: 'absolute',
        left: '10%',
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <FontAwesomeIcon
        icon={faGlobe}
        className="sidebar-icons"
        style={{
          marginTop: 0,
          width: '30px',
          height: '100%',
          position: 'absolute',
          marginLeft: '10px',
        }}
      />
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{ color: 'white' }}
          style={{ paddingLeft: '30px' }}
        >
          Map Tiles
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tileStyle}
          label="Map Tiles"
          onChange={handleChange}
          sx={{
            borderColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
          style={{ color: 'white', paddingLeft: '30px' }}
        >
          <MenuItem value={'mapbox://styles/mapbox/satellite-streets-v12'}>
            Satellite
          </MenuItem>
          <MenuItem value={'mapbox://styles/mapbox/dark-v11'}>Dark</MenuItem>
          <MenuItem value={'mapbox://styles/mapbox/light-v11'}>Light</MenuItem>
          <MenuItem value={'mapbox://styles/mapbox/streets-v12'}>Street</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MapStyleSelection;