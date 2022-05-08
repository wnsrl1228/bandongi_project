import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Button,
    Typography,
    Box,
    AppBar,
    Toolbar,
    InputBase,
    Container,
    Link
} from '@mui/material';
import { Link as RouterLink} from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
const Search = styled('div')(({ theme }) => ({
    padding: theme.spacing(1,0.5,0.5,0),
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(3),
    paddingLeft: theme.spacing(5), 
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0.5, 2),
    position: 'absolute',
    right:'80%',
    pointerEvents: 'none',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
}));
export default function NavbarComponent() {
    return (
        
        <Box sx={{ flexGrow: 1 }}>
            
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                <Container fixed>
                    <Toolbar fixed>
                        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                            <Link component={RouterLink} to="/"  underline="none" style={{color:"white"}}>
                                반동이
                            </Link>
                        </Typography>
                        <Search sx={{  display: { xs: 'none',md: 'block' } }}>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="검색"
                                inputProps={{ 'aria-label': 'search' }}/>
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none',sm: 'block' } }}>
                            <Link  component={RouterLink} to="/login" underline="none" style={{color:"white"}}>
                                <Button   color="inherit">
                                    로그인
                                </Button>
                            </Link>
                        </Box>
                        
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Link component={RouterLink}  to="/join" underline="none" style={{color:"white"}}>
                                <Button color="inherit">회원가입</Button>
                            </Link>
                        </Box>
                        
                    </Toolbar>
                    </Container>
            </AppBar>
            
        </Box>
    )
}