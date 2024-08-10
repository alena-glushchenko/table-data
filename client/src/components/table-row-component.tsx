import React from "react";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {Data} from "./data-table";

interface TableRowComponentProps {
    row: Data;
}

export const TableRowComponent = ({row}: TableRowComponentProps) => {
    return (
        <TableRow hover>
            <TableCell>{row.articlename}</TableCell>
            <TableCell>{row.articleid}</TableCell>
            <TableCell>{row.subarticleid}</TableCell>
            <TableCell>{row.external_str_id}</TableCell>
            <TableCell>{row.ecrlongname}</TableCell>
        </TableRow>
    );
}