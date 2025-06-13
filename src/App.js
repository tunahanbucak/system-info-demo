import { useState } from "react";
import { UAParser } from "ua-parser-js";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Alert,
  Button,
  Slide,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import ComputerIcon from "@mui/icons-material/Computer";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import CodeIcon from "@mui/icons-material/Code";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a73e8",
    },
    secondary: {
      main: "#34a853",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: ['"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"].join(","),
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      color: "#202124",
      marginBottom: 20,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#3c4043",
    },
    body1: {
      fontSize: "1rem",
      color: "#5f6368",
    },
    body2: {
      fontSize: "0.9rem",
      color: "#70757a",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          color: "#202124",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "12px 24px",
          fontSize: "1.1rem",
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "0.85rem",
          marginTop: 15,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          color: "#3c4043",
        },
        secondary: {
          color: "#5f6368",
        },
      },
    },
  },
});

const iconMap = {
  Browser: <WebAssetIcon color="primary" />,
  "İşletim Sistemi": <ComputerIcon color="primary" />,
  Cihaz: <DevicesOtherIcon color="primary" />,
  CPU: <SettingsInputComponentIcon color="primary" />,
  "Render Motoru": <CodeIcon color="primary" />,
  "Ek Sistem Detayları": <InfoOutlinedIcon color="primary" />,
  Batarya: <BatteryChargingFullIcon color="primary" />,
  "Client Hints": <NetworkCheckIcon color="primary" />,
  "User-Agent": <InfoOutlinedIcon color="primary" />,
};

function App() {
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    browser: {},
    os: {},
    device: {},
    cpu: {},
    engine: {},
    extra: {
      hardwareConcurrency: "Bilinmiyor",
      deviceMemory: "Bilinmiyor",
      platform: "Bilinmiyor",
      connectionType: "Bilinmiyor",
      batteryLevel: "Bilinmiyor",
      batteryCharging: "Bilinmiyor",
      uaDataArchitecture: "Bilinmiyor",
      uaDataModel: "Bilinmiyor",
      uaDataPlatformVersion: "Bilinmiyor",
    },
    userAgentString: "",
  });

  const fetchSystemInfo = async () => {
    setLoading(true);
    const parser = new UAParser();

    const info = {
      browser: parser.getBrowser(),
      os: parser.getOS(),
      device: parser.getDevice(),
      cpu: parser.getCPU(),
      engine: parser.getEngine(),
      userAgentString: navigator.userAgent,
      extra: {
        hardwareConcurrency: navigator.hardwareConcurrency || "Desteklenmiyor",
        deviceMemory: navigator.deviceMemory
          ? `${navigator.deviceMemory} GB`
          : "Desteklenmiyor",
        platform: navigator.platform || "Bilinmiyor",
      },
    };

    if (navigator.connection) {
      info.extra.connectionType =
        navigator.connection.effectiveType || "Bilinmiyor";
    }

    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        info.extra.batteryLevel = `${Math.round(battery.level * 100)}%`;
        info.extra.batteryCharging = battery.charging ? "Evet" : "Hayır";
      } catch (error) {
        console.warn("Batarya bilgisi alınamadı:", error);
        info.extra.batteryLevel = "Erişim Engellendi";
        info.extra.batteryCharging = "Erişim Engellendi";
      }
    }

    if (navigator.userAgentData) {
      try {
        const uaData = await navigator.userAgentData.getHighEntropyValues([
          "architecture",
          "model",
          "platformVersion",
        ]);
        info.extra.uaDataArchitecture = uaData.architecture || "Bilinmiyor";
        info.extra.uaDataModel = uaData.model || "Bilinmiyor";
        info.extra.uaDataPlatformVersion =
          uaData.platformVersion || "Bilinmiyor";
      } catch (error) {
        console.warn("Client Hints (High Entropy) bilgileri alınamadı:", error);
        info.extra.uaDataArchitecture = "Erişim Engellendi";
        info.uaDataModel = "Erişim Engellendi";
        info.extra.uaDataPlatformVersion = "Erişim Engellendi";
      }
    }

    setSystemInfo(info);
    setLoading(false);
  };

  const handleShowInfo = () => {
    setShowInfo(true);
    fetchSystemInfo();
  };

  const renderInfoList = (data) => (
    <List disablePadding>
      {Object.entries(data).map(([key, value]) => (
        <ListItem key={key} disableGutters sx={{ py: 0.2 }}>
          <ListItemText
            primary={
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
                :
              </Typography>
            }
            secondary={
              <Typography variant="body2" component="span">
                {typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : value || "Bilinmiyor"}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cihaz Bilgileri Analizörü
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Sistem ve Cihaz Bilgilerinizi Keşfedin
        </Typography>

        {!showInfo && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleShowInfo}
              endIcon={<ComputerIcon />}
              sx={{ px: 5, py: 2, fontSize: "1.2rem" }}
            >
              Bilgileri Göster
            </Button>
            <Typography variant="body1" color="text.secondary">
              Cihazınız, tarayıcınız ve işletim sisteminiz hakkında detaylı
              bilgilere ulaşmak için tıklayın.
            </Typography>
          </Box>
        )}

        {showInfo && (
          <>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "50vh",
                  flexDirection: "column",
                }}
              >
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" color="primary">
                  Bilgiler Yükleniyor...
                </Typography>
              </Box>
            ) : (
              <Slide
                direction="up"
                in={!loading}
                mountOnEnter
                unmountOnExit
                timeout={700}
              >
                <Grid container spacing={4} justifyContent="center">
                  {[
                    {
                      title: "Tarayıcı Bilgileri",
                      icon: iconMap.Browser,
                      data: {
                        Adı: systemInfo.browser.name,
                        Versiyon: systemInfo.browser.version,
                      },
                    },
                    {
                      title: "İşletim Sistemi Bilgileri",
                      icon: iconMap["İşletim Sistemi"],
                      data: {
                        Adı: systemInfo.os.name,
                        Versiyon: systemInfo.os.version,
                      },
                    },
                    {
                      title: "Cihaz Bilgileri",
                      icon: iconMap.Cihaz,
                      data: {
                        Tipi: systemInfo.device.type,
                        Modeli: systemInfo.device.model,
                        Üretici: systemInfo.device.vendor,
                      },
                    },
                    {
                      title: "CPU ve Render Motoru",
                      icon: iconMap.CPU,
                      data: {
                        "CPU Mimari": systemInfo.cpu.architecture,
                        "Motor Adı": systemInfo.engine.name,
                        "Motor Versiyon": systemInfo.engine.version,
                      },
                    },
                    {
                      title: "Ek Sistem Detayları",
                      icon: iconMap["Ek Sistem Detayları"],
                      data: {
                        "Mantıksal Çekirdek":
                          systemInfo.extra.hardwareConcurrency,
                        "Tahmini RAM": systemInfo.extra.deviceMemory,
                        Platform: systemInfo.extra.platform,
                        "Bağlantı Tipi": systemInfo.extra.connectionType,
                      },
                    },
                    {
                      title: "Batarya Bilgileri",
                      icon: iconMap.Batarya,
                      data: {
                        Seviye: systemInfo.extra.batteryLevel,
                        "Şarj Oluyor": systemInfo.extra.batteryCharging,
                      },
                      alert:
                        "Gizlilik nedeniyle her tarayıcıda desteklenmeyebilir.",
                    },
                  ].map((section, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card elevation={3}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {section.icon}
                            </ListItemIcon>
                            <Typography
                              variant="h6"
                              component="h2"
                              sx={{ ml: 1 }}
                            >
                              {section.title}
                            </Typography>
                          </Box>
                          {renderInfoList(section.data)}
                          {section.alert && (
                            <Alert
                              severity="info"
                              sx={{ mt: 2, fontSize: "0.8em" }}
                            >
                              {section.alert}
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {iconMap["Client Hints"]}
                          </ListItemIcon>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{ ml: 1 }}
                          >
                            Client Hints API Bilgileri (Gelişmiş User-Agent)
                          </Typography>
                        </Box>
                        {renderInfoList({
                          "Mimari (UA Data)":
                            systemInfo.extra.uaDataArchitecture,
                          "Model (UA Data)": systemInfo.extra.uaDataModel,
                          "Platform Versiyon (UA Data)":
                            systemInfo.extra.uaDataPlatformVersion,
                        })}
                        <Alert
                          severity="warning"
                          sx={{ mt: 2, fontSize: "0.8em" }}
                        >
                          Bu bilgiler yeni nesil API'lardır ve tarayıcı veya
                          sunucu ayarı gerektirebilir. Bazı durumlarda "Erişim
                          Engellendi" görünebilir.
                        </Alert>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {iconMap["User-Agent"]}
                          </ListItemIcon>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{ ml: 1 }}
                          >
                            Tüm User-Agent Dizesi
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                            bgcolor: "#f5f5f5",
                            p: 2,
                            borderRadius: 6,
                          }}
                        >
                          {systemInfo.userAgentString}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Slide>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
