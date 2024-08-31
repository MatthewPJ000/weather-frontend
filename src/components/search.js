import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Person, Home, Email, Phone, Search, Download, KeyboardControlKeySharp } from '@mui/icons-material';
import Button from '@mui/material/Button';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup, faTools, faGear, faBusSimple, faChartLine, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { saveQueryDataVariable } from '../Redux/actions/queryAction';

export default function SearchPanel({ onGeoFenceClick }) {

    const dispatch = useDispatch()
    const currentLayerData = useSelector((state) => state.myState.currentLayerDataVariable)
    const [currentKey, setCurrentKey] = useState([])

    function getDataFormat(data) {
        const dataFormat = [];

        function processData(obj, prefix = '') {
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        dataFormat.push({ key: fullKey, type: 'array' });
                    } else {
                        processData(obj[key], fullKey);
                    }
                } else {
                    dataFormat.push(fullKey);
                }
            }
        }

        processData(data);
        return dataFormat;
    }

    useEffect(() => {
        if (currentLayerData != null) {
            setCurrentKey(getDataFormat(currentLayerData.features[0].properties))
        }
    }, [])

    const [items, setItems] = useState([
    ]);

    const handleKeyChange = (index, newKey) => {
        const newItems = [...items];
        newItems[index].key = newKey;
        setItems(newItems);
    };

    const handleValueChange = (index, newValue) => {
        const newItems = [...items];
        newItems[index].value = newValue;
        setItems(newItems);
    };

    const addFilter = () => {
        setItems([...items, { key: 'name', value: '' }])
    }

    const handleDelete = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleQuery = () => {

        function isValidDate(dateString) {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        }

        function isNumber(str) {
            const currencySymbols = ['$', '€', '£', '¥', '₩', '₹', '₽', '₳', '₢', '₣', '₤', '₧', '₨', '₪', '₫', '₭', '₱', '₴', '₵', '₸', '฿', '៛', 'ᴳ', 'ᵽ', 'ᵾ', 'ᶂ'];
            const regex = new RegExp(`^(${currencySymbols.join('|')})\\d+(\\.\\d+)?$`);
            return regex.test(str) && isNaN(parseInt(str.replace(/\D/g, '')));
          }
        const filterCriteria = items;

        // Filter the people array based on the filter criteria
        // const filteredPeople = people.filter(person => filterCriteria.every(criteria => {
        // if (criteria.key === 'age') {
        //     return person.age >= criteria.min && person.age <= criteria.max;
        // } else {
        //     return person[criteria.key] === criteria.value;
        // }
        // }));

        const filteredData = currentLayerData.features.filter(element => filterCriteria.every(criteria => {
            if (isValidDate(criteria.value.split(',')[0])) {
                console.log('0')
                const max = new Date(criteria.value.split(',')[1])
                const min = new Date(criteria.value.split(',')[0])
                return new Date(element.properties[`${criteria.key}`]) >= min && new Date(element.properties[`${criteria.key}`]) <= max;
            }
            else if (isNumber(criteria.value.split(',')[0])) {
                console.log('1')
                const max = criteria.value.split(',')[1]
                const min = criteria.value.split(',')[0]
                let numericStr = element.properties[`${criteria.key}`].replace(/^[^0-9.-]+/, '');
                return parseFloat(numericStr) >= min && parseFloat(numericStr) <= max;
            }
            else {
                console.log('2')
                return element.properties[`${criteria.key}`] === criteria.value
            }

        }));
        console.log(filteredData)
        dispatch(saveQueryDataVariable(filteredData))

    }

 

    return (
        <Box
            // component="form"
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
            <Button type='file' variant="outlined" startIcon={<AddIcon />} style={{ borderColor: 'white', color: 'white', width: '60%', alignSelf: 'center' }} onClick={addFilter}>
                Add Filter
            </Button>

            {currentLayerData != null ?
                <ul>
                    {items.map((item, index) => (
                        <li key={index} style={{ display: 'flex', width: '100%', marginTop: '10px', }}>

                            <select value={item.key} onChange={(e) => handleKeyChange(index, e.target.value)} style={{ width: '45%', background: 'transparent', color: 'white' }}>
                                {currentKey.map((key, index) => (
                                    <option value={key} style={customDropdownStyles.option}>{key}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={item.value}
                                onChange={(e) => handleValueChange(index, e.target.value)}
                                style={{ width: '45%', paddingLeft: '10px', background: 'transparent', color: 'white', border: '1px solid white' }}
                            />
                            {/* <button onClick={() => handleDelete(index)} style={{ width: '10%' }}>Trash</button> */}
                            <FontAwesomeIcon icon={faTrash} onClick={() => { handleDelete(index) }} style={{ alignSelf: 'center', marginLeft: '10px' }} />
                        </li>
                    ))}
                </ul> :
                <div>
                    No data imported
                </div>}

            <div style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: "space-evenly", position: 'absolute', bottom: '20px', left: 0, margin: 0 }}>
                <Button variant="outlined" startIcon={<PublicIcon />} style={{ width: '30%', borderColor: 'white', color: 'white', }} onClick={onGeoFenceClick}>
                    Geocode
                </Button>
                <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white', width: "30%", color: 'white' }} onClick={handleQuery}>
                    Search
                </Button>

            </div>

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
