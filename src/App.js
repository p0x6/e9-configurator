import './App.css';
import { VctrApi } from "./vendor/viewer-api/api";
import styled from "styled-components";
import { useEffect, useState } from 'react';

const COLORS = [
  {name: "Schwartz", color: "#000000"},
  {name: "Polaris Silver", color: "#c3c3c3"},
  {name: "Chamonix", color: "#f2f4df"},
  {name: "Ceylon Metallic", color: "#e3ae3e"},
  {name: "Colorado Orange", color: "#e47820"},
  {name: "Inka", color: "#d63a09"},
  {name: "Verona", color: "#c60c12"},
  {name: "Taiga", color: "#96e039"},
  {name: "Golf Yellow", color: "#cbde0b"},
  {name: "Fjord Blue", color: "#8fbff1"},
  {name: "Baikal Blue", color: "#2f669e"},
  {name: "Nachtblau",color: "#0e3250"},
];

const errHandler = (err) => {
  console.log("API error", err);
}

const vctrApi = new VctrApi("8135a231-c3c5-467a-8f8b-8d2d39452e98", errHandler);

const ColorSwatchItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColorSwatch = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.backgroundColor};
  color: ${props => props.color};
  line-height: 100px;
`;

const ColorSwatchList = styled.div`
  display: flex;
  position: absolute;
  z-index: 2;
  width: 100%;
  justify-content: space-around;
`;

function lightOrDark(color) {
  const c = color.substring(1);      // strip #
  const rgb = parseInt(c, 16);   // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff;  // extract red
  const g = (rgb >>  8) & 0xff;  // extract green
  const b = (rgb >>  0) & 0xff;  // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 50) {
    return '#fff';
  }
  return '#000';
}

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [mainBody, setMainBody] = useState(null);
  const [underBody, setUnderBody] = useState(null);
  const [gasFlap, setGasFlap] = useState(null);
  const [bodyColor, setBodyColor] = useState('#000000');

  const changePaintColor = async (color) => {
    if (!isReady || !mainBody || !underBody || !gasFlap) return;
    if (process.env.REACT_ENV !== 'dev') {
      window.gtag('event', 'Selection', {
        'action': 'Color Selection',
        'value': color.name
      });
    }
    vctrApi.updateMaterial(mainBody.material, {color: color.color});
    vctrApi.updateMaterial(underBody.material, {color: color.color});
    vctrApi.updateMaterial(gasFlap.material, {color: color.color});
    setBodyColor(color.color);
  }

  useEffect(() => {
    const initAPI = async () => {
      await vctrApi.init();
      const fetchedMainBody = await vctrApi.getObjectByName("cb_main_piece");
      const fetchedUnderBody = await vctrApi.getObjectByName("cb_bottom");
      const fetchedGasFlap = await vctrApi.getObjectByName("cb_fuel_hatch");
      setMainBody(fetchedMainBody);
      setUnderBody(fetchedUnderBody);
      setGasFlap(fetchedGasFlap);
      setIsReady(true);
    }
    initAPI();
  }, []);

  return (
    <div className="App">
      <ColorSwatchList>
        {COLORS.map(color => (
          <ColorSwatchItem onClick={() => changePaintColor(color)}>
            <ColorSwatch backgroundColor={color.color} color={lightOrDark(color.color)}>{bodyColor === color.color ? "Selected" : null}</ColorSwatch>
            <div>{color.name}</div>
          </ColorSwatchItem>
      ))}
      </ColorSwatchList>
      <vctr-viewer id="8135a231-c3c5-467a-8f8b-8d2d39452e98" model="8135a231-c3c5-467a-8f8b-8d2d39452e98"
                   pan={0} zoom={0} enableApi={1} env="studio2">
      </vctr-viewer>
    </div>
  );
}

export default App;
