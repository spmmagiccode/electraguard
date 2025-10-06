import React from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

const AboutPage = () => {
  const cardData = [
    {
      title: "Who We Are",
      content:
        "We are a team of passionate developers dedicated to building innovative and user-friendly applications.",
      img: "/who.png",
    },
    {
      title: "What We Do",
      content:
        "We create solutions that help users monitor, predict, and optimize energy usage efficiently.",
      img: "/what.png",
    },
    {
      title: "Where You Can Find Us",
      content:
        "Visit us online or at our main office located in Colombo. Our support team is always ready to assist you.",
      img: "/where.png",
    },
    {
      title: "Our Visuals",
      content: "Check out our team, work, and locations through these visuals.",
      img: "/visuals.png", // Starting image; you can replace with a collage if needed
    },
  ];

  return (
    <Box
      sx={{
        px: 4,
        py: 8,
        background: "linear-gradient(145deg, #111, #1a1a1a)",
        minHeight: "80vh",
        color: "#00f0ff",
        fontFamily: "Orbitron",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "Orbitron", mb: 6, fontWeight: "bold" }}
      >
        About Us
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row", lg: "row" },
          gap: 6,
          justifyContent: "center",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              minWidth: 250,
              background: "#00141a",
              color: "#00f0ff",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0, 188, 212, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 40px rgba(0, 188, 212, 0.7)",
              },
            }}
          >
            {card.img && (
              <CardMedia
                component="img"
                image={card.img}
                alt={card.title}
                sx={{
                  width: { xs: "150px", md: "200px" },
                  height: { xs: "150px", md: "200px" },
                  mt: 3,
                  borderRadius: "20%",
                  objectFit: "cover",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              />
            )}
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Orbitron",
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Orbitron",
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  px: { xs: 1, md: 3 },
                }}
              >
                {card.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AboutPage;
