import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

// eslint-disable-next-line react/prop-types
const Prayer = ({name, time, img}) => {
  return (
    <>
      <Card sx={{ width: '85%' }}>
        <CardActionArea>
          <CardMedia
            sx={{ height: 140 }}
            image={img}
            alt="fajr-prayer"
          />
          <CardContent>
            <Typography 
              gutterBottom 
              variant="h5" 
              component="div"
              mb={1}
            >
              {name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
              {time}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}

export default Prayer