import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';

const SearchBar = ({ placeholder, onChange, searchBarWidth }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: "10px" }}>
            <SearchIcon sx={{ marginRight: '10px'}} />
            <Input
                placeholder={placeholder}
                onChange={onChange}
                sx={{width: searchBarWidth, color: "black", fontSize: '1.1rem', background: "white"}}
                disableUnderline
            />
        </Box>
    )
}

export default SearchBar