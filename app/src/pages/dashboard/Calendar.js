import React from "react";
import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import timelinePlugin from "@fullcalendar/timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";
import plusFill from "@iconify/icons-eva/plus-fill";
import { useState, useRef, useEffect } from "react";
// import {
//   Scheduler,
//   MonthView,
//   Appointments,
//   Toolbar,
//   DateNavigator,
//   AppointmentTooltip,
//   AppointmentForm,
//   EditRecurrenceMenu,
//   Resources,
//   DragDropProvider,
//   ViewState,
//   EditingState,
// } from "@devexpress/dx-react-scheduler-material-ui";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import classNames from "clsx";
// material
import { useTheme } from "@material-ui/core/styles";
import {
  Card,
  Button,
  Container,
  DialogTitle,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import {
  darken,
  alpha,
  lighten,
} from "@material-ui/core/styles/colorManipulator";
import ReactDOM from "react-dom";
import Opacity from "@material-ui/icons/Opacity";
import WbSunny from "@material-ui/icons/WbSunny";
import Typography from "@material-ui/core/Typography";
import TableCell from "@material-ui/core/TableCell";
import ColorLens from "@material-ui/icons/ColorLens";
import FilterDrama from "@material-ui/icons/FilterDrama";
// redux
import { useDispatch, useSelector } from "../../redux/store";
import {
  getEvents,
  openModal,
  closeModal,
  updateEvent,
  selectEvent,
  selectRange,
} from "../../redux/slices/calendar";

// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Page from "../../components/Page";
import { DialogAnimate } from "../../components/animate";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {
  CalendarForm,
  CalendarStyle,
  CalendarToolbar,
  CalendarStyle2,
} from "../../components/_dashboard/calendar";
import Appbar from "../../components/Appbar";
import ColorSinglePicker from "../../components/ColorSinglePicker";
import styled from "@emotion/styled";
// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  "#00AB55", // theme.palette.primary.main,
  "#1890FF", // theme.palette.info.main,
  "#94D82D", // theme.palette.success.main,
  "#FFC107", // theme.palette.warning.main,
  "#FF4842", // theme.palette.error.main
  "#04297A", // theme.palette.info.darker
  "#7A0C2E", // theme.palette.error.darker
];

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};
const getBorder = (theme) =>
  `1px solid ${
    theme.palette.type === "light"
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68)
  }`;

const styles = (theme) => ({
  cell: {
    color: "#78909C!important",
    position: "relative",
    userSelect: "none",
    verticalAlign: "top",
    padding: 0,
    height: 100,
    borderLeft: getBorder(theme),
    "&:first-child": {
      borderLeft: "none",
    },
    "&:last-child": {
      paddingRight: 0,
    },
    "tr:last-child &": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: "white",
    },
    "&:focus": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      outline: 0,
    },
  },
  content: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
  },
  text: {
    padding: "0.5em",
    textAlign: "center",
  },
  sun: {
    color: "#FFEE58",
  },
  cloud: {
    color: "#90A4AE",
  },
  rain: {
    color: "#4FC3F7",
  },
  sunBack: {
    backgroundColor: "#FFFDE7",
  },
  cloudBack: {
    backgroundColor: "#ECEFF1",
  },
  rainBack: {
    backgroundColor: "#E1F5FE",
  },
  opacity: {
    opacity: "0.5",
  },
  appointment: {
    borderRadius: "10px",
    "&:hover": {
      opacity: 0.6,
    },
  },
  apptContent: {
    "&>div>div": {
      whiteSpace: "normal !important",
      lineHeight: 1.2,
    },
  },
  flexibleSpace: {
    flex: "none",
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
  },
  tooltipContent: {
    padding: theme.spacing(3, 1),
    paddingTop: 0,
    backgroundColor: theme.palette.background.paper,
    boxSizing: "border-box",
    width: "400px",
  },
  tooltipText: {
    ...theme.typography.body2,
    display: "inline-block",
  },
  title: {
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  icon: {
    color: theme.palette.action.active,
    verticalAlign: "middle",
  },
  circle: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    verticalAlign: "super",
  },
  textCenter: {
    textAlign: "center",
  },
  dateAndTitle: {
    lineHeight: 1.1,
  },
  titleContainer: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    paddingBottom: theme.spacing(1.5),
  },
});
export const StyleWrapper = styled.div``;

export default function Calendar() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const calendarRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isMobile ? "dayGridMonth" : "dayGridMonth");
  const selectedEvent = useSelector(selectedEventSelector);
  const [data, setData] = useState({});
  const { events, isOpenModal, selectedRange } = useSelector(
    (state) => state.calendar
  );

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? "dayGridMonth" : "dayGridMonth";
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
      enqueueSnackbar("Update event success", { variant: "success" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
      enqueueSnackbar("Update event success", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const [search, setsearch] = useState("John Doe");

  useEffect(() => {
    console.log(search);
  }, [search]);

  const resources = [
    {
      fieldName: "ownerId",
      title: "Owners",
      instances: [
        {
          text: "Andrew Glover",
          id: 1,
          color: "#7E57C2",
        },
        {
          text: "Arnie Schwartz",
          id: 2,
          color: "#FF7043",
        },
        {
          text: "John Heart",
          id: 3,
          color: "#E91E63",
        },
        {
          text: "Taylor Riley",
          id: 4,
          color: "#E91E63",
        },
        {
          text: "Brad Farkus",
          id: 5,
          color: "#AB47BC",
        },
        {
          text: "Arthur Miller",
          id: 6,
          color: "#FFA726",
        },
      ],
    },
  ];
  function renderEventContent(eventInfo) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <center>{eventInfo.event._def.title}</center>
      </div>
    );
  }
  const commitChanges = ({ added, changed, deleted }) => {
    this.setState((state) => {
      let Data = data;
      if (added) {
        const startingAddedId =
          Data.length > 0 ? Data[Data.length - 1].id + 1 : 0;
        Data = [...Data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        Data = Data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        Data = Data.filter((appointment) => appointment.id !== deleted);
      }
      return { Data };
    });
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Event Details</DialogTitle>
        <DialogContent>
          <center>
            <img
              alt="Icon"
              src="https://img.icons8.com/fluency/48/000000/star.png"
            />
          </center>

          <TextField
            sx={{ mt: 4 }}
            value="Title Test"
            fullWidth
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />

          <TextField
            sx={{ mt: 4 }}
            multiline
            rows={4}
            value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            fullWidth
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />

          <FormControlLabel
            sx={{ mt: 4 }}
            control={<Switch checked={true} />}
            label="All day"
          />

          <TextField
            sx={{ mt: 4 }}
            value="27/11/2021 07:48 AM"
            fullWidth
            id="outlined-basic"
            label="Start Date"
            variant="outlined"
          />

          <TextField
            sx={{ mt: 4 }}
            value="27/11/2021 07:48 AM"
            fullWidth
            id="outlined-basic"
            label="End Date"
            variant="outlined"
          />

          <ColorSinglePicker sx={{ mt: 4 }} colors={COLOR_OPTIONS} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Page title="Calendar">
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading="Calendar"
            links={[
              { name: "Dashboard", href: "/dashboard/contacts" },
              { name: "Calendar" },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Icon icon={plusFill} width={20} height={20} />}
                onClick={handleAddEvent}
              >
                New Event
              </Button>
            }
          />

          <Autocomplete
            id="combo-box-demo"
            freeSolo
            options={top100Films}
            onChange={(event, newValue) => {
              setsearch(newValue.title);
            }}
            getOptionLabel={(option) => option.title}
            fullWidth
            style={{ marginBottom: "10px" }}
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="outlined" />
            )}
          />

          {search === "John Doe" ? (
            <>
              <h2 style={{ marginTop: "2rem" }}>Calender 1</h2>
              <Card>
                <CalendarStyle>
                  <CalendarToolbar
                    date={date}
                    view={view}
                    onNextDate={handleClickDateNext}
                    onPrevDate={handleClickDatePrev}
                    onToday={handleClickToday}
                    onChangeView={handleChangeView}
                  />
                  <StyleWrapper>
                    <FullCalendar
                      weekends
                      editable
                      droppable
                      selectable
                      events={[
                        {
                          title: "🌀",
                          date: "2022-05-02",
                          backgroundColor: "white",
                          textColor: "red",
                        },
                        {
                          title: "🌟",
                          date: "2022-05-10",
                          backgroundColor: "white",
                          textColor: "green",
                        },
                        {
                          title: "🌀",
                          date: "2022-05-12",
                          backgroundColor: "white",
                          textColor: "gray",
                        },
                        {
                          title: "🌟",
                          date: "2022-05-22",
                          backgroundColor: "white",
                          textColor: "yellow",
                        },
                        {
                          title: "🌀",
                          date: "2022-05-18",
                          backgroundColor: "white",
                          textColor: "blue",
                        },
                        {
                          title: "🌟",
                          date: "2022-05-28",
                          backgroundColor: "white",
                          textColor: "red",
                        },
                      ]}
                      ref={calendarRef}
                      rerenderDelay={10}
                      initialDate={date}
                      initialView={view}
                      dayMaxEventRows={3}
                      eventDisplay="block"
                      headerToolbar={false}
                      allDayMaintainDuration
                      eventResizableFromStart
                      select={handleSelectRange}
                      eventDrop={handleDropEvent}
                      eventClick={handleClickOpen}
                      eventResize={handleResizeEvent}
                      height={isMobile ? "auto" : 720}
                      plugins={[
                        listPlugin,
                        dayGridPlugin,
                        timelinePlugin,
                        timeGridPlugin,
                        interactionPlugin,
                      ]}
                      eventContent={renderEventContent}
                    />
                  </StyleWrapper>
                </CalendarStyle>
              </Card>

              <h2 style={{ marginTop: "2rem" }}>Calender 2</h2>
              <Card>
                <CalendarStyle2>
                  <CalendarToolbar
                    date={date}
                    view={view}
                    onNextDate={handleClickDateNext}
                    onPrevDate={handleClickDatePrev}
                    onToday={handleClickToday}
                    onChangeView={handleChangeView}
                  />
                  <FullCalendar
                    weekends
                    editable
                    droppable
                    selectable
                    events={events}
                    ref={calendarRef}
                    rerenderDelay={10}
                    initialDate={date}
                    initialView={view}
                    dayMaxEventRows={3}
                    eventDisplay="block"
                    headerToolbar={false}
                    allDayMaintainDuration
                    eventResizableFromStart
                    select={handleSelectRange}
                    eventDrop={handleDropEvent}
                    eventClick={handleSelectEvent}
                    eventResize={handleResizeEvent}
                    height={isMobile ? "auto" : 720}
                    plugins={[
                      listPlugin,
                      dayGridPlugin,
                      timelinePlugin,
                      timeGridPlugin,
                      interactionPlugin,
                    ]}
                  />
                </CalendarStyle2>
              </Card>
            </>
          ) : (
            <>
              <h2>Calender 1</h2>
              <Card>
                <CalendarStyle>
                  <CalendarToolbar
                    date={date}
                    view={view}
                    onNextDate={handleClickDateNext}
                    onPrevDate={handleClickDatePrev}
                    onToday={handleClickToday}
                    onChangeView={handleChangeView}
                  />
                  <FullCalendar
                    weekends
                    editable
                    droppable
                    selectable
                    events={[
                      {
                        title: "🌀",
                        date: "2022-05-02",
                        backgroundColor: "white",
                        textColor: "red",
                      },
                      {
                        title: "🌟",
                        date: "2022-05-10",
                        backgroundColor: "white",
                        textColor: "green",
                      },
                      {
                        title: "🌀",
                        date: "2022-05-12",
                        backgroundColor: "white",
                        textColor: "gray",
                      },
                      {
                        title: "🌟",
                        date: "2022-05-09",
                        backgroundColor: "white",
                        textColor: "yellow",
                      },
                      {
                        title: "🌀",
                        date: "2022-05-18",
                        backgroundColor: "white",
                        textColor: "blue",
                      },
                      {
                        title: "🌟",
                        date: "2022-05-016",
                        backgroundColor: "white",
                        textColor: "red",
                      },
                    ]}
                    ref={calendarRef}
                    rerenderDelay={10}
                    initialDate={date}
                    initialView={view}
                    dayMaxEventRows={3}
                    eventDisplay="block"
                    headerToolbar={false}
                    allDayMaintainDuration
                    eventResizableFromStart
                    select={handleSelectRange}
                    eventDrop={handleDropEvent}
                    eventClick={handleClickOpen}
                    eventResize={handleResizeEvent}
                    height={isMobile ? "auto" : 720}
                    plugins={[
                      listPlugin,
                      dayGridPlugin,
                      timelinePlugin,
                      timeGridPlugin,
                      interactionPlugin,
                    ]}
                    eventContent={renderEventContent}
                  />
                </CalendarStyle>
              </Card>

              <h2 style={{ marginTop: "2rem" }}>Calender 2</h2>
              <Card>
                <CalendarStyle2>
                  <CalendarToolbar
                    date={date}
                    view={view}
                    onNextDate={handleClickDateNext}
                    onPrevDate={handleClickDatePrev}
                    onToday={handleClickToday}
                    onChangeView={handleChangeView}
                  />
                  <FullCalendar
                    weekends
                    editable
                    droppable
                    selectable
                    events={events}
                    ref={calendarRef}
                    rerenderDelay={10}
                    initialDate={date}
                    initialView={view}
                    dayMaxEventRows={3}
                    eventDisplay="block"
                    headerToolbar={false}
                    allDayMaintainDuration
                    eventResizableFromStart
                    select={handleSelectRange}
                    eventDrop={handleDropEvent}
                    eventClick={handleSelectEvent}
                    eventResize={handleResizeEvent}
                    height={isMobile ? "auto" : 720}
                    plugins={[
                      listPlugin,
                      dayGridPlugin,
                      timelinePlugin,
                      timeGridPlugin,
                      interactionPlugin,
                    ]}
                  />
                </CalendarStyle2>
              </Card>
            </>
          )}

          <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>

            <CalendarForm
              event={selectedEvent}
              range={selectedRange}
              onCancel={handleCloseModal}
            />
          </DialogAnimate>
        </Container>
      </Page>
      <Appbar />
    </>
  );
}

const top100Films = [
  { title: "John Doe", year: 1994 },
  { title: "Mickle Ckark", year: 1972 },
];
