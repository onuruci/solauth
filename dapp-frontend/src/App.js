import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import logoImg from "./common/solauth_logo.png";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Intruduction from "./components/IntoductionDoggo";
import Profile from "./components/Profile";
import Wardens from "./components/Wardens";
import Wardenings from "./components/Wardenings";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import * as web3 from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

global.Buffer = global.Buffer || require("buffer").Buffer;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <div>
              <Header logoImg={logoImg} />
              <div
                style={{
                  maxWidth: "750px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Box sx={{ width: "100%", marginLeft: "auto" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="fullWidth"
                      aria-label="basic tabs example"
                      indicatorColor="secondary"
                      sx={{
                        marginRight: "auto",
                        alignContent: "center",
                      }}
                      centered
                    >
                      <Tab label="Intro" {...a11yProps(0)} />
                      <Tab label="My Profile" {...a11yProps(1)} />
                      <Tab label="My Wallet" {...a11yProps(2)} />
                      <Tab label="Wardenings" {...a11yProps(3)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <Intruduction />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Profile />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Wardens />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <Wardenings />
                  </TabPanel>
                </Box>
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  );
}

export default App;
