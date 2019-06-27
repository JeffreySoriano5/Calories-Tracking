import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import flow from 'lodash/flow';
import {withStyles} from '@material-ui/core/styles';
import {withAxios} from 'react-axios';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MealIcon from '@material-ui/icons/Fastfood';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import UsersIcon from '@material-ui/icons/People';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {connect} from 'react-redux';
import {logout} from 'common/redux/actions/auth'
import {accountConnector, hasPermissions} from 'common/utils';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

class TopMenu extends React.Component {
  state = {
    open: false,
  };

  onLogout = () => {
    this.props.axios.post('/auth/logout').then(() => {
      this.props.logout();
      this.props.history.push('/login');
    });
  };

  handleDrawerOpen = () => {
    this.setState({open: true})
  };

  handleDrawerClose = () => {
    this.setState({open: false})
  };

  redirect = (to) => {
    return () => {
      this.props.history.push(to);
    }
  };

  render() {
    const {classes, user} = this.props;

    const open = this.state.open;
    const {pathname} = this.props.location;

    return (
      <React.Fragment>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap>
              Calo Tracking
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          open={open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
          <Divider/>
          <List>
            <ListItem button key='meals' selected={pathname === '/'} onClick={this.redirect('/')}>
              <ListItemIcon><MealIcon/> </ListItemIcon>
              <ListItemText primary='Meals'/>
            </ListItem>
            {hasPermissions(user, ['read_user']) &&
            <ListItem
              button
              key='users'
              selected={pathname === '/users'}
              onClick={this.redirect('/users')}
            >
              <ListItemIcon> <UsersIcon/></ListItemIcon>
              <ListItemText primary='Users'/>
            </ListItem>
            }
            <ListItem button key='profile' selected={pathname === '/profile'} onClick={this.redirect('/profile')}>
              <ListItemIcon> <ProfileIcon/></ListItemIcon>
              <ListItemText primary='Profile'/>
            </ListItem>
            <Divider/>
            <ListItem button key='logout' onClick={this.onLogout}>
              <ListItemIcon><LogoutIcon/> </ListItemIcon>
              <ListItemText primary={'Logout'}/>
            </ListItem>
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

TopMenu.propTypes = {
  history: PropTypes.object.isRequired,
  axios: PropTypes.object,
  logout: PropTypes.func,
  classes: PropTypes.object,
  user: PropTypes.object,
  location: PropTypes.object,
};

const logoutConnector = connect(null, {logout});

export default flow(
  withStyles(styles),
  logoutConnector,
  accountConnector,
  withRouter,
  withAxios,
)(TopMenu);
