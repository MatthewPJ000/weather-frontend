import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import "./index.css"
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useDispatch, useSelector, Provider } from 'react-redux';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}


export default function Dashboard({ handleListLayerItemSelected, handleAddWorkspaceClick }) {


  //------------ Redux ------------\\
  const queryData = useSelector((state) => state.myState.queryDataVariable)
  const currentLayerData = useSelector((state) => state.myState.currentLayerDataVariable)

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    console.log(queryData)
  }, [queryData])

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
      console.log(getDataFormat(currentLayerData.features[0].properties))
      setCurrentKey(getDataFormat(currentLayerData.features[0].properties))
    }
  }, [])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: 'black',
    color: 'white',
    maxWidth: '400px',
    textOverflow: 'ellipsis',
    textWrap: 'nowrap',
    overflow: 'hidden'
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
  const pData = [2400, 1398, 9800, 3908];
  const xLabels = [
    '2021',
    '2022',
    '2023',
    '2024'
  ];
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center' }}>
        <div>
          <div>Total</div>
          <div style={{ fontWeight: 'bold', fontSize: '30px' }}>{currentLayerData != null ? currentLayerData.features.length : 'No data selected'}</div>
        </div>
        <div>
          <div>Query Data</div>
          <div style={{ fontWeight: 'bold', fontSize: '30px' }}>{queryData != null ? queryData.length : 'No data selected'}</div>
        </div>
      </div>
      <div>
        {currentLayerData != null ? <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                  {currentKey.map((value, index) => (
                    <StyledTableCell

                      style={{ background: 'darkslategrey' }}
                    >
                      <Tooltip title={value} placement="top">
                        <div>{value}</div>
                      </Tooltip>
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {
                  (queryData != null ? queryData : currentLayerData.features)
                    // currentLayerData.features
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          {currentKey.map((key, index) => {
                            const value = row['properties'][key];
                            return (
                              <StyledTableCell key={index} style={{}}>
                                <Tooltip title={value} placement="top" >
                                  <div style={{ fontSize: 12 }}>{value}</div>
                                </Tooltip>
                              </StyledTableCell>
                            );
                          })}
                        </StyledTableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={(queryData != null ? queryData : currentLayerData.features).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                backgroundColor: 'black',
                color: 'white' // Set the background color of the pagination
              },
            }}
          />
        </Paper> : ""}

      </div>
      <div style={{display : 'flex', flexDirection : 'row'}}>
        <PieChart
          sx={{
            color: 'white'
          }}
          series=
          {[
            {
              data: [
                { id: 0, value: 10, label: '2024' },
                { id: 1, value: 15, label: '2023' },
                { id: 2, value: 20, label: '2022' },
              ],
            },
          ]}
          width={400}
          height={200}
          labelStyle={{
            fill: 'white',
            fontSize: '10px'
          }}
        />
        <LineChart
          width={500}
          height={300}
          series={[
            { data: pData, label: 'pv' }
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
      </div>

    </div>
  );
}