import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import axios from 'axios';
import { layer } from '@fortawesome/fontawesome-svg-core';
import { useDispatch, useSelector, Provider } from 'react-redux';


function MinHeightTextarea({ textareaText }) {
    // const [textareaText, setTextareaText] = useState('');
    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
          width: 100%;
          box-sizing: border-box;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          padding: 8px 12px;
          border-radius: 8px;
          color: white;
          max-height: 300px;
          min-height: 300px;
          overflow-y: auto;
          background: transparent;
          border: 1px solid white;
          box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      
          // Scroll bar styles
          &::-webkit-scrollbar {
            width: 12px;
          }
      
          &::-webkit-scrollbar-track {
            background-color: black;
          }
      
          &::-webkit-scrollbar-thumb {
            background-color: gray;
            border-radius: 6px;
          }
      
          &:hover {
            border-color: ${blue[400]};
          }
      
          &:focus {
            border-color: ${blue[400]};
            box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
          }
      
          // firefox
          &:focus-visible {
            outline: 0;
          }
        `
      );
    return (
        <Textarea
            aria-label="minimum height"
            minRows={9}
            placeholder=""
            value={textareaText}
        // onChange={(e) => setTextareaText(e.target.value)} 
        />
    );
}

function CustomizedInputBase({ inputText, setInputText, setTextareaText, layerName }) {
    const currentTableName = useSelector((state) => state.myState.currentLayerNameVariable)
    function extractSubstring(str) {
        const parts = str.split('_');
        
        // Check if the string starts with an underscore
        if (str.startsWith('_')) {
          const substring = parts.filter(part => part !== '').join('_');
          return substring;
        } else {
          const substring = parts[1];
          return substring;
        }
      }
    const handleSend = async (message, name) => {
        const trimmed = message.trim();
        setTextareaText("Getting response...");
        console.log( extractSubstring(name))


        if (trimmed) {
            try {
                const response = await axios.post("http://170.130.55.81:3001/chatapi", {
                    message: trimmed,
                    name: extractSubstring(name),
                    tableName: currentTableName
                });
                setTextareaText(response.data.message.content);
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    // Handle 500 error
                    setTextareaText("Sorry. I can't answer your question.Please try again. Please write more correctly");
                    console.error("Error fetching AI response:", error);
                } else {
                    // Handle other errors
                    setTextareaText("Error fetching AI response. Please try again later.");
                    console.error("Error fetching AI response:", error);
                }
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log(layerName)
        handleSend(inputText, layerName)
    };

    return (
        <Paper
            component="form"
            onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                handleSearch(e);
            }}
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 1,
                borderStyle: 'solid',
                width: '100%'
            }}
        >
            <IconButton sx={{ p: '10px', color: 'white' }} aria-label="menu">
                <SupportAgentIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1, color: 'white' }}
                placeholder="Enter a query"
                inputProps={{ 'aria-label': 'search google maps' }}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch(e); // Call the handleSearch function when the user presses Enter
                    }
                }}
            />
            <IconButton onClick={handleSearch} sx={{ p: '10px', color: 'white' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
export default function AgentPanel({ total }) {



    const [inputText, setInputText] = useState('');
    const [textareaText, setTextareaText] = useState('');


    const [selectedOption, setSelectedOption] = useState('Acled');

    // Options to be displayed in the dropdown
    const options = [
        "ACLED_Africa",
        "ACLED_Antarctica",
        "ACLED_CaucasusCentralAsia",
        "ACLED_EastAsia",
        "ACLED_LatinAmerica",
        "ACLED_Europe",
        "ACLED_MiddleEast",
        "ACLED_Oceania",
        "ACLED_SouthAsia",
        "ACLED_SoutheastAsia",
        "ACLED_USACanada",
        "_China_Military_Facilities",
        "_China_Nuclear_Sites",
        "_China_SAM_Sites",
        "_China_Early_Warning_sites",
        "_Russian_Military_Facalities",
        "_Russian_Nuclear_Sites",
        "_Russian_Early_Warning_Sites",
        "_Russian_SAM_Sites",
        "_Vessel",
        "_Parlor",];

    // Update the selected option when the dropdown value changes
    const handleSelectChange = (event) => {
        console.log(event.target.value)
        
        setSelectedOption(event.target.value);
    };
   

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, },
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                // Set the text color to white
            }}
            noValidate
            autoComplete="off"
        >
            <select id="option-select" value={selectedOption} onChange={handleSelectChange} style={{ width: '45%', background: 'transparent', color: 'white' }}>

                {options.map((option, index) => (
                    <option key={index} value={option} style={customDropdownStyles.option}>
                        {option}
                    </option>
                ))}

            </select>
            <MinHeightTextarea textareaText={textareaText} />
            <CustomizedInputBase
                inputText={inputText}
                setInputText={setInputText}
                setTextareaText={setTextareaText}
                layerName={selectedOption}
            />
        </Box>
    );
}
const customDropdownStyles = {
    select: {
        backgroundColor: 'transparent',
        border: '1px solid #white',
        color: 'white',
        padding: '8px 12px',
        fontSize: '16px',
        appearance: 'none',
        webkitAppearance: 'none',
        mozAppearance: 'none',
        backgroundImage: 'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M7 10l5 5 5-5z" fill="%23white"/%3E%3C/svg%3E\')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '24px',
        cursor: 'pointer',
    },
    option: {
        backgroundColor: '#333',
        color: 'white',
    },
};