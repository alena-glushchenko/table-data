import React, {useCallback} from "react";
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {Data} from "./data-table";
import {getDynamicHeadCells} from "../utils/get-dynamic-head-cells";

interface EnhancedTableHeadProps {
    order: 'asc' | 'desc';
    orderBy: string;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    data: Data[]
}

//статичные данные, если нужно не динамическое решение
// const headCells: HeadCell[] = [
//     {id: 'articlename', label: 'Article Name'},
//     {id: "articleid", label: "Article Id"},
//     {id: "subarticleid", label: "Subarticle Id"},
//     {id: 'external_str_id', label: 'External ID'},
//     {id: 'ecrlongname', label: 'ECR Long Name'},
// ];

export const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
    const {order, orderBy, onRequestSort, data} = props;

    const headCells= getDynamicHeadCells(data, 5);

    const createSortHandler =
        useCallback((property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        }, [onRequestSort]);

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}