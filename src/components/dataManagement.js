import React, { useState, useRef } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Layers } from '@mui/icons-material';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import '../page/Main/Map.css'
import assets from '../assets';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { saveCurrentLayerDataVariable } from '../Redux/actions/layerAction';
import { saveCurrentLayerNameVariable } from '../Redux/actions/nameAction';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup, faTools, faGear, faBusSimple, faChartLine } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function DataManager({ handleListLayerItemSelected, handleAddWorkspaceClick }) {

    const dispatch = useDispatch()

    //-------------------- View Infomation of selected layer -------------\\

    const [selectedItem, setSelectedItem] = useState(null);
    const [currentKey, setCurrentKey] = useState([])
    const [currentColumnCount, setCurrentColumnCount] = useState(0)
    const [currentRowCount, setCurrentRowCount] = useState(0)
    const [currentJson, setCurrentJson] = useState(null)
    const [currentLayerName, setCurrentLayerName] = useState('Layer Name')
    const [jsonSize, setJsonSize] = useState(null)

    //------------ Import Layer-------------\\
    const csv2geojson = require("csv2geojson");
    const readFile = require("../utils/readCSVFile");

    const handleFileChange = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        console.log(file);
        readFile.readAsText(file, (err, text) => {
            csv2geojson.csv2geojson(
                text,
                {
                    delimiter: "auto",
                },
                async (err, result) => {
                    if (err) {
                        // Handle error
                    } else {
                        console.log(result);
                        setLayerNames([...layerNames, "_" + file.name.split(".")[0]]);

                        // Save the GeoJSON result to the public folder
                        const fileName = `${file.name.split(".")[0]}`;

                        // const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
                        // Send the GeoJSON data to the backend to be saved
                        await fetch('http://localhost:3001/save-json', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ data: result, name: fileName }),
                        })
                            .then((response) => {
                                if (response.ok) {
                                    console.log('GeoJSON file saved successfully');
                                } else {
                                    console.error('Error saving GeoJSON file');
                                }
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error('Error saving GeoJSON file:', error);
                                setLoading(false);
                            });
                    }
                }
            );
        });
    };

    const fileInputRef = useRef(null);

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };



    const [loading, setLoading] = useState(false);

    const [layerNames, setLayerNames] = useState([
        "_ATS-CTD",
        "_ACLED_Africa",
        "ACLED_Antarctica",
        "ACLED_Caucasus and CentralAsia",
        "ACLED_East Asia",
        "ACLED_LatinAmerica",
        "ACLED_Europe",
        "ACLED_Middle East",
        "ACLED_Oceania",
        "ACLED_South Asia",
        "ACLED_Southeast Asia",
        "ACLED_USA&Canada",
        "_China_Military_Facilities",
        "_China_Nuclear_Sites",
        "_China_SAM_Sites",
        "_China_Early_Warning_sites",
        "_Russian_Military_Facalities",
        "_Russian_Nuclear_Sites",
        "_Russian_Early_Warning_Sites",
        "_Russian_SAM_Sites",
        "_Vessel",
        "_Parlor",
    ]);

    const handleListItemClick = (index, text) => {
        setSelectedItem(index);
        handleListLayerItemSelected(text);
    };

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
                    dataFormat.push({ key: fullKey, type: typeof obj[key] });
                }
            }
        }

        processData(data);
        return dataFormat;
    }

    const calculateJsonDataSize = (data) => {
        const jsonString = JSON.stringify(data);
        const bytes = new Blob([jsonString]).size;
        const sizeInMB = (bytes / (1024 * 1024)).toFixed(2);
        return sizeInMB;
    };
    function interpretFloat64(hexString, littleEndian) {
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }

        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        for (let i = 0; i < 8; i++) {
            view.setUint8(i, bytes[littleEndian ? i : 7 - i]);
        }

        return view.getFloat64(0, littleEndian);
    }
    const jsonToGeoJson = (data) => {
        const features = data.map((item) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    parseFloat(interpretFloat64(item.geom.slice(10, 26), true)),
                    parseFloat(interpretFloat64(item.geom.slice(26, 42), true))
                ]
            },
            properties: {
                id: item.id,
                eventIdCountry: item.event_id_cnty,
                eventDate: item.event_date,
                year: item.year,
                timePrecision: item.time_precision,
                disorderType: item.disorder_type,
                eventType: item.event_type,
                subEventType: item.sub_event_type,
                actor1: item.actor1,
                assocActor1: item.assoc_actor_1,
                interaction1: item.inter1,
                actor2: item.actor2,
                assocActor2: item.assoc_actor_2,
                interaction2: item.inter2,
                interaction: item.interaction,
                civilianTargeting: item.civilian_targeting,
                iso: item.iso,
                region: item.region,
                country: item.country,
                admin1: item.admin1,
                admin2: item.admin2,
                admin3: item.admin3,
                location: item.location,
                geoPrecision: item.geo_precision,
                source: item.source,
                sourceScale: item.source_scale,
                notes: item.notes,
                fatalities: item.fatalities,
                tags: item.tags,
                timestamp: item.timestamp,
            },
        }));

        const featureCollection = {
            type: 'FeatureCollection',
            features,
        };

        return featureCollection
    };
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
      

    const setWorkLayer = async (data) => {
        setLoading(true)
        const layername = extractSubstring(data)
        console.log(layername)
        if (layername == "ATS-CTD") {
            setCurrentLayerName("ATS-CTD")
            setLoading(false)
        }
        else {
            fetch(`/layers/${layername}.json`
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    console.log(myJson)
                    setCurrentKey(getDataFormat(myJson.features[0].properties))
                    setCurrentColumnCount(Object.keys(myJson.features[0].properties).length)
                    setCurrentRowCount(myJson.features.length)
                    setCurrentLayerName(data)
                    setCurrentJson(myJson)
                    setJsonSize(calculateJsonDataSize(myJson))
                    setLoading(false)
                });
        }



        // const response = await axios.post("http://localhost:3001/load-json", {
        //     name: layername,
        // });

        // const geojson = jsonToGeoJson(response.data)
        // console.log(geojson)
        // setCurrentKey(getDataFormat(geojson.features[0].properties))
        // setCurrentColumnCount(Object.keys(geojson.features[0].properties).length)
        // setCurrentRowCount(geojson.features.length)
        // setCurrentLayerName(data)
        // setCurrentJson(geojson)
        // setJsonSize(calculateJsonDataSize(geojson))
        // setLoading(false)
        // console.log(response)
    }

    const handleWorkSpace = () => {
        dispatch(saveCurrentLayerDataVariable(currentJson))
        dispatch(saveCurrentLayerNameVariable(currentLayerName.split("_")[1]))
        handleAddWorkspaceClick()
    }


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        backgroundColor: 'black',
        color: 'white',
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: 'transparent',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
            borderBottom: 'none',
        },
        '&:not(:last-child)': {
            borderBottom: 'none',
        },
    }));

    return (
        <div style={{ height: '' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '30%', padding: '50px', borderRight: '1px solid white' }}>
                    <div style={{
                        padding: '10px', borderBottom: '1px solid white', marginBottom: '10px',
                        fontWeight: 'bold', fontSize: '24px', display: 'flex', flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div>
                            Data Layers
                        </div>
                        <div>
                            <Button type='file' variant="outlined" startIcon={<AddIcon />} style={{ borderColor: 'white', color: 'white' }} onClick={handleFileUpload}>
                                Add
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </Button>

                        </div>
                    </div>
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper', background: 'transparent' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        className='layerList'
                        style={{ maxHeight: '720px', }}
                    >
                        {layerNames.map((data, index) => (
                            <ListItemButton
                                key={index}
                                style={{
                                    display: 'flex',
                                    // borderBottom: '1px solid white',
                                    backgroundColor: selectedItem === index ? 'darkcyan' : 'transparent',
                                }}
                                onClick={() => {
                                    setSelectedItem(index)
                                    setWorkLayer(data)
                                    handleListItemClick(index, data)
                                }}
                            >
                                <ListItemIcon>
                                    <Layers />
                                </ListItemIcon>
                                <ListItemText primary={data} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
                <div
                    style={{
                        width: '70%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: '50px', height: '10%', borderBottom: '1px solid white' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', flexDirection: 'row', }}>
                            <div>
                                {currentLayerName}
                            </div>
                            <div style={{ marginLeft: 50 }}>
                                <Button type='file' variant="outlined" startIcon={<FontAwesomeIcon icon={faChartLine} />} style={{ borderColor: 'white', color: 'white' }} onClick={handleWorkSpace}>
                                    Add WorkSpace
                                </Button>
                            </div>

                        </div>
                        {currentLayerName !=="ATS-CTD" &&
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', paddingRight: '10px', borderRight: '1px solid white', textAlign: 'center', marginTop: '-5px' }}>
                                    <p style={{ marginBottom: 0 }}>Columns</p>
                                    <p>{currentColumnCount}</p>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', paddingLeft: '10px', borderLeft: '1px solid white', textAlign: 'center', marginTop: '-5px' }}>
                                    <p style={{ marginBottom: 0 }}>Rows</p>
                                    <p>{currentRowCount}</p>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', paddingLeft: '10px', borderLeft: '1px solid white', textAlign: 'center', marginTop: '10px' }}>
                                    <p>{jsonSize != null ? jsonSize + "Mb" : ""}</p>
                                </div>
                            </div>}

                    </div>
                    {
                        currentLayerName === "ATS-CTD" ? <div style={{ height: '90%', width: '100%', padding: '30px' }}>
                            This is real time data. If you want to work in ATS-CTD Data.
                            Please click "add workspace" button. And then go into Search Panel </div> :
                            <div style={{ height: '90%', width: '100%', padding: '30px' }}>
                                <TableContainer component={Paper} sx={{ maxHeight: '700px' }}>
                                    <Table stickyHeader aria-label="simple table" style={{ width: '100%', background: 'transparent' }}>
                                        <TableHead >
                                            <StyledTableRow>
                                                <StyledTableCell>Data Key Field</StyledTableCell>
                                                <StyledTableCell align="right">Type</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentKey.map((row, index) => (
                                                <StyledTableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.key}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{row.type}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                    }

                </div>
            </div>

            <div
                style={
                    loading
                        ? {
                            position: "absolute",
                            zIndex: "10",
                            textAlign: "center",
                            width: "100%",
                            height: "90%",
                            display: "block",
                            top: '0'
                        }
                        : { display: "none" }
                }
            >
                <img src={assets.images.loading} style={{ marginTop: "10%" }} />
                <h2 style={{ color: "white", marginTop: "-10%" }}>Loading Layer</h2>
            </div>

        </div>


    );
}