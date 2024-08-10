import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const EnhancedTableToolbar = () => {
    return (
        <Toolbar>
            <Typography variant="h6" component="div">
                Data Table
            </Typography>
        </Toolbar>
    );
}