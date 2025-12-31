import { Box, Typography, Paper } from "@mui/material";

export default function UserAccountLayout({ title, children }) {
  return (
    <Box sx={{ maxWidth: 1200, my: 5, px: 2 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {title}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
