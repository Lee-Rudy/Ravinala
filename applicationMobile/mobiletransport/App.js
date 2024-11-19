import React from "react";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

import Screens from "./navigation/Screens";
import { argonTheme } from "./constants";

export default function App() {
  return (
    <NavigationContainer>
      <GalioProvider theme={argonTheme}>
        <Block flex>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
