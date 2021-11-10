import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
const useStyles = makeStyles((theme) => ({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
}));
const Appbar = () => {
    const classes = useStyles();
    return (
        <>
        <CssBaseline />
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
            <IconButton size="large" href="/dashboard/contacts" edge="start" color="inherit" aria-label="open drawer">
                <HomeIcon />
            </IconButton>
            <IconButton size="large" href="/dashboard/calendar" color="inherit">
                <EventAvailableIcon />
            </IconButton>
            <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                <AddIcon />
            </Fab>
            <div className={classes.grow} />
            <IconButton size="large" color="inherit">
                <TimelineIcon />
            </IconButton>
            <IconButton size="large" edge="end" color="inherit">
                <SettingsIcon />
            </IconButton>
            </Toolbar>
        </AppBar>
        </>
    )
}
export default Appbar