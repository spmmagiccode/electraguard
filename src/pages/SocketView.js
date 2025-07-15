import { Grid, Container } from "@mui/material";
import ToggleWithData from "../components/DetailCard";

const SocketViewPage = () => {
  const dataList = [
    {
      power: "1200 W",
      current: "15 A",
      voltage: "220 V",
      alarm: "No alarm",
    },
    {
      power: "900 W",
      current: "12 A",
      voltage: "230 V",
      alarm: "Warning",
    },
    {
      power: "1500 W",
      current: "18 A",
      voltage: "210 V",
      alarm: "No alarm",
    },
    {
      power: "1100 W",
      current: "14 A",
      voltage: "225 V",
      alarm: "Critical",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {dataList.map((data, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ToggleWithData data={data} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SocketViewPage;
