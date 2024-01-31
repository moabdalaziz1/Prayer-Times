import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { useState, useEffect } from 'react';
import  moment  from 'moment';
import 'moment/dist/locale/ar-sa'
import { Typography } from '@mui/material';
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
  const [open, setOpen] = useState(false);
  // Handle Open && Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false); 

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
      img: '/images/dhhr-prayer-mosque.png',
      sona: 'ركعتان قبل صلاة الفجر كـ سُنه مؤكده' 
    },
    {
      id: 2,
      name: 'الظهر',
      time: timings.Dhuhr,
      img: '/images/fajr-prayer.png',
      sona: 'أربع ركعات قبل صلاة الظهر وركعتان بعدها كـ سُنه مؤكده ،، ومُستحب إضافة ركعتان بعد الصلاة '
    },
    {
      id: 3,
      name: 'العصر',
      time: timings.Asr,
      img: '/images/asr-prayer-mosque.png',
      sona: 'لا يوجد سُنه مؤكده قبل أو بعد صلاة العصر ،، ولكن مُستحب إضافة أربع ركعات قبل الصلاة '
    },
    {
      id: 4,
      name: 'المغرب',
      time: timings.Maghrib,
      img: '/images/sunset-prayer-mosque.png',
      sona: 'ركعتان بعد صلاة المغرب كـ سُنه مؤكده ،، ومُستحب إضافة ركعتان بعد الصلاة '
    },
    {
      id: 5,
      name: 'العشاء',
      time: timings.Isha,
      img: '/images/night-prayer-mosque.png',
      sona: 'ركعتان بعد صلاة العشاء كـ سُنه مؤكده ،، ومُستحب إضافة ركعتان بعد الصلاة وتُختم الصلاة بالوتر '
    },
  ]

  // Azkar Data
  const Azkar = [
    {
      zeker: 'أَسْـتَغْفِرُ الله، أَسْـتَغْفِرُ الله، أَسْـتَغْفِرُ الله.'
    },
    {
      zeker: 'اللّهُـمَّ أَنْـتَ السَّلامُ ، وَمِـنْكَ السَّلام ، تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام .'
    },
    {
      zeker: 'لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْد، وهوَ على كلّ شَيءٍ قَدير، اللّهُـمَّ لا مانِعَ لِما أَعْطَـيْت، وَلا مُعْطِـيَ لِما مَنَـعْت، وَلا يَنْفَـعُ ذا الجَـدِّ مِنْـكَ الجَـد. '
    },
    {
      zeker: 'لا إلهَ إلاّ اللّه, وحدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمد، وهوَ على كلّ شيءٍ قدير، لا حَـوْلَ وَلا قـوَّةَ إِلاّ بِاللهِ، لا إلهَ إلاّ اللّـه، وَلا نَعْـبُـدُ إِلاّ إيّـاه, لَهُ النِّعْـمَةُ وَلَهُ الفَضْل وَلَهُ الثَّـناءُ الحَـسَن، لا إلهَ إلاّ اللّهُ مخْلِصـينَ لَـهُ الدِّينَ وَلَوْ كَـرِهَ الكـافِرون. '
    },
    {
      zeker: '  اللهُ أكْـبَر ( 33 مرة ) ،، والحَمْـدُ لله ( 33 مرة ) ،، وسُـبْحانَ اللهِ ( 33 مرة ) '
    },
    {
      zeker: 'لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمْد، وهُوَ على كُلّ شَيءٍ قَـدير. '
    },
    {
      zeker: '( سورة الإخلاص ) ،، ( سورة الفلق ) ،، ( سورة الناس )',
      hint: '[ ثلاث مرات بعد صلاتي الفجر والمغرب. ومرة بعد الصلوات الأخرى. ]'
    },
    {
      zeker: 'اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.',
      hint: '[ آية الكرسى - البقرة 255]'
    },
    {
      zeker: 'اللّهُـمَّ إِنِّـي أَسْأَلُـكَ عِلْمـاً نافِعـاً وَرِزْقـاً طَيِّـباً ، وَعَمَـلاً مُتَقَـبَّلاً.',
      hint: '[ بَعْد السّلامِ من صَلاةِ الفَجْر. ]'
    },
    {
      zeker: 'اللَّهُمَّ أَجِرْنِي مِنْ النَّار.',
      hint: '[ بعد صلاة الصبح والمغرب. ]'
    },
    {
      zeker: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.',
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
        {/* Azkar Modal */}
        <Grid>
          <Button 
            sx={{
              color: '#111',
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '30px',
              fontSize: '28px',
              fontWeight: 'bold',
              padding: '8px 16px',
              transition: '0.3s all ease-in-out',
              ":hover": {
                color: '#fff',
                backgroundColor: '#111',
              }
            }}
            onClick={handleOpen}
          >
            أذكار ما بعد الصلاة
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              overflowY: 'scroll',
            }}
          >
            <Box 
              sx={{
                backgroundColor: '#f6f6f6',
                color: '#111',
                width: { md: '50%', xs: '70%' } ,
                borderRadius: '15px',
                textAlign: 'start',
                padding: '25px',
                boxShadow: 24
              }}
            >
              <List 
                id="modal-modal-description"
                sx={{ listStyleType: 'disc', mr: 5, fontSize: '30px' }}
              >
                  {
                    Azkar.map((item, index) => {
                      return (
                        <ListItem
                          key={index}
                          disablePadding 
                          sx={{textAlign: 'start', display: 'list-item'}}
                        >
                          <ListItemText
                            primaryTypographyProps={{fontSize: '35px'}}
                          >
                            {item.zeker}
                            <p 
                              style={{
                                padding: '0',
                                margin: '0',
                                fontFamily: 'sans-serif',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                textAlign: 'end',
                                marginBottom: '20px'
                              }}
                              >
                                {item.hint}
                              </p>
                          </ListItemText>
                        </ListItem>
                      )
                    })
                  }
              </List>
              {/* <Typography id="modal-modal-description" sx={{ fontSize: '30px' }}>
                <span>
                  - أَسْـتَغْفِرُ الله، أَسْـتَغْفِرُ الله، أَسْـتَغْفِرُ الله.
                </span>
                <br />
                <span>
                  - اللّهُـمَّ أَنْـتَ السَّلامُ ، وَمِـنْكَ السَّلام ، تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام . 
                </span>
                <br />
                <span>
                  - لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْد، وهوَ على كلّ شَيءٍ قَدير،
                  اللّهُـمَّ لا مانِعَ لِما أَعْطَـيْت، وَلا مُعْطِـيَ لِما مَنَـعْت، وَلا يَنْفَـعُ ذا الجَـدِّ مِنْـكَ الجَـد. 
                </span>
                <br />
                <span>
                  - لا إلهَ إلاّ اللّه, وحدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمد، وهوَ على كلّ شيءٍ قدير،
                  لا حَـوْلَ وَلا قـوَّةَ إِلاّ بِاللهِ، لا إلهَ إلاّ اللّـه، وَلا نَعْـبُـدُ إِلاّ إيّـاه, لَهُ النِّعْـمَةُ
                  وَلَهُ الفَضْل وَلَهُ الثَّـناءُ الحَـسَن، لا إلهَ إلاّ اللّهُ مخْلِصـينَ لَـهُ الدِّينَ وَلَوْ كَـرِهَ الكـافِرون.  
                </span>
                <br />
                <span>
                  -  اللهُ أكْـبَر (33 مرة) ,, الحَمْـدُ لله (33 مرة) ,, سُـبْحانَ اللهِ (33 مرة). 
                </span>
                <br />
                <span>
                  - لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شريكَ لهُ، لهُ الملكُ ولهُ الحَمْد، وهُوَ على كُلّ شَيءٍ قَـدير.
                </span>
                <br />
                <span>
                  - ( سورة الإخلاص ,, سورة الفلق ,, سورة الناس )
                  <br />
                  ثلاث مرات بعد صلاتي الفجر والمغرب. ومرة بعد الصلوات الأخرى.
                </span>
                <br />
                <span>
                  - [آية الكرسى - البقرة 255]
                  <br />
                  اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي
                  الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ
                  إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ. 
                </span>
              </Typography> */}
            </Box>
          </Modal>
        </Grid>
        {/* Azkar Modal */}
        <Grid>
          <img src="/images/palestine.png" width='150px' height='150px' alt="free paletine" />
        </Grid>

      </Stack>
      {/*== TOP ROW ==*/}

      <Divider style={{borderColor: 'white', opacity: '0.1'}}/>

      {/* PRAYERYS CARDS */}
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
                sona={prayer.sona}
              />
            )
          })
        }
      </Stack>
      {/*== PRAYERYS CARDS ==*/}

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
            sx={{fontSize: '24px', color: '#fff',}}
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
                    sx={{
                      fontSize: '20px'
                    }}
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

      {/* Footer */}
      <Stack
        sx={{
          textAlign: {md: 'start', xs: 'center'},
          mt: {sm: 2, xs: 5},
          mb: 10
        }}
      >
        <Typography component='p' sx={{fontSize: '20px'}}>
          تم الإنشاء بواسطة 
          <Typography 
            component='a'
            href='https://moabdalaziz1.github.io/' 
            target='_blank'
            sx={{
              fontSize: '20px',
              textDecoration: 'underline',
              color: '#fff',
              transition: '0.3s all ease-in-out',
              margin: '0px 10px',
              ":hover" : {
                color: '#555'
              }
            }}
          >
            محمد عبد العزيز عبد الفتاح
          </Typography>
          - Jan 2024 	&copy;
        </Typography>
      </Stack>
      {/* Footer */}
    </>
  )
}

export default MainContent