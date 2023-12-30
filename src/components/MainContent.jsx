import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useState, useEffect } from 'react';
import  moment  from 'moment';
import 'moment/dist/locale/ar-sa'
moment.locale('ar')

const MainContent = () => {

  // The Project Countries With The Choosen Cities.
  const cities = [
    {
      isoName: 'EG',
      apiName: 'Cairo',
      displayName: 'القاهرة'
    },
    {
      isoName: 'SA',
      apiName: 'Makkah al Mukarramah',
      displayName: 'مكة المكرمة'
    },
    {
      isoName: 'PS',
      apiName: 'Jerusalem',
      displayName: 'القدس'
    },
    {
      isoName: 'AR',
      apiName: 'Dubai',
      displayName: 'دبي'
    },
    {
      isoName: 'KW',
      apiName: 'Kuwait',
      displayName: 'الكويت'
    },
    {
      isoName: 'QA',
      apiName: 'Doha',
      displayName: 'الدوحة'
    },
  ]
  const nextPrayer = [
    {
      key: 'Fajr',
      displayName: 'الفجر'
    },
    {
      key: 'Dhuhr',
      displayName: 'الظهر'
    },
    {
      key: 'Asr',
      displayName: 'العصر'
    },
    {
      key: 'Maghrib',
      displayName: 'المغرب'
    },
    {
      key: 'Isha',
      displayName: 'العشاء'
    },
  ]

  // STATES. 
  const [timings, setTimings] = useState({})
  const [currentCity, setCurrentCity] = useState({
    isoName: 'EG',
    apiName: 'Cairo',
    displayName: 'القاهرة'
  })
  const [today, setToday] = useState('')
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0)
  const [remainingTime, setRemainingTime] = useState('')

  // Function For The API Logic.
  const getTimings = async() => {
    const response = 
      await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=${currentCity.isoName}&city=${currentCity.apiName}`)
    setTimings(response.data.data.timings)
  }  
  useEffect(() => {
    getTimings()
  }, [currentCity])

  useEffect(() => {
    const interval = setInterval(() => {
      setUpCountdownTimer()
    }, 1000)

    const t = moment();
    setToday(t.format('dddd Do MMM YYYY | h:mm'))

    return () => clearInterval(interval)
  }, [timings])

  // The Function For The Couuntdown Timer.
  const setUpCountdownTimer = () => {
    const momentNow = moment()
    let prayerIndex = null;

    if (
      momentNow.isAfter(moment(timings['Fajr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Dhuhr'], 'hh:mm'))
    ) {
      prayerIndex = 1
    } else if (
      momentNow.isAfter(moment(timings['Dhuhr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Asr'], 'hh:mm'))
    ) {
      prayerIndex = 2
    } else if (
      momentNow.isAfter(moment(timings['Asr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Maghrib'], 'hh:mm'))
    ) {
      prayerIndex = 3
    } else if (
      momentNow.isAfter(moment(timings['Maghrib'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Isha'], 'hh:mm'))
    ) {
      prayerIndex = 4
    } else {
      prayerIndex = 0
    }
    setNextPrayerIndex(prayerIndex)
    const nextPrayerObject = nextPrayer[prayerIndex]
    const nextPrayerTime = timings[nextPrayerObject.key]
    const nextPrayerTimeMoment = moment(nextPrayer, 'hh:mm')

    let remainimgTime = (moment(nextPrayerTime, 'hh:mm')).diff(momentNow)

    if (remainimgTime < 0) {
      const midnightDiff = moment("23:59:59","hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"))
      const totalDiff = midnightDiff + fajrToMidnightDiff
      remainimgTime = totalDiff
    }

    const durationRemainingTime = moment.duration(remainimgTime)
    setRemainingTime(
      `${durationRemainingTime.seconds()} :
      ${durationRemainingTime.minutes()} :
      ${durationRemainingTime.hours()}`
    )
  }
  
  // Funtion For The Logic Of The Select Component To Select The Wanted City.
  const handleCityChange = (event) => {
    const cityFind = cities.find((city) => {
      return city.apiName == event.target.value
    })
    setCurrentCity((prevState) => ({
      ...prevState,
      isoName: cityFind.isoName,
      apiName: cityFind.apiName,
      displayName: cityFind.displayName
    }))
  }

  // Prayer Card Data
  const prayerCardData = [
    {
      id: 1,
      name: 'الفجر',
      time: timings.Fajr,
      img: '/images/dhhr-prayer-mosque.png'
    },
    {
      id: 2,
      name: 'الظهر',
      time: timings.Dhuhr,
      img: '/images/fajr-prayer.png'
    },
    {
      id: 3,
      name: 'العصر',
      time: timings.Asr,
      img: '/images/asr-prayer-mosque.png'
    },
    {
      id: 4,
      name: 'المغرب',
      time: timings.Maghrib,
      img: '/images/sunset-prayer-mosque.png'
    },
    {
      id: 5,
      name: 'العشاء',
      time: timings.Isha,
      img: '/images/night-prayer-mosque.png'
    },
  ]

  return (
    <>
      {/* TOP ROW */}
      <Stack sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>

        <Grid>
          <h2>
            {today}
          </h2>
          <h1>
            {currentCity.displayName}
          </h1>
        </Grid>
        <Grid>
          <h2>
            متبقي حتي صلاة {nextPrayer[nextPrayerIndex].displayName}
          </h2>
          <h1>
            {remainingTime}
          </h1>
        </Grid>
        <Grid>
          <img src="/images/palestine.png" width='150px' height='150px' alt="free paletine" />
        </Grid>

      </Stack>
      {/*== TOP ROW ==*/}

      <Divider style={{borderColor: 'white', opacity: '0.1'}}/>

      {/* PRAYERTS CARDS */}
      <Stack 
        direction="row"
        gap={1}
        mt={5}
        sx={{
          flexWrap: {sm: 'nowrap', xs:'wrap'},
          justifyContent: {md:'space-between', xs: 'center'}
        }}
      >
        {
          prayerCardData.map((prayer) => {
            return (
              <Prayer 
                key={prayer.id}
                name={prayer.name}
                img={prayer.img}
                time={prayer.time}
              />
            )
          })
        }
      </Stack>
      {/*== PRAYERTS CARDS ==*/}

      {/* SELECT CITY */}
        <Stack 
          direction='row' 
          justifyContent={'center'} 
          mt={4}
        >
          <FormControl 
            sx={{
              width: {sm: '25%', xs: '50%'}, 
            }}
          >
            <InputLabel 
              id="demo-simple-select-label" 
              sx={{fontSize: '20px', color: '#fff',}}
            >
              المدينة
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              value={currentCity.apiName}
              onChange={handleCityChange}
              sx={{
                color: '#fff',
                paddingRight: '5px', 
                fontSize: '20px',
              }}
            >
              {
                cities.map((city, index) => {
                  return (
                    <MenuItem 
                      key={index} 
                      value={city.apiName}
                    >
                      {city.displayName}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Stack>
      {/*== SELECT CITY ==*/}
    </>
  )
}

export default MainContent