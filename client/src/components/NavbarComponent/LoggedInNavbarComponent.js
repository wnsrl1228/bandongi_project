import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Button,
    Typography,
    Box,
    AppBar,
    Toolbar,
    InputBase,
    Container,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Link
} from '@mui/material';
import { Link as RouterLink} from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';

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

export default function LoggedInNavbarComponent() {
    const [anchorE1, setAnchorE1] = useState(null);
    const open = Boolean(anchorE1);
    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorE1(null);
    };
    const renderMobileMenu = (
        <Menu
            anchorEl={anchorE1}
            anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}
            keepMounted
            transformOrigin={{vertical: 'top',horizontal: 'right',}}
            open={open}
            onClick={handleClose}
            onClose={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&:before': {
                        content: '""',display: 'block',position: 'absolute',top: 0,right: 14,width: 10,
                        height: 10,bgcolor: 'background.paper',transform: 'translateY(-50%) rotate(45deg)',zIndex: 0,
                    },
                },
            }}
        >
            <MenuItem>
                <ListItemIcon>
                    <PersonIcon fontSize="small" /> 
                </ListItemIcon>
                프로필 수정
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                글 관리
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <GroupIcon fontSize="small" />
                </ListItemIcon>
                친구 목록
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                로그아웃
            </MenuItem>
        </Menu>
    );
    return (
        <Box sx={{ flexGrow: 1}}>
            
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                <Container fixed>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ mr: 2,whiteSpace : "nowrap"}}>
                            <Link component={RouterLink} to="/" underline="none" style={{color:"white"}}>반동이</Link>
                        </Typography>
                        <Search sx={{  display: { xs: 'none',md: 'block' } }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="검색"
                                inputProps={{ 'aria-label': 'search' }}/>
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none',sm: 'block' } }}>
                            <IconButton
                                
                                onClick={handleClick}
                                size="large"
                                sx={{ ml: 2 ,mr:2, borderRadius:'10%', }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >   
                                <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                                <Typography sx={{ ml: 1,whiteSpace : "nowrap",color:'white'}}>
                                    김준기
                                </Typography>
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {renderMobileMenu}
                        </Box> 
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>

                            <IconButton
                                    size="large"
                                    aria-label="message"
                                    sx={{  color:'white',borderRadius:'10%', }}>   
                                    <ChatIcon fontSize="large"/>
                            </IconButton>
                        
                        </Box>   
                    </Toolbar>
                    </Container>
            </AppBar>
        </Box>

    )
}