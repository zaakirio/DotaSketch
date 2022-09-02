
import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import styles from '../styles/Home.module.css';
import logo from '../assets/dota-2-sm.png';
import defaultThemeOptions from "../styles/theme/defaultTheme";
import { ThemeProvider, createTheme } from '@mui/material';

import Image from 'next/image'

const defaultTheme = createTheme(defaultThemeOptions);

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
<Grid width="100%" height="100%" className="bg-style">
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
          <Image src={logo} />   Sketch
          </Box>
            <Button className="button-style">Create Game</Button>
            <Button className="button-style">Join Game</Button>
            </Grid>
        </Grid>
    </ThemeProvider>
  );
}
