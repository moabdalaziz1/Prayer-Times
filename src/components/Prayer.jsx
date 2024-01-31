import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import { CardActionArea } from '@mui/material';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const Prayer = ({name, time, img, sona}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
              variant="h4" 
              component="div"
              mb={1}
            >
              {name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
              {time}
            </Typography>
            {/* The Button Of The Sona */}
            <Typography
              component="div"
              sx={{
                border: '2px solid #555',
                borderRadius: '5px',
                paddingBlock: '5px',
                textAlign: 'center',
                mt: 2,
                fontSize: '22px',
                transition: '0.3s all ease-in-out',
                ":hover": {
                  backgroundColor: '#555',
                  color: '#f6f6f6'
                }
              }}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              السُنن الؤكده والمُستحبه
            </Typography>
            {/* The Button Of The Sona */}
            {/* The Sona */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{
                padding: '0px' 
              }}
            >
              <Typography
                component='div'
                onClick={handleClose}
                sx={{
                  fontSize: '22px',
                  padding: '8px 16px',
                  width: '320px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#222',
                  color: '#fff'
                }}
              >
                {sona}
              </Typography>
            </Menu>
            {/* The Sona */}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}

export default Prayer