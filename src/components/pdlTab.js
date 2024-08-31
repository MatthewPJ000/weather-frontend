import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Person, Home, Email, Phone, Search, Download } from '@mui/icons-material';
import Button from '@mui/material/Button';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Layers, } from '@mui/icons-material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import jsPDF from "jspdf";
import { useState } from 'react';


import PDLJS from 'peopledatalabs';
const PDLJSClient = new PDLJS({ apiKey: '491e0491a606e4dc3604086455359d0130733451fdc4ba35c9de97a05f06c7bc' });


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// const personData = ["matthew may", "michae", "James", "Victoria", "Steven"]

export default function PDLTabs() {
    const [value, setValue] = React.useState(0);
    const [selectedPerson, setselectedPerson] = React.useState(null);
    const handlePersonItemClick = (index, text) => {
        setselectedPerson(index);
    };

    const [selectedCompany, setselectedCompany] = React.useState(null);
    const handleCompanyItemClick = (index, text) => {
        setselectedCompany(index);
    };

    //--------**************   Person search engine  ***************-----------//

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [pSearchCount, setPSearchCount] = useState(0);
    const [searchPeopleData, setSearchPeopleData] = useState([]);

    const [pid, setPid] = useState("");
    const [pname, setPName] = useState("");
    const [paddress, setPaddress] = useState("");
    const [pemail, setPemail] = useState("");
    const [pphone, setPphone] = useState("");

    const [pfacebook_id, setPfacebook_id] = useState("");
    const [pfacebook_url, setPfacebook_url] = useState("");
    const [pfacebook_un, setPfacebook_un] = useState("");

    const [plinkdin_id, setPlinkdin_id] = useState("");
    const [plinkdin_url, setPlinkdin_url] = useState("");
    const [plinkdin_un, setPlinkdin_un] = useState("");

    const [ptwitter_url, setPtwitter_url] = useState("");
    const [ptwitter_un, setPtwitter_un] = useState("");

    const [pbMode, setPbMode] = useState("person");

    function makePersonQuery(
        name,
        address,
        email,
        phone
    ) {
        var query = "SELECT * FROM person WHERE ";
        if (name == "") {
            query += "";
        } else {
            query += `first_name = '${name}' `;
        }

        if (email == "") {
            query += "";
        } else {
            query += `AND personal_emails = '${email}' `;
        }

        if (phone == "") {
            query += "";
        } else {
            query += `AND phone_numbers = '${phone}' `;
        }

        if (address == "") {
            query += "";
        } else {
            query += `AND location_street_address = '${address}' `;
        }
        query = query.replace("WHERE AND", "WHERE");
        return query;
    }
    const clearPersonData = () => {
        setPid("");
        setPName("");
        setPaddress("");
        setPemail("");
        setPphone("");
        setPfacebook_id("");
        setPfacebook_url("");
        setPfacebook_un("");

        setPlinkdin_id("");
        setPlinkdin_url("");
        setPlinkdin_un("");

        setPtwitter_url("");
        setPtwitter_un("");
    };
    const getPersonData = () => {
        clearPersonData();
        const query = makePersonQuery(
            name,
            address,
            email,
            phoneNumber
        );
        console.log(query)
        PDLJSClient.person.search
            .sql({
                searchQuery: query,
                size: 5,
            })
            .then((data) => {
                setPSearchCount(data["total"]);
                setSearchPeopleData([]);
                setSearchPeopleData(data["data"]);
            })
            .catch((error) => {
                setPSearchCount(0);
                setSearchPeopleData([]);
                clearPersonData();
                console.log(error);
            });
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const displayPeopleData = (data) => {
        console.log(data)
        setPid("" + data["id"]);
        setPName("" + data["full_name"]);
        setPaddress("" + data["location_street_address"]);
        setPemail("" + data["personal_emails"]);
        setPphone("" + data["phone_numbers"]);
        setPfacebook_id("" + data["facebook_id"]);
        setPfacebook_url("" + data["facebook_url"]);
        setPfacebook_un("" + data["facebook_username"]);

        setPlinkdin_id("" + data["linkedin_id"]);
        setPlinkdin_url("" + data["linkedin_url"]);
        setPlinkdin_un("" + data["linkedin_username"]);

        setPtwitter_url("" + data["twitter_url"]);
        setPtwitter_un("" + data["twitter_username"]);

        // setIsSearchResult(true);
    };

    //-------*****************------------------ Company Search Engine ---------***************---------//

    const [cName, setCName] = useState("");
    const [cWebsite, setCWebsite] = useState("");
    const [cticker, setCticker] = useState("");
    const [cSearchCount, setCSearchCount] = useState(0);
    const [searchCompanyData, setSearchCompanyData] = useState([]);

    const [bid, setBid] = useState("");
    const [bname, setBname] = useState("");
    const [bfounded, setBfounded] = useState();
    const [bindustry, setBindustry] = useState("");
    const [bwebsite, setBwebsite] = useState("");
    const [bsummary, setBsummary] = useState("");

    const [blinkdin, setBlinkdin] = useState("");
    const [bfacebook, setBfacebook] = useState("");
    const [btwitter, setBtwitter] = useState("");
    const [bcrunchbase, setCrunchbase] = useState("");

    function makeCompanyQuery(name, ticker, website) {
        var query = "SELECT * FROM company WHERE ";

        if (name == "") {
            query += "";
        } else {
            query += `name = '${name}' `;
        }

        if (ticker == "") {
            query += "";
        } else {
            query += `AND ticker = '${ticker}' `;
        }

        if (website == "") {
            query += "";
        } else {
            query += `AND website = '${website}' `;
        }
        query = query.replace("WHERE AND", "WHERE");
        return query;
    }
    const clearCompanyData = () => {
        setBid("");
        setBname("");
        setBfounded(0);
        setBindustry("");
        setBwebsite("");
        setBsummary("");

        setBlinkdin("");
        setBfacebook("");
        setBtwitter("");
        setCrunchbase("");
    };
    const getCompanyData = () => {
        clearCompanyData();
        const query = makeCompanyQuery(cName, cticker, cWebsite);
        console.log(query)
        PDLJSClient.company.search
            .sql({
                searchQuery: query,
                size: 5,
            })
            .then((data) => {
                setCSearchCount(data["total"]);
                setSearchCompanyData(data.data);
            })
            .catch((error) => {
                setCSearchCount(0);
                clearCompanyData();
                console.log(error);
            });
    };
    const displayCompanyData = (data) => {
        setBid(data.id);
        setBname(data.name);
        setBfounded(data.founded);
        setBindustry(data.industry);
        setBwebsite(data.website);
        setBsummary(data.summary);

        setBlinkdin(data.linkedin_url);
        setBfacebook(data.facebook_url);
        setBtwitter(data.twitter_url);
        setCrunchbase(data.profiles?.at(4));
    };
    //---------------************ Download PDF for People and Complan Data *************\\
    const handleGeneratePdf = () => {
        const pdf = new jsPDF("p", "mm", [1000, 750]);

        // Adding the fonts.
        pdf.setFont("Inter-Regular", "normal");

        const input = document.getElementsByClassName("PBData")[0];
        const el1 = input;
        el1.style.color = "black";

        pdf.html(el1, {
            async callback(pdf) {
                pdf.save("report.pdf");
                el1.style.color = "white";
            },
        });
    };
    const handleGenerateCompanyPdf = () => {
        const pdf = new jsPDF("p", "mm", [1000, 750]);

        // Adding the fonts.
        pdf.setFont("Inter-Regular", "normal");

        const input = document.getElementsByClassName("PBCData")[0];
        const el1 = input;
        el1.style.color = "black";

        pdf.html(el1, {
            async callback(pdf) {
                pdf.save("report.pdf");
                el1.style.color = "white";
            },
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} style={{ borderBottom: '1px solid white' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                    <Tab label="Person" {...a11yProps(0)} style={{ color: 'white' }} />
                    <Tab label="Company" {...a11yProps(1)} style={{ color: 'white' }} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid white' }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, },
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                width: '30%',
                                padding: '30px',
                                borderRight: '1px solid white'
                                // Set the text color to white
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Typography style={{ textAlign: 'center' }}>
                                Query
                            </Typography>
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
                                    Name
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <Person />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                    label="Name"
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
                                    Address
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <Home />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value) }}
                                    label="Address"
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
                                    Phone
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <Phone />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={phoneNumber}
                                    onChange={(e) => { setPhoneNumber(e.target.value) }}
                                    label="Phone"
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
                                    Email
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <Email />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    label="Email"
                                />
                            </FormControl>

                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper', background: 'transparent' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                className='layerList'
                            >
                                {searchPeopleData.map((data, index) => (
                                    <ListItemButton
                                        key={index}
                                        style={{
                                            borderBottom: '1px solid white',
                                            backgroundColor: selectedPerson === index ? 'darkcyan' : 'transparent',
                                        }}
                                        onClick={() => {
                                            handlePersonItemClick(index, data)
                                            displayPeopleData(data)
                                        }}
                                    >
                                        <ListItemIcon>
                                            <AccessibilityIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={data.full_name} />
                                    </ListItemButton>
                                ))}
                            </List>

                        </Box>
                        <div style={{ width: '70%', padding: '30px' }} className='PBData'>
                            <Typography style={{ textAlign: 'center' }}>
                                Identity Details
                            </Typography>
                            <div>
                                <div style={{ marginTop: '20px' }}>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            padding: "5px",
                                            borderBottom: "0.05em solid",
                                            borderTop: "0.05em solid",
                                        }}
                                    >
                                        PERSONAL INFORMATION
                                        <br />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            padding: "15px",
                                        }}
                                    >
                                        <div style={{ width: "10%", marginLeft: "3%" }}>
                                            ID:
                                            <br />
                                            Name:
                                            <br />
                                            Address:
                                            <br />
                                            Emails:
                                            <br />
                                            Phone:
                                        </div>
                                        <div style={{ width: "85%", marginLeft: "25px" }}>
                                            <div>{pid}</div>
                                            <div>{pname}</div>
                                            <div>{paddress}</div>
                                            <div style={{ width: "100%", overflowX: "hidden" }}>
                                                {pemail}
                                            </div>
                                            <div style={{ width: "100%", overflowX: "hidden" }}>
                                                {pphone}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            padding: "5px",
                                            borderBottom: "0.05em solid",
                                            borderTop: "0.05em solid",
                                        }}
                                    >
                                        SOCIAL MEDIA INFORMATION
                                        <br />
                                    </div>
                                    <div style={{ padding: "15px" }}>
                                        <div>
                                            <div style={{ marginLeft: "3%" }}>Facebook:</div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div
                                                    style={{
                                                        width: "10%",
                                                        marginLeft: "5%",
                                                        padding: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    ID:
                                                    <br />
                                                    URL:
                                                    <br />
                                                    Username:
                                                </div>
                                                <div
                                                    style={{
                                                        padding: "10px",
                                                        marginLeft: "25px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <div>{pfacebook_id}</div>
                                                    <div>{pfacebook_url}</div>
                                                    <div>{pfacebook_un}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ marginLeft: "3%" }}>LinkedIn:</div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div
                                                    style={{
                                                        width: "10%",
                                                        marginLeft: "5%",
                                                        padding: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    ID:
                                                    <br />
                                                    URL:
                                                    <br />
                                                    Username:
                                                </div>
                                                <div
                                                    style={{
                                                        padding: "10px",
                                                        marginLeft: "25px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <div>{plinkdin_id}</div>
                                                    <div>{plinkdin_url}</div>
                                                    <div>{plinkdin_un}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginLeft: "3%" }}>Twitter:</div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div
                                                    style={{
                                                        width: "10%",
                                                        marginLeft: "5%",
                                                        padding: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    URL:
                                                    <br />
                                                    Username:
                                                </div>
                                                <div
                                                    style={{
                                                        padding: "10px",
                                                        marginLeft: "25px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <div>{ptwitter_url}</div>
                                                    <div>{ptwitter_un}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white' }} onClick={getPersonData}>
                            Search
                        </Button>
                        <Button variant="outlined" startIcon={<Download />} style={{ marginLeft: '30px', borderColor: 'white' }} onClick={handleGeneratePdf}>
                            Download
                        </Button>
                    </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid white' }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, },
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                width: '30%',
                                padding: '30px',
                                borderRight: '1px solid white'
                                // Set the text color to white
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Typography style={{ textAlign: 'center' }}>
                                Query
                            </Typography>
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
                                    Name
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <HomeWorkIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={cName}
                                    onChange={(e) =>{setCName(e.target.value)}}
                                    label="Name"
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
                                    Ticker
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <DoneAllIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={cticker}
                                    onChange={(e) =>{setCticker(e.target.value)}}
                                    label="Ticker"
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
                                    Website
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    style={{ paddingLeft: 0, color: 'white' }}
                                    startAdornment={
                                        <InputAdornment position="end" style={{ color: 'white', marginLeft: 0 }}>
                                            <IconButton aria-label="toggle password Person" edge="end">
                                                <WebAssetIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={cWebsite}
                                    onChange={(e) =>{setCWebsite(e.target.value)}}
                                    label="Website"
                                />
                            </FormControl>

                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper', background: 'transparent' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                className='layerList'
                            >
                                {searchCompanyData.map((data, index) => (
                                    <ListItemButton
                                        key={index}
                                        style={{
                                            borderBottom: '1px solid white',
                                            backgroundColor: selectedPerson === index ? 'darkcyan' : 'transparent',
                                        }}
                                        onClick={() => {
                                            handleCompanyItemClick(index, data)
                                            displayCompanyData(data)
                                        }}
                                    >
                                        <ListItemIcon>
                                            <AccessibilityIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={data.id} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                        <div style={{ width: '100%' }} className='PBCData'>
                            <div
                                style={{
                                    fontSize: "24px",
                                    lineHeight: "45px",
                                    width: "100%",
                                    height: "50px",
                                    textAlign: "center",
                                    paddingTop: "10px",
                                }}
                            >
                                Company Details.
                            </div>
                            <div style={{ padding: "20px" }}>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "5px",
                                        borderBottom: "0.05em solid",
                                        borderTop: "0.05em solid",
                                    }}
                                >
                                    BUSINESS INFORMATION
                                    <br />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: "15px",
                                    }}
                                >
                                    <div style={{ width: "10%", marginLeft: "3%" }}>
                                        ID:
                                        <br />
                                        Name:
                                        <br />
                                        Founded:
                                        <br />
                                        Industry:
                                        <br />
                                        Website:
                                        <br />
                                        Summary:
                                    </div>
                                    <div style={{ marginLeft: "25px" }}>
                                        <div>{bid}</div>
                                        <div>{bname}</div>
                                        <div>{bfounded}</div>
                                        <div>{bindustry}</div>
                                        <div>{bwebsite}</div>
                                        <div>{bsummary}</div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "5px",
                                        borderBottom: "0.05em solid",
                                        borderTop: "0.05em solid",
                                    }}
                                >
                                    SOCIAL MEDIA INFORMATION
                                    <br />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: "15px",
                                    }}
                                >
                                    <div style={{ width: "10%", marginLeft: "3%" }}>
                                        Linkdlin:
                                        <br />
                                        Facebook:
                                        <br />
                                        Twitter:
                                        <br />
                                        Crunch:
                                    </div>
                                    <div style={{ marginLeft: "25px" }}>
                                        <div>{blinkdin}</div>
                                        <div>{bfacebook}</div>
                                        <div>{btwitter}</div>
                                        <div>{bcrunchbase}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{ width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="outlined" startIcon={<Search />} style={{ borderColor: 'white' }} onClick={getCompanyData}>
                            Search
                        </Button>
                        <Button variant="outlined" startIcon={<Download />} style={{ marginLeft: '30px', borderColor: 'white' }} onClick={handleGenerateCompanyPdf}>
                            Download
                        </Button>
                    </div>
                </div>
            </CustomTabPanel>
        </Box>
    );
}
