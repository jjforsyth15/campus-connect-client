"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Alert, Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { WidgetHeader } from "./WidgetHeader";

export const CitationGeneratorWidget: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => {
  const [style, setStyle] = React.useState<"APA" | "MLA">("APA");
  const [fields, setFields] = React.useState({ authorLast: "", authorFirst: "", title: "", source: "", publisher: "", year: "", url: "", accessed: dayjs().format("YYYY-MM-DD") });
  const [outputHtml, setOutputHtml] = React.useState("");
  const [outputPlain, setOutputPlain] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const onChange = (k: string, v: string) => setFields(prev => ({ ...prev, [k]: v }));

  const makeCitation = () => {
    let A = `${fields.authorLast}, ${fields.authorFirst}`.trim();
    if (A.endsWith(",")) A = A.slice(0, -1);
    if (style === "APA") {
      const partsHtml = [A && `${A}.`, fields.year && `(${fields.year}).`, fields.title && `${fields.title}.`, fields.source && `<i>${fields.source}</i>.`, fields.publisher && `${fields.publisher}.`, fields.url && fields.url];
      const partsPlain = [A && `${A}.`, fields.year && `(${fields.year}).`, fields.title && `${fields.title}.`, fields.source && `${fields.source}.`, fields.publisher && `${fields.publisher}.`, fields.url && fields.url];
      setOutputHtml(partsHtml.filter(Boolean).join(" "));
      setOutputPlain(partsPlain.filter(Boolean).join(" "));
    } else {
      const partsHtml = [A && `${fields.authorLast}, ${fields.authorFirst}.`, fields.title && `"${fields.title}."`, fields.source && `<i>${fields.source}</i>`, fields.publisher && `${fields.publisher}`, fields.year && `${fields.year}`, fields.url && `${fields.url}`, fields.accessed && `Accessed ${dayjs(fields.accessed).format("D MMM. YYYY")}.`];
      const partsPlain = [A && `${fields.authorLast}, ${fields.authorFirst}.`, fields.title && `"${fields.title}."`, fields.source && `${fields.source}`, fields.publisher && `${fields.publisher}`, fields.year && `${fields.year}`, fields.url && `${fields.url}`, fields.accessed && `Accessed ${dayjs(fields.accessed).format("D MMM. YYYY")}.`];
      setOutputHtml(partsHtml.filter(Boolean).join(" "));
      setOutputPlain(partsPlain.filter(Boolean).join(" "));
    }
  };

  const copy = async () => { try { await navigator.clipboard.writeText(outputPlain); setCopied(true);} catch {} };

  return (
    <Card className="widget-card" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <WidgetHeader title="Citation Generator (APA/MLA)" onDelete={onDelete} />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack direction={{xs:"column", sm:"row"}} spacing={1}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="style-label">Style</InputLabel>
            <Select labelId="style-label" value={style} label="Style" onChange={(e)=>setStyle((e.target as any).value)}>
              <MenuItem value="APA">APA</MenuItem>
              <MenuItem value="MLA">MLA</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" label="Author Last" value={fields.authorLast} onChange={(e)=>onChange("authorLast", e.target.value)} />
          <TextField size="small" label="Author First" value={fields.authorFirst} onChange={(e)=>onChange("authorFirst", e.target.value)} />
          <TextField size="small" label="Year" value={fields.year} onChange={(e)=>onChange("year", e.target.value)} sx={{ width: 100 }} />
        </Stack>
        <TextField size="small" label="Title" value={fields.title} onChange={(e)=>onChange("title", e.target.value)} fullWidth />
        <Stack direction={{xs:"column", sm:"row"}} spacing={1}>
          <TextField size="small" label="Source (Journal / Site)" value={fields.source} onChange={(e)=>onChange("source", e.target.value)} fullWidth />
          <TextField size="small" label="Publisher" value={fields.publisher} onChange={(e)=>onChange("publisher", e.target.value)} fullWidth />
        </Stack>
        <Stack direction={{xs:"column", sm:"row"}} spacing={1}>
          <TextField size="small" label="URL" value={fields.url} onChange={(e)=>onChange("url", e.target.value)} fullWidth />
          <TextField size="small" type="date" label="Accessed" value={fields.accessed} onChange={(e)=>onChange("accessed", e.target.value)} InputLabelProps={{ shrink: true }} />
        </Stack>
        <Stack direction="row" spacing={1} mt={1}>
          <Button variant="contained" onClick={makeCitation}>Generate</Button>
          <Button variant="outlined" startIcon={<ContentCopyIcon />} disabled={!outputPlain} onClick={copy}>Copy</Button>
        </Stack>
        {outputHtml && (
          <Box sx={{ p: 1.25, border: "1px solid #eee", borderRadius: 2, mt: 1 }} dangerouslySetInnerHTML={{ __html: outputHtml }} />
        )}
        <Snackbar open={copied} autoHideDuration={2000} onClose={()=>setCopied(false)}>
          <Alert severity="success" sx={{ width: "100%" }}>Copied to clipboard</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
