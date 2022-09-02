
import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import './App.css';
import logo from './assets/dota-2.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {

    button: {
      fontSize: 24,
      fontWeight: "bolder",
      fontFamily: "Helvetica"
    },    
  }, 
  palette: {
    primary: {
      main: "#ff5252"
    },
    secondary: {
      main: "#ff5252"
    },
  },
});
export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="flex-end"
          className="splash-container"
          maxWidth="50%"
          display="flex"
          marginLeft="25%"
        >
          <Box className="logo-style">
          <img src={logo} height="300px"/>Sketch
          </Box>
            <Button className="button-style">Create Game</Button>
            <Button className="button-style">Join Game</Button>

        </Grid>
    </ThemeProvider>
  );
}
