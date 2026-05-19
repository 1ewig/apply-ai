export const clerkTheme = {
  variables: {
    colorPrimary: "#2563EB",
    colorText: "#475569",
    colorTextSecondary: "#5E6E82",
    colorBackground: "#F3F4F6",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#0F172A",
    colorBorder: "rgba(0, 0, 0, 0.07)",
    borderRadius: "0.75rem",
    fontFamily: '"DM Sans", sans-serif',
    fontFamilyButtons: '"DM Sans", sans-serif',
    fontSize: "0.875rem",
  },
  elements: {
    card: {
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.07)",
      border: "1px solid rgba(0, 0, 0, 0.07)",
    },
    socialButtonsBlockButton: {
      borderRadius: "0.75rem",
      border: "1px solid rgba(0, 0, 0, 0.07)",
    },
    headerTitle: {
      fontFamily: '"Bricolage Grotesque", sans-serif',
      fontWeight: 800,
      color: "#0F172A",
    },
    formButtonPrimary: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: "0.875rem",
      borderRadius: "0.75rem",
      textTransform: "none",
    },
    formFieldInput: {
      borderRadius: "0.75rem",
      border: "1px solid rgba(0, 0, 0, 0.07)",
    },
    footerActionLink: {
      color: "#2563EB",
      fontWeight: 600,
    },
    userButtonPopoverCard: {
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
      border: "1px solid rgba(0, 0, 0, 0.07)",
      borderRadius: "0.75rem",
    },
    userButtonPopoverActionItem: {
      fontSize: "0.8125rem",
    },
    userButtonPopoverActionButton: {
      borderRadius: "0.5rem",
    },
  },
} as const;
