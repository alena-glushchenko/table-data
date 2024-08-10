import React, {useCallback, useEffect, useMemo} from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {EnhancedTableHead} from "./enhanced-table-head";
import {TableRowComponent} from "./table-row-component";
import {EnhancedTableToolbar} from "./enhanced-table-toolbar";

export interface Data {
    articleid: string;
    subarticleid: string;
    articlename: string;
    external_str_id: string;
    ecrlongname: string;
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const DataTable = () => {
    const [data, setData] = React.useState<Data[]>([]);
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('articlename' as keyof Data);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [dense, setDense] = React.useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8085/api/data');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRequestSort = useCallback((event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }, [order, orderBy]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    }, []);

    const sortedRows = useMemo(() => {
        const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        return stableSort(visibleRows, getComparator(order, orderBy))
    }, [data, page, rowsPerPage, order, orderBy]);

    const emptyRows = useMemo(() => {
        return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    }, [page, rowsPerPage, data]);

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar/>
                <TableContainer>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            data={data}
                        />
                        <TableBody>
                            {sortedRows.map((row) => (
                                <TableRowComponent key={row.subarticleid} row={row}/>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15, 25, 50]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Dense padding"
                style={{marginLeft: '0.5rem'}}
            />
        </Box>
    )
}