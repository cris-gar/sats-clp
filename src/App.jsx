import { useState, useEffect } from 'react'
import './App.css'
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import oneClpImg from './assets/clp.png';
import oneThousandClpImg from './assets/100-reverso-1.png';

function App() {
  const [oneSat, setOneSat] = useState(0);
  const [oneClp, setOneClp] = useState(0);
  const [oneThousandClp, setOneThousandClp] = useState(0);
  const [loading, setLoading] = useState(false);

  const getApi = async () => {
    setLoading(true);
    const response = await fetch('https://preev.com/api/v1/tickers/btc+usd?include[]=p.l&flat=true&c=clp');
    return await response.json();
  }

  const getPrice = async () => {
    const data = await getApi();
    const { l: priceUsd, c: { usd: { other: { l: rate } } } } = data;
    const priceCLP = priceUsd / rate;
    setOneSat(priceCLP / 100_000_000);

    setOneClp((priceCLP / 100_000_000) * 100);
    // const rateRest = 100 - rate;
    setOneThousandClp((priceCLP / 100_000_000) * 1_000);

    return priceCLP / 100_000_000;
  }

  useEffect(() => {
    setLoading(false);
  }, [oneClp]);

  useEffect(() => {
    getPrice();
  }, []);

  const imageCoin = oneSat > 1 ? oneThousandClpImg : oneClpImg;
  const styleCoin = oneSat > 1 ? { rotate: '180deg' } : { width: "30%", rotate: '180deg' };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h1">
            ¿paridad sat / peso ?
          </Typography>
        </Grid>
        {
          !loading ?
            <Grid size={{xs: 12}}>
              <img src={imageCoin} alt="" style={styleCoin}/>
            </Grid> :
            <Typography variant="body1">
              Cargando..
            </Typography>
        }
      </Grid>
    </>
  )
}

export default App
