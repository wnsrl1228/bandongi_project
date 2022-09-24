
import {React,useState} from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import { 
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link
} from '@mui/material';
import { Link as RouterLink} from "react-router-dom";
const drawerWidth = 240;

function SidebarComponent(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const sideList = (
        <List>
            {["반려동물 친구 만들기", "내 자식 자랑하기", "묻고 답하기", "꿀팁 전수"].map((text, index) => (
              <div key={text}>

                {
                  text === "반려동물 친구 만들기" && 
                  <ListItem button component="a" href="/friend-make">
                    <PetsIcon />
                        <ListItemText primary={text}  />  
                  </ListItem>
                }
                {
                  
                  text === "내 자식 자랑하기" && 
                  <ListItem button component="a" href="/show-off">
                    <PetsIcon />
                        <ListItemText primary={text}  />  
                  </ListItem>
                }          
                {
                  text === "묻고 답하기" && 
                  <ListItem button component="a" href="/qna">
                    <PetsIcon />
                        <ListItemText primary={text}  />  
                  </ListItem>
                  
                }
                {
                  text === "꿀팁 전수" && 
                  <ListItem button component="a" href="/tips">
                    <PetsIcon />
                        <ListItemText primary={text}  />  
                  </ListItem>
                }
            
              </div>
          
            ))}
        </List>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
      <Box sx={{ display: 'flex',flexFrow:1}}>

            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                
                onClick={handleDrawerToggle}
                sx={{ ml:{xs:12,sm:2}, mt:1,
                      color:'white',
                      display: { md: 'none' } ,
                      position:"fixed",
                      zIndex: (theme) => theme.zIndex.drawer + 2,
                    }}
            >
                <MenuIcon />
            </IconButton>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, 
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'block',md:'none'},
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                  <Toolbar />
                  <Toolbar />
                  {sideList}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                          display: { xs: 'none', md: 'block' },
                          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                  >
                    <Toolbar />
                    <Toolbar />
                    {sideList}
                </Drawer>
            </Box>
        </Box>
    )
}

//반응형
SidebarComponent.propTypes = {

  window: PropTypes.func,
};

export default SidebarComponent;