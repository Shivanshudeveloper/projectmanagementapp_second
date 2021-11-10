import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useRef, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, Button, Container, DialogTitle, useMediaQuery } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getEvents, openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../components/_dashboard/calendar';
import Appbar from '../../components/Appbar';

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

export default function Calendar() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isMobile ? 'dayGridMonth' : 'dayGridMonth');
  const selectedEvent = useSelector(selectedEventSelector);
  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'dayGridMonth' : 'dayGridMonth';
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
          end: event.end
        })
      );
      enqueueSnackbar('Update event success', { variant: 'success' });
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
          end: event.end
        })
      );
      enqueueSnackbar('Update event success', {
        variant: 'success'
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

  const [search, setsearch] = useState('John Doe');

  useEffect(() => {
    console.log(search);
  }, [search])

  return (
    <>
    <Page title="Calendar">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Calendar"
          links={[{ name: 'Dashboard', href: '/dashboard/contacts' }, { name: 'Calendar' }]}
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
          style={{ marginBottom: '10px' }}
          renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
        />

        {
          search === "John Doe" ? (
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
                  height={isMobile ? 'auto' : 720}
                  plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                />
              </CalendarStyle>
            </Card>
          ) : (
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
                    { title: 'This is a event 1', date: '2021-10-01' },
                    { title: 'Call', date: '2021-10-28' },
                    { title: 'Work', date: '2021-10-06' },
                    { title: 'Done', date: '2021-10-12' }
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
                  eventClick={handleSelectEvent}
                  eventResize={handleResizeEvent}
                  height={isMobile ? 'auto' : 720}
                  plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                />
              </CalendarStyle>
            </Card>
          )
        }

        

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>

          <CalendarForm event={selectedEvent} range={selectedRange} onCancel={handleCloseModal} />
        </DialogAnimate>
      </Container>
    </Page>
    <Appbar />
    </>
  );
}


const top100Films = [
  { title: 'John Doe', year: 1994 },
  { title: 'Mickle Ckark', year: 1972 },
];
