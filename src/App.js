import React from 'react';
import Main from './components/Main';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import deepPurple from "@material-ui/core/colors/deepPurple";
import pink from "@material-ui/core/colors/pink";

function App() {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: deepPurple[700],
            },
            secondary: {
                main: pink[700],
            },
        },
    });

  return (
      <div className="App">
          <ThemeProvider theme={theme}>
              <CssBaseline/>
              <Main/>
          </ThemeProvider>
      </div>
  );
}

export default App;
