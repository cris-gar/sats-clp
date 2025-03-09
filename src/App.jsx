import { useState, useEffect } from 'react'
import './App.css'
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
    setOneThousandClp((priceCLP / 100_000_000));

    return priceCLP / 100_000_000;
  }

  useEffect(() => {
    setLoading(false);
  }, [oneClp, oneSat]);

  useEffect(() => {
    getPrice();
    const interval = setInterval(getPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  const imageCoin = oneSat > 1 ? oneThousandClpImg : oneClpImg;
  //const styleCoin = oneSat > 1 ? { rotate: '180deg' } : { rotate: '180deg' };

  const coverage = oneSat > 1 ? oneThousandClp : oneClp;

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      {/* Título */}
      <Grid item size={{ xs:12 }}>
        <Typography variant="h3" align="center">
          ¿Paridad Sat / Peso?
        </Typography>
      </Grid>

      {/* Imagen con Gradiente */}
      <Grid item size={{ xs:12 }} container justifyContent="center" alignItems="center">
        {loading ? (
          <Typography variant="body1">Cargando...</Typography>
        ) : (
          <Box position="relative" width="200px" height="200px">
            {/* Imagen */}
            <img
              src={imageCoin}
              alt="Moneda"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%", // Hace la imagen redonda
                objectFit: "cover",
                rotate: '180deg'
              }}
            />

            {/* Gradiente circular */}
            {coverage < 100 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%", // Forzamos forma circular
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                  backgroundImage: `conic-gradient(hsla(0,0%,100%,0) calc(3.6deg * ${coverage}),var(--backgroundClp) 0 calc(3.6deg * ${100 - coverage}),var(--backgroundClp) 0)`,
                  transition: "clip-path 0.5s ease-in-out",
                  pointerEvents: "none", // para que no bloquee clics
                }}
              />
            )}
          </Box>
        )}
      </Grid>

      {/* Valor */}
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          1 Sat = {oneSat.toFixed(6)} CLP
        </Typography>
      </Grid>
    </Grid>
  )
}

export default App
