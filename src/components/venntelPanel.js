import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PublicIcon from '@mui/icons-material/Public';

import { useDispatch, useSelector, Provider } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Search, CalendarMonth, Timelapse } from '@mui/icons-material';
import { saveCurrentLayerDataVariable } from '../Redux/actions/layerAction';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import assets from '../assets';
import { Layers } from '@mui/icons-material';
import '../page/Main/Map.css'

export default function VenntelPanel({ onBoundClick }) {

    const dispatch = useDispatch()
    const bound = useSelector((state) => state.myState.venntelGeoPoints)

    const [fromDate, setFromDate] = useState("2024-08-03")
    const [endDate, setEndDate] = useState("2024-08-05");
    const [fromTime, setFromTime] = useState("00:00:00");
    const [endTime, setEndTime] = useState("23:59:59");
    const [loading, setLoading] = useState(false);
    const [ids, setIds] = useState([])
    const [ipAddress, setIpAddress] = useState(null)
    const [idList, setIdList] = useState([])

    const handleSearch = async () => {
        setLoading(true)
        const startDate = fromDate + "T" + fromTime + "Z"
        const lastDate = endDate + "T" + endTime + "Z"
        const geoBound = [
            {
                coordinates: bound.map(([longitude, latitude]) => ({
                    longitude,
                    latitude
                }))
            }
        ]
        console.log(geoBound)
        const params = { startDate, lastDate, geoBound }

        const response = await axios.post("http://170.130.55.81:3001/venntel/locationData/search", {
            sDate: startDate,
            eDate: lastDate,
            geo: geoBound
        });

        setLoading(false)

        const signals = [];
        const rIds = []

        for (const polygon of response.data.locationData.polygons) {

            for (const registrationID of polygon.registrationIDs) {
                // setIdList([...idList, registrationID.registrationID]);
                rIds.push({ "id": registrationID.registrationID, "count": registrationID.signalCount })
                signals.push(...registrationID.signals);
            }
        }

        rIds.sort((a, b) => b.count - a.count);
        console.log(rIds)
        const idsOnly = rIds.map(item => item.id);
        setIdList(idsOnly)
        const geoJSONFeatures = signals.map((item) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [item.longitude, item.latitude],
            },
            properties: {
                registrationID: item.registrationID,
                timestamp: item.timestamp,
                recordCount: item.recordCount,
                flags: item.flags,
                hot: item.hot,
                ipAddress: item.ipAddress,
            },
        }));

        const geoJSONData = {
            type: 'FeatureCollection',
            features: geoJSONFeatures,
        };
        dispatch(saveCurrentLayerDataVariable(geoJSONData))
        console.log(geoJSONData);

    }

    const handleSearchByIds = async () => {
        setLoading(true)
        const startDate = fromDate + "T" + fromTime + "Z"
        const lastDate = endDate + "T" + endTime + "Z"

        // console.log(ids.split(","))

        const response = await axios.post("http://170.130.55.81:3001/venntel/locationData/searchById", {
            sDate: startDate,
            eDate: lastDate,
            id: ids
        });

        setLoading(false)

        const signals = [];



        for (const result of response.data.locationDataResults) {
            for (const signal of result.signals) {
                signals.push(signal);
            }
        }

        const geoJSONFeatures = signals.map((item) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [item.longitude, item.latitude],
            },
            properties: {
                registrationID: item.registrationID,
                timestamp: item.timestamp,
                recordCount: item.recordCount,
                flags: item.flags,
                hot: item.hot,
                ipAddress: item.ipAddress,
            },
        }));

        const geoJSONData = {
            type: 'FeatureCollection',
            features: geoJSONFeatures,
        };
        dispatch(saveCurrentLayerDataVariable(geoJSONData))
        console.log(geoJSONData);

    }

    const handleSearchByIp = async () => {
        setLoading(true)
        const startDate = fromDate + "T" + fromTime + "Z"
        const lastDate = endDate + "T" + endTime + "Z"
        const geoBound = [
            {
                coordinates: bound.map(([longitude, latitude]) => ({
                    longitude,
                    latitude
                }))
            }
        ]
        const params = { startDate, lastDate, geoBound }

        const response = await axios.post("http://170.130.55.81:3001/venntel/locationData/searchByIp", {
            sDate: startDate,
            eDate: lastDate,
            ip: [
                {
                    "ipAddress": ipAddress
                }
            ]
        });

        setLoading(false)

        const signals = [];

        for (const ipAddresses of response.data.ipAddresses) {
            for (const registrationID of ipAddresses.registrationIDs) {
                signals.push(...registrationID.signals);
            }
        }
        const geoJSONFeatures = signals.map((item) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [item.longitude, item.latitude],
            },
            properties: {
                registrationID: item.registrationID,
                timestamp: item.timestamp,
                recordCount: item.recordCount,
                flags: item.flags,
                hot: item.hot,
                ipAddress: item.ipAddress,
            },
        }));

        const geoJSONData = {
            type: 'FeatureCollection',
            features: geoJSONFeatures,
        };
        dispatch(saveCurrentLayerDataVariable(geoJSONData))
        console.log(geoJSONData);

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
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <FormControl
                    sx={{
                        m: 1,
                        // width: '25ch',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { // Set the icon color to white
                                color: 'white',
                                paddingLeft: 0
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white', // Set the label color to white
                        },
                    }}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>
                        From Date
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        style={{ paddingLeft: 0, color: 'white' }}
                        startAdornment={
                            <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                <IconButton aria-label="toggle password Person" edge="end">
                                    <CalendarMonth />
                                </IconButton>
                            </InputAdornment>
                        }
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value) }}
                        label="From Date"
                    />
                </FormControl>
                <FormControl
                    sx={{
                        m: 1,
                        // width: '25ch',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { // Set the icon color to white
                                color: 'white',
                                paddingLeft: 0
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white', // Set the label color to white
                        },
                    }}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>
                        From Time
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        style={{ paddingLeft: 0, color: 'white' }}
                        startAdornment={
                            <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                <IconButton aria-label="toggle password Person" edge="end">
                                    <Timelapse />
                                </IconButton>
                            </InputAdornment>
                        }
                        value={fromTime}
                        onChange={(e) => { setFromTime(e.target.value) }}
                        label="From Time"
                    />
                </FormControl>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <FormControl
                    sx={{
                        m: 1,
                        // width: '25ch',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { // Set the icon color to white
                                color: 'white',
                                paddingLeft: 0
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white', // Set the label color to white
                        },
                    }}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>
                        End Date
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        style={{ paddingLeft: 0, color: 'white' }}
                        startAdornment={
                            <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                <IconButton aria-label="toggle password Person" edge="end">
                                    <CalendarMonth />
                                </IconButton>
                            </InputAdornment>
                        }
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value) }}
                        label="End Date"
                    />
                </FormControl>
                <FormControl
                    sx={{
                        m: 1,
                        // width: '25ch',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { // Set the icon color to white
                                color: 'white',
                                paddingLeft: 0
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white', // Set the label color to white
                        },
                    }}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>
                        End Time
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        style={{ paddingLeft: 0, color: 'white' }}
                        startAdornment={
                            <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                <IconButton aria-label="toggle password Person" edge="end">
                                    <Timelapse />
                                </IconButton>
                            </InputAdornment>
                        }
                        value={endTime}
                        onChange={(e) => { setEndTime(e.target.value) }}
                        label="End Time"
                    />
                </FormControl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <FormControl
                    sx={{
                        m: 1,
                        // width: '25ch',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': { // Set the icon color to white
                                color: 'white',
                                paddingLeft: 0
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white', // Set the label color to white
                        },
                    }}
                    variant="outlined"
                    style={{ width: '100%' }}
                >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>
                        ipAddress
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        style={{ paddingLeft: 0, color: 'white' }}
                        // startAdornment={
                        //     <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                        //         <IconButton aria-label="toggle password Person" edge="end">
                        //             <CalendarMonth />
                        //         </IconButton>
                        //     </InputAdornment>
                        // }
                        value={ipAddress}
                        onChange={(e) => { setIpAddress(e.target.value) }}
                        label="Ip Adress"
                    />
                </FormControl>
            </div>
            {/* 
            <div>
                Geo Area
            </div>

            <div style={{ textAlign: 'center' }}>
                {bound.lenght != 0 ? bound.map((pair, index) => (
                    <p key={index}>
                        [{pair[0]}, {pair[1]}]
                    </p>
                )) : <p></p>}
            </div> */}


            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: "space-evenly", }}>
                <Button variant="outlined" startIcon={<PublicIcon />} style={{ borderColor: 'white', color: 'white', }} onClick={onBoundClick}>
                    Geocode
                </Button>
                <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white', color: 'white' }} onClick={handleSearch} >
                    Search
                </Button>
                <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white', color: 'white',  }} onClick={handleSearchByIds} >
                    Search By Id
                </Button>
                <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white', color: 'white',  }} onClick={handleSearchByIp} >
                    Search By Ip
                </Button>
            </div>
            {
                ids.length != 0 &&
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper', background: 'transparent' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className='layerList'
                    style={{ maxHeight: '300px' }}
                >
                    {ids.map((data, index) => (
                        <ListItemButton
                            key={index}
                            style={{
                                display: 'flex',
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginBottom: 2,
                                // borderBottom: '1px solid white',
                                backgroundColor: 'darkcyan',
                                borderRadius: 5
                            }}
                            onClick={() => {
                                const updatedIds = ids.filter(id => id !== data);
                                // Update the state with the filtered array
                                setIds(updatedIds);
                            }}
                        >
                            <ListItemText primary={data} />
                        </ListItemButton>
                    ))}
                </List>
            }
            {
                idList.length != 0 &&
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper', background: 'transparent' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className='layerList'
                    style={{ maxHeight: '300px', border: "1px solid", borderRadius: 5 }}
                >
                    {idList.map((data, index) => (
                        <ListItemButton
                            key={index}
                            style={{
                                display: 'flex',
                                paddingTop: 0,
                                paddingBottom: 0
                                // borderBottom: '1px solid white',
                                // backgroundColor: selectedItem === index ? 'darkcyan' : 'transparent',
                            }}
                            onClick={() => {
                                setIds([...ids, data])
                            }}
                        >
                            <ListItemIcon>
                                <Layers />
                            </ListItemIcon>
                            <ListItemText primary={data} />
                        </ListItemButton>
                    ))}
                </List>
            }

            <div
                style={
                    loading
                        ? {
                            position: "absolute",
                            zIndex: "10",
                            textAlign: "center",
                            width: "90%",
                            height: "90%",
                            // display: "block",
                        }
                        : { display: "none" }
                }
            >
                <img src={assets.images.loading} style={{ marginTop: '-10%' }} />
                <h2 style={{ color: "white", marginTop: "-30%" }}>Getting Data</h2>
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
