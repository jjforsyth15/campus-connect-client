import * as React from "react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { WidgetHeader } from "./WidgetHeader";

export const KPI: React.FC<{ label: string; value: string; hint?: string; onDelete?: () => void }> = ({ label, value, hint, onDelete }) => (
  <Card className="widget-card" sx={{ borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
    <WidgetHeader title={label} onDelete={onDelete} />
    <CardContent>
      <Stack direction="row" alignItems="baseline" spacing={1} mt={0.5}>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        {hint && <Chip size="small" label={hint} variant="outlined" />}
      </Stack>
    </CardContent>
  </Card>
);
