import {Data} from "../components/data-table";

export interface HeadCell {
    id: keyof Data;
    label: string;
}

export interface DataItem {
    [key: string]: any;
}

export const getDynamicHeadCells = (data: DataItem[], numColumns: number): HeadCell[] => {
    if (data.length === 0) return [];

    const keys = Object.keys(data[0]);
    return keys.slice(0, numColumns).map(key => ({
        id: key as keyof Data,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    }));
};