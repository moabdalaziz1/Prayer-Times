import MainContent from './components/MainContent'
import Container from '@mui/material/Container';
import './App.css'

function App() {

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100vw',
    }}>
      <Container 
        maxWidth='lg' 
        sx={{
          paddingBottom: {md: '100px', xs: '200px'},
          paddingRight: '0px'
        }}
      >
        <MainContent />
      </Container>
    </div>
  )
}

export default App
