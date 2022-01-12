import { extendTheme } from "@chakra-ui/react";

const DealDexTheme = extendTheme({
  colors: {
    iris: {
      80: "#7879F1",
      100: "#5D5FEF",
    },
  },
  layerStyles: {
    dealTableWrap: {
      width: "610px",
      height: "auto",
      borderRadius: "4px",
      padding: "26px 40px 55px",
      border: "1px",
      borderColor: "gray.200",
      boxShadow: "base",
      textAlign: "left",
    },
    detailSummaryWrap: {
      height: "auto",
      borderRadius: "8px",
      padding: "15px 20px",
      border: "1px",
      borderColor: "gray.200",
      boxShadow: "base",
      textAlign: "left",
    },
    checkboxVerifyWrap: {
      right: "-5px",
      top: " -5px",
    },
    navWrap: {
      height: "100px",
      padding: "0 25px",
      boxShadow: "md",
      background: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "gray.600",
      fontSize: "24px",
      fontWeight: "400",
      lineHeight: "150%",
    },
    cursorWrap: {
      cursor: 'pointer'
    }
  },
  textStyles: {
    title: {
      fontSize: "72px",
      fontWeight: "700",
      lineHeight: "100%",
      color: "black",
    },
    titleSection: {
      fontSize: "48px",
      fontWeight: "700",
      lineHeight: "100%",
      color: "black",
    },
    subtitle: {
      fontSize: "24px",
      fontWeight: "400",
      lineHeight: "150%",
      color: "black",
      letterSpacing: "1px",
    },
    titleDeal: {
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: "120%",
      color: "black",
    },
    subTitleDeal: {
      fontSize: "24px",
      fontWeight: "400",
      lineHeight: "150%",
      color: "gray.500",
    },
    account: {
      fontSize: "30px",
      fontWeight: "700",
      lineHeight: "120%",
      color: "black",
    },
    addressWallet: {
      fontSize: "18px",
      fontWeight: "600",
      lineHeight: "129%",
      color: "gray.500",
    },
    titleInvestment: {
      fontSize: "36px",
      fontWeight: "700",
      lineHeight: "120%",
      color: "black",
    },
    subTitleInvestment: {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "120%",
      color: "blackAlpha.500",
    },
    investmentMessages: {
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "110%",
      color: "gray.500",
    },
    titleInvestmentDeal: {
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "133%",
      color: "black",
    },
    labelFormStep: {
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "118%",
      color: "gray.500",
    },
    textFormStep: {
      fontSize: "18px",
      fontWeight: "700",
      lineHeight: "129%",
      color: "gray.700",
    },
    statusDeal: {
      color: "red.500",
    },
    statusProjectMin: {
      color:"red.300",
      fontWeight:"700"
    },
    statusProjectOngoing: {
      color:"green.700",
      fontWeight:"700"
    }
  },
  components: {
    Button: {
      variants: {
        dealCreate: {
          background: "iris.80",
          color: "white",
          mt: "0px",
          width: "380px",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          size: "lg",
        },
        accountEdit: {
          mt: "0px",
          width: "52px",
          height: "20px",
          background: "white",
          color: "iris.80",
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "129%",
          border: "1px",
          borderColor: "iris.80",
          size: "xs",
          borderRadius: "6px",
        },
        saveUserName: {
          background: "iris.80",
          color: "white",
        },
        dealformAdd: {
          background: "white",
          color: "#7879F1",
          border: "1px solid #7879F1",
          mt: "0px",
          width: "299px",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          size: "lg",
        },
        dealformBack: {
          background: "white",
          color: "#7879F1",
          mt: "0px",
          width: "80px",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          size: "lg",
        },
        dealform3Fee: {
          background: "#7879F1",
          color: "white",
          mt: "0px",
          width: "299px",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          size: "lg",
        },
        dealDetailTabInvest: {
          background: "white",
          color: "black",
          size: "lg",
          borderRadius: "10px",
          _hover: {
            background: "#7879F1",
            color: "white",
          },
        },
        dealDetailTabMyInvestment: {
          background: "white",
          color: "black",
          size: "lg",
          borderRadius: "10px",
          _hover: {
            background: "blue.100",
            color: "white",
          },
        },
        dealDetailTabInvestSel: {
          background: "#7879F1",
          color: "white",
          size: "lg",
          borderRadius: "10px",
        },
        dealDetailTabMyInvestmentSel: {
          background: "blue.100",
          color: "white",
          size: "lg",
          borderRadius: "10px",
        },
        dealDetailTable: {
          background: "#7879F1",
          color: "white",
          size: "lg",
        },
        dealForm2Details: {
          background: "#7879F1",
          color: "white",
          mt: "0px",
          width: "380px",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          size: "lg",
        },
        connectWallet: {
          background: "iris.100",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "129%",
          color: "white",
          py: "4px",
        },
        addresstWallet: {
          border: "1px",
          borderColor: "iris.100",
          color: "iris.100",
          background: "white",
        }
      },
    },
    Badge: {
      variants: {
        verified: {
          background: "iris.80",
          color: "white",
        },
        verified2: {
          background: "iris.80",
          color: "white",
          marginTop: "-20px",
        },
      },
    },
    Table: {
      variants: {
        dealTable: {
          table: {
            bg: "gray.50",
            borderRadius: "4px",
            border: "1px",
            borderColor: "gray.200",
            boxShadow: "base",
          },
          th: {
            color: "gray.700",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "100%",
            textTransform: "capitalization",
          },
          td: {
            color: "gray.700",
            textAlign: "center",
            fontWeight: "400",
            fontSize: "20px",
            lineHeight: "100%",
          },
        },
        dealDetailProjectTable: {
          tbody: {
            tr: {
              _odd: {
                background: "#EDF2F7",
              },
            },
          },
        },
      },
    },
    Tabs: {
      variants: {
        dealAccountTab: {
          tab: {
            background: "white",
            borderRadius: "9999px",
            width: "auto",
            height: "40px",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "124%",
            color: "gray.600",
            _selected: {
              background: "iris.100",
              color: "white",
            },
          },
          tabpanel: {
            py: "30px",
            px: 0,
          },
        },
      },
    },
    Container: {
      variants: {
        dealFormAlert: {
          background: "#F7FAFC",
          borderRadius: "4px",
          border: "1px",
          borderColor: "gray.200",
          boxShadow: "base",
          width: "100%",
          margin: "0",
          padding: "10px 20px",
          textAlign: "left",
          fontSize: "16px",
        },
      },
    },
    Text: {
      variants: {
        dealInputAppendix: {
          width: "fit-content",
          marginTop: "1px",
          color: "#718096",
          alignItems: "flex-start",
          textAlign: "left",
        },
        dealFontWeight500: {
          fontWeight: "500",
        },
        dealStepTitle: {
          fontSize: "32px",
          fontWeight: "bold",
        },
        dealStepDesc: {
          alignItems: "flex-start",
          textAlign: "left",
        },
      },
    },
    FormHelperText: {
      variants: {
        dealFormDesc: {
          textAlign: "left",
          fontSize: "16px",
        },
        dealFormError: {
          textAlign: "left",
          fontSize: "16px",
          color: "#E53E3E",
        },
      },
    },
    Menu: {
      variants: {
        selectNetWork: {
          item: {
            fontSize: "18px",
            lineheight: "129%",
            fontWeight: "400",
            color: "gray.700",
            _focus:{ bg: 'iris.100', color: "white" },
            _active: { bg: 'iris.100', color: "white" }
          },
          button: {
            transition: "all 0.2s",
            borderRadius: "md",
            borderWidth: "1px",
            color: "gray.700",
            borderColor: "black",
            fontSize: "18px",
            lineheight: "129%",
            fontWeight: "400",
            height: "48px"
          },
        },
      },
    },
  },
});

export default DealDexTheme;
